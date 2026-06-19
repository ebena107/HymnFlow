// HymnFlow OBS Dock Controller
(() => {
  const listEl = document.getElementById('hymnList');
  const searchEl = document.getElementById('search');
  const statusEl = document.getElementById('status');
  const previewEl = document.getElementById('preview');
  const fontSizeValueEl = document.getElementById('fontSizeValue');
  const verseInfoEl = document.getElementById('verseInfo');
  const currentTitleEl = document.getElementById('currentTitle');

  // Cached nav button refs — avoid getElementById on every keypress
  const navBtns = {
    prevVerse: null,
    nextVerse: null,
    prevLine: null,
    nextLine: null,
    jumpChorus: null,
  };

  let hymns = [];
  let filtered = [];
  let currentHymn = null;
  let currentVerse = 0;
  let currentLineOffset = 0;
  let isDisplaying = false;
  let isShowingChorus = false;
  let services = [];
  let currentService = null;
  let currentServiceItemIndex = -1;
  let editingService = null;
  let currentItemFormType = null;
  let editingItemIndex = null;
  let serviceEditorDirty = false;
  let activeSourceFilter = 'all';
  let currentSearchQuery = '';
  let qsChunks = [];
  let qsChunkIdx = 0;
  let cachedSettingsJson = null;
  let settingsCacheValid = false;

  const settings = {
    linesPerPage: 2,
    fontFamily: "Inter, sans-serif",
    fontSize: 48,
    bold: false,
    italic: false,
    shadow: false,
    glow: false,
    outline: false,
    outlineColor: '#000000',
    outlineWidth: 2,
    textColor: '#ffffff',
    bgType: 'transparent',
    bgColorA: '#000000',
    bgColorB: '#2b2b2b',
    bgOpacity: 80,
    animation: 'fade',
    position: 'bottom',
    activeTab: 'library',
    obsWsHost: '127.0.0.1',
    obsWsPort: 4455,
    obsWsPassword: '',
    obsWsEnabled: false
  };

  const storageKeys = {
    hymns: 'hymnflow-hymns',
    cmd: 'hymnflow-lowerthird-command',
    textslide: 'hymnflow-textslide-command',
    prefs: 'hymnflow-dock-settings',
    services: 'hymnflow-services'
  };

  // ========================================
  // ID Generation (collision-free)
  // ========================================
  let lastHymnTimestamp = 0;
  let sameTimeHymnCounter = 0;
  let lastServiceTimestamp = 0;
  let sameTimeServiceCounter = 0;

  function generateUniqueHymnId() {
    const now = Date.now();
    if (now === lastHymnTimestamp) {
      sameTimeHymnCounter++;
    } else {
      lastHymnTimestamp = now;
      sameTimeHymnCounter = 0;
    }
    const randomPart = Math.random().toString(36).substring(2, 10);
    return `hymn_${now}_${sameTimeHymnCounter}_${randomPart}`;
  }

  function generateUniqueServiceId() {
    const now = Date.now();
    if (now === lastServiceTimestamp) {
      sameTimeServiceCounter++;
    } else {
      lastServiceTimestamp = now;
      sameTimeServiceCounter = 0;
    }
    const randomPart = Math.random().toString(36).substring(2, 10);
    return `service_${now}_${sameTimeServiceCounter}_${randomPart}`;
  }

  // ========================================
  // XSS Prevention - HTML Escaping
  // ========================================
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return (text || '').replace(/[&<>"']/g, (char) => map[char]);
  }

  // ========================================
  // Tab Navigation
  // ========================================
  function switchTab(tabId) {
    const validTabs = ['library', 'service', 'live', 'style'];
    if (!validTabs.includes(tabId)) tabId = 'library';
    document.querySelectorAll('.tab-btn').forEach(btn => {
      const active = btn.dataset.tab === tabId;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
      btn.setAttribute('tabindex', active ? '0' : '-1');
    });
    document.querySelectorAll('.tab-panel').forEach(panel => {
      const active = panel.id === `tab-${tabId}`;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });
    settings.activeTab = tabId;
    saveSettings();
  }

  function itemDisplayLabel(item) {
    if (item.type === 'hymn') {
      const h = hymns.find(h => h.id === item.hymnId);
      if (!h) return '(Hymn not found)';
      const num = h.metadata?.number ? `${h.metadata.number} - ` : '';
      return num + (typeof h.title === 'string' ? h.title : String(h.title ?? ''));
    }
    return item.label || '(Untitled)';
  }

  function itemTypeBadge(type) {
    const map = { hymn: 'Hymn', scripture: 'Scripture', announce: 'Announce', divider: 'Divider' };
    return map[type] || type;
  }

  // ========================================
  // Search Optimization with Debouncing
  // ========================================
  let searchIndex = [];
  let searchTimeout = null;

  function buildSearchIndex() {
    searchIndex = hymns.map(h => ({
      titleLower: h.title.toLowerCase(),
      authorLower: (h.author || '').toLowerCase(),
      number: h.metadata?.number || 0,
      sourceAbbrLower: (h.metadata?.sourceAbbr || '').toLowerCase(),
      sourceLower: (h.metadata?.source || '').toLowerCase()
    }));
  }

  function performSearch(query, debounceMs = 150) {
    return new Promise((resolve) => {
      clearTimeout(searchTimeout);

      searchTimeout = setTimeout(() => {
        if (!query.trim()) {
          resolve(hymns); // No filter
          return;
        }

        const q = query.toLowerCase();
        const results = hymns.filter((h, idx) => {
          if (idx >= searchIndex.length) return false;

          const idxEntry = searchIndex[idx];

          // Build combined reference for search (e.g., "ch 123")
          const combinedRef = idxEntry.sourceAbbrLower && idxEntry.number
            ? `${idxEntry.sourceAbbrLower} ${idxEntry.number}`
            : '';

          // Search in pre-computed lowercase fields
          return (
            idxEntry.titleLower.includes(q) ||
            idxEntry.authorLower.includes(q) ||
            (q.length > 1 && idxEntry.number.toString().includes(q)) ||
            idxEntry.sourceAbbrLower.includes(q) ||
            idxEntry.sourceLower.includes(q) ||
            combinedRef.includes(q)
          );
        });

        resolve(results);
      }, debounceMs);
    });
  }

  function loadHymns() {
    const stored = localStorage.getItem(storageKeys.hymns);
    if (stored) {
      try {
        hymns = JSON.parse(stored);
      } catch (err) {
        console.error('[Hymns Load Error] Corrupted data, reverting to defaults:', err);
        hymns = DEFAULT_HYMNS || [];
        localStorage.setItem(storageKeys.hymns, JSON.stringify(hymns));
      }
    } else {
      hymns = DEFAULT_HYMNS || [];
      localStorage.setItem(storageKeys.hymns, JSON.stringify(hymns));
    }
    const numChanged = normalizeHymnNumbers(hymns);
    const strChanged = normalizeHymnStrings(hymns);
    if (numChanged || strChanged) saveHymns();
    filtered = hymns;
  }

  function normalizeHymnStrings(items) {
    let changed = false;
    (items || []).forEach(hymn => {
      if (!hymn) return;
      if (typeof hymn.title !== 'string') {
        hymn.title = hymn.title != null ? String(hymn.title) : 'Untitled';
        changed = true;
      }
      if (typeof hymn.author !== 'string') {
        hymn.author = hymn.author != null ? String(hymn.author) : '';
        changed = true;
      }
      if (typeof hymn.chorus !== 'string') {
        hymn.chorus = hymn.chorus != null ? String(hymn.chorus) : '';
        changed = true;
      }
    });
    return changed;
  }

  function normalizeHymnNumbers(items) {
    let changed = false;
    (items || []).forEach(hymn => {
      if (!hymn || !hymn.metadata || hymn.metadata.number === undefined || hymn.metadata.number === null) {
        return;
      }

      const rawNumber = hymn.metadata.number;
      if (typeof rawNumber === 'string') {
        const parsedNumber = parseInt(rawNumber, 10);
        if (Number.isFinite(parsedNumber) && parsedNumber >= 0) {
          if (parsedNumber !== rawNumber) {
            hymn.metadata.number = parsedNumber;
            changed = true;
          }
        } else {
          delete hymn.metadata.number;
          changed = true;
        }
        return;
      }

      if (!Number.isFinite(rawNumber) || !Number.isInteger(rawNumber) || rawNumber < 0) {
        delete hymn.metadata.number;
        changed = true;
      }
    });

    return changed;
  }

  function saveHymns() {
    try {
      localStorage.setItem(storageKeys.hymns, JSON.stringify(hymns));
      buildSearchIndex();
    } catch (err) {
      console.error('[Hymns Save Error]', err);
      if (err.name === 'QuotaExceededError') {
        statusEl.textContent = `Storage full (${hymns.length} hymns). Export your hymns then clear storage to continue.`;
      } else {
        statusEl.textContent = 'Error saving hymns: ' + err.message;
      }
    }
  }

  function loadSettings() {
    const stored = localStorage.getItem(storageKeys.prefs);
    if (stored) {
      try {
        Object.assign(settings, JSON.parse(stored));
      } catch (err) {
        console.error('[Settings Load Error] Corrupted settings, using defaults:', err);
      }
    }
    settingsCacheValid = false;
    applySettingsUI();
  }

  // Debounced settings save - prevents thrashing localStorage
  let settingsSaveTimeout = null;
  function saveSettings() {
    clearTimeout(settingsSaveTimeout);
    settingsSaveTimeout = setTimeout(() => {
      try {
        localStorage.setItem(storageKeys.prefs, JSON.stringify(settings));
        settingsCacheValid = false;
        if (isDisplaying && currentHymn) {
          sendCommand('show');
        }
      } catch (err) {
        console.error('[Settings Save Error]', err);
        if (err.name === 'QuotaExceededError') {
          statusEl.textContent = 'Storage full — export hymns to free space.';
        } else {
          statusEl.textContent = 'Error saving settings: ' + err.message;
        }
      }
    }, 300); // Debounce: wait 300ms after last change before saving
  }

  // ========================================
  // obs-websocket client  (Layer 2 — global hotkeys)
  // ========================================
  let obsWs = null;
  let obsWsRetryTimer = null;
  let obsWsIntentional = false;   // true while user wants to be connected

  async function _sha256b64(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return btoa(String.fromCharCode(...new Uint8Array(buf)));
  }

  function obsWsSetStatus(state) {
    const badge   = document.getElementById('obsWsBadge');
    const btnConn = document.getElementById('btnObsWsConnect');
    const btnDisc = document.getElementById('btnObsWsDisconnect');
    if (badge) {
      badge.className = `obs-ws-badge obs-ws-${state}`;
      badge.title = { connecting:'Connecting…', connected:'Connected', disconnected:'Disconnected', error:'Error' }[state] || state;
    }
    if (btnConn) btnConn.disabled = (state === 'connecting' || state === 'connected');
    if (btnDisc) btnDisc.disabled = (state === 'disconnected');
  }

  function dispatchHotkeyAction(action) {
    switch (action) {
      case 'next_verse':     nextVerse();        break;
      case 'prev_verse':     prevVerse();        break;
      case 'next_line':      nextLineWindow();   break;
      case 'prev_line':      prevLineWindow();   break;
      case 'next_item':      nextServiceItem();  break;
      case 'prev_item':      prevServiceItem();  break;
      case 'toggle_display': toggleDisplay();    break;
    }
  }

  async function obsWsConnect() {
    obsWsIntentional = true;
    clearTimeout(obsWsRetryTimer);
    if (obsWs) { obsWs.onclose = null; obsWs.close(); obsWs = null; }

    const host = settings.obsWsHost || '127.0.0.1';
    const port = settings.obsWsPort || 4455;
    obsWsSetStatus('connecting');

    let ws;
    try { ws = new WebSocket(`ws://${host}:${port}`); }
    catch (_) { obsWsSetStatus('error'); return; }

    obsWs = ws;

    ws.onmessage = async (e) => {
      let msg;
      try { msg = JSON.parse(e.data); } catch (_) { return; }

      if (msg.op === 0) {  // Hello — authenticate and identify
        const auth = msg.d.authentication;
        let authStr;
        if (auth && settings.obsWsPassword) {
          const secret = await _sha256b64(settings.obsWsPassword + auth.salt);
          authStr = await _sha256b64(secret + auth.challenge);
        }
        const identify = { op: 1, d: { rpcVersion: 1, eventSubscriptions: 1 } };
        if (authStr) identify.d.authentication = authStr;
        ws.send(JSON.stringify(identify));
      }

      if (msg.op === 2) {  // Identified — handshake complete
        obsWsSetStatus('connected');
      }

      if (msg.op === 5 && msg.d.eventType === 'CustomEvent') {  // Event
        const data = msg.d.eventData || {};
        if (data.source === 'hymnflow') dispatchHotkeyAction(data.action);
      }
    };

    ws.onerror = () => obsWsSetStatus('error');

    ws.onclose = () => {
      obsWs = null;
      obsWsSetStatus('disconnected');
      if (obsWsIntentional) {
        obsWsRetryTimer = setTimeout(obsWsConnect, 5000);
      }
    };
  }

  function obsWsDisconnect() {
    obsWsIntentional = false;
    clearTimeout(obsWsRetryTimer);
    if (obsWs) { obsWs.onclose = null; obsWs.close(); obsWs = null; }
    obsWsSetStatus('disconnected');
    settings.obsWsEnabled = false;
    saveSettings();
  }

  function highlightMatch(text, query) {
    if (!query || !text) return escapeHtml(text || '');
    const escaped = escapeHtml(text);
    const escapedQuery = escapeHtml(query);
    if (!escapedQuery) return escaped;
    const regex = new RegExp(escapedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    return escaped.replace(regex, m => `<mark>${m}</mark>`);
  }

  const LIST_CAP = 200;

  function renderList() {
    let display = filtered;
    if (activeSourceFilter !== 'all') {
      display = filtered.filter(h => (h.metadata?.sourceAbbr || '') === activeSourceFilter);
    }

    if (!display.length) {
      const msg = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('hymns.noHymnsFound') : 'No hymns found';
      listEl.innerHTML = `<div class="list-item">${msg}</div>`;
      return;
    }

    const total = display.length;
    const capped = total > LIST_CAP;
    if (capped) display = display.slice(0, LIST_CAP);

    const q = currentSearchQuery.trim();
    listEl.innerHTML = display.map(h => {
      const sourceAbbr = h.metadata?.sourceAbbr || '';
      const number = h.metadata?.number || '';
      let hymnRef = '';
      if (sourceAbbr && number) {
        hymnRef = `${sourceAbbr} ${number} - `;
      } else if (number) {
        hymnRef = `${number} - `;
      }
      const fullTitle = hymnRef + (typeof h.title === 'string' ? h.title : String(h.title ?? ''));
      const highlightedTitle = highlightMatch(fullTitle, q);
      const safeAuthor = escapeHtml(typeof h.author === 'string' ? h.author || 'Unknown' : 'Unknown');
      const isActive = currentHymn && currentHymn.id === h.id ? ' active' : '';
      const versesLabel = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('hymns.labels.versesCount', { count: h.verses.length }) : `${h.verses.length} verse(s)`;
      return `
      <div class="list-item${isActive}" data-id="${escapeHtml(h.id)}" role="option" aria-selected="${isActive ? 'true' : 'false'}">
        <div class="title">${highlightedTitle}</div>
        <div class="meta">${safeAuthor} • ${versesLabel}</div>
      </div>`;
    }).join('') + (capped
      ? `<div class="list-cap-notice">Showing ${LIST_CAP} of ${total} — refine your search</div>`
      : '');
  }

  function renderSourceFilters() {
    const container = document.getElementById('sourceFilters');
    if (!container) return;

    const sources = [...new Set(hymns.map(h => h.metadata?.sourceAbbr).filter(Boolean))].sort();
    if (sources.length === 0) {
      container.innerHTML = '';
      return;
    }

    const allChip = `<button class="source-chip${activeSourceFilter === 'all' ? ' active' : ''}" data-source="all" aria-pressed="${activeSourceFilter === 'all'}">All</button>`;
    const chips = sources.map(src =>
      `<button class="source-chip${activeSourceFilter === src ? ' active' : ''}" data-source="${escapeHtml(src)}" aria-pressed="${activeSourceFilter === src}">${escapeHtml(src)}</button>`
    ).join('');
    container.innerHTML = allChip + chips;
  }

  function selectHymn(id) {
    currentHymn = hymns.find(h => h.id === id);
    currentVerse = 0;
    currentLineOffset = 0;
    isShowingChorus = false;

    // Switch to Live tab and auto-expand preview
    switchTab('live');
    const toggle = document.getElementById('previewToggle');
    const body = document.getElementById('previewBody');
    if (toggle && body && toggle.getAttribute('aria-expanded') === 'false') {
      toggle.setAttribute('aria-expanded', 'true');
      body.hidden = false;
    }

    if (currentService) {
      const idx = currentService.items.findIndex(item => item.type === 'hymn' && item.hymnId === id);
      currentServiceItemIndex = idx;
    }
    updatePreview();
    updateServiceBanner();
    renderList();
    if (isDisplaying) sendCommand('show');
  }

  function getSettingsSnapshot() {
    if (!settingsCacheValid) {
      cachedSettingsJson = JSON.stringify(settings);
      settingsCacheValid = true;
    }
    return JSON.parse(cachedSettingsJson);
  }

  function getCurrentLines() {
    if (!currentHymn) return [];
    if (isShowingChorus && currentHymn.chorus) return currentHymn.chorus.split('\n');
    return (currentHymn.verses[currentVerse] || '').split('\n');
  }

  function updatePreview() {
    if (!currentHymn) {
      if (window.HymnFlowI18n) {
        currentTitleEl.textContent = window.HymnFlowI18n.getTranslation('hymns.noHymnSelected');
      } else {
        currentTitleEl.textContent = 'No hymn selected';
      }
      verseInfoEl.textContent = '-';
      previewEl.textContent = '';
      updateNavButtonStates();
      return;
    }
    currentTitleEl.textContent = currentHymn.title;

    const lines = getCurrentLines();
    const windowed = lines.slice(currentLineOffset, currentLineOffset + settings.linesPerPage);
    previewEl.textContent = windowed.join('\n');

    const isLastVerse = currentVerse === currentHymn.verses.length - 1;
    const i18n = window.HymnFlowI18n;
    const isLastVerseLabel = isLastVerse && !isShowingChorus && !currentHymn.chorus
      ? (i18n ? i18n.getTranslation('navigation.lastVerse') : ' · Last verse')
      : (isLastVerse && isShowingChorus
          ? (i18n ? i18n.getTranslation('navigation.lastChorus') : ' · Last chorus')
          : '');

    if (window.HymnFlowI18n) {
      const i18nKey = (isShowingChorus && currentHymn.chorus) ? 'navigation.chorusInfo' : 'navigation.verseInfo';
      verseInfoEl.textContent = window.HymnFlowI18n.getTranslation(i18nKey, {
        current: currentVerse + 1,
        total: currentHymn.verses.length,
        startLine: currentLineOffset + 1,
        endLine: Math.min(lines.length, currentLineOffset + settings.linesPerPage),
        totalLines: lines.length
      }) + isLastVerseLabel;
    }

    updateNavButtonStates();
  }

  function updateNavButtonStates() {
    const { prevVerse, nextVerse, prevLine, nextLine, jumpChorus } = navBtns;

    if (!currentHymn) {
      [prevVerse, nextVerse, prevLine, nextLine, jumpChorus].forEach(b => { if (b) b.disabled = true; });
      return;
    }

    const lines = getCurrentLines();
    const atFirstContent = currentVerse === 0 && !isShowingChorus;
    const atLastContent = currentVerse === currentHymn.verses.length - 1 &&
      (!currentHymn.chorus || isShowingChorus);
    const atFirstLineWindow = currentLineOffset === 0;
    const atLastLineWindow = currentLineOffset + settings.linesPerPage >= lines.length;

    if (prevVerse)  prevVerse.disabled  = atFirstContent;
    if (nextVerse)  nextVerse.disabled  = atLastContent;
    if (prevLine)   prevLine.disabled   = atFirstContent && atFirstLineWindow;
    if (nextLine)   nextLine.disabled   = atLastContent && atLastLineWindow;
    if (jumpChorus) jumpChorus.disabled = !currentHymn.chorus;
  }

  function sendCommand(type) {
    try {
      if (type === 'hide') {
        localStorage.setItem(storageKeys.cmd, JSON.stringify({ type: 'hide', timestamp: Date.now() }));
        isDisplaying = false;
        updateDisplayButton();
        return;
      }
      if (!currentHymn) return;

      const lines = getCurrentLines();
      const windowed = lines.slice(currentLineOffset, currentLineOffset + settings.linesPerPage);

      const payload = {
        type: 'show',
        hymnId: currentHymn.id,
        title: currentHymn.title,
        author: currentHymn.author,
        metadata: currentHymn.metadata || {},
        verseNumber: currentVerse + 1,
        totalVerses: currentHymn.verses.length,
        isChorus: isShowingChorus,
        lines: windowed,
        settings: getSettingsSnapshot(),
        timestamp: Date.now()
      };
      localStorage.setItem(storageKeys.cmd, JSON.stringify(payload));
      isDisplaying = true;
      updateDisplayButton();
    } catch (err) {
      console.error('[Send Command Error]', err);
      if (window.HymnFlowI18n) {
        statusEl.textContent = window.HymnFlowI18n.getTranslation('app.errors.sendFailed', { error: err.message });
      } else {
        statusEl.textContent = 'Error sending to overlay: ' + err.message;
      }
    }
  }

  function toggleDisplay() {
    if (isDisplaying) {
      sendCommand('hide');
    } else {
      sendCommand('show');
    }
  }

  function updateDisplayButton() {
    const toggle = document.getElementById('displayToggle');
    const liveIndicator = document.getElementById('liveIndicator');
    const navSection = document.querySelector('.section .navigation-controls')?.closest('.section');
    if (toggle) {
      toggle.checked = isDisplaying;
    }
    if (liveIndicator) {
      if (isDisplaying) {
        liveIndicator.classList.add('active');
      } else {
        liveIndicator.classList.remove('active');
      }
    }
    if (navSection) {
      if (isDisplaying) {
        navSection.classList.remove('display-off');
      } else {
        navSection.classList.add('display-off');
      }
    }
  }

  function nextVerse() {
    if (!currentHymn) return;

    // Logic: Verse -> Chorus -> Next Verse
    if (currentHymn.chorus && !isShowingChorus) {
      isShowingChorus = true;
      currentLineOffset = 0;
      updatePreview();
      sendCommand('show');
      return;
    }

    if (currentVerse < currentHymn.verses.length - 1) {
      currentVerse++;
      isShowingChorus = false;
      currentLineOffset = 0;
      updatePreview();
      sendCommand('show');
      return;
    }

    // At last content — advance to next service item if one exists
    if (currentService && currentServiceItemIndex >= 0 &&
        currentServiceItemIndex < currentService.items.length - 1) {
      nextServiceItem();
    }
  }

  function prevVerse() {
    if (!currentHymn) return;

    if (currentHymn.chorus) {
      // If showing chorus, go back to its verse
      if (isShowingChorus) {
        isShowingChorus = false;
        currentLineOffset = 0;
        updatePreview();
        sendCommand('show');
        return;
      }
      // If showing verse (and not verse 1), go back to previous chorus
      if (currentVerse > 0) {
        currentVerse--;
        isShowingChorus = true;
        currentLineOffset = 0;
        updatePreview();
        sendCommand('show');
        return;
      }
    } else {
      // Standard logic without chorus
      if (currentVerse > 0) {
        currentVerse--;
        currentLineOffset = 0;
        updatePreview();
        sendCommand('show'); // Auto-update overlay
      }
    }
  }

  function nextLineWindow() {
    if (!currentHymn) return;

    const lines = getCurrentLines();
    if (currentLineOffset + settings.linesPerPage < lines.length) {
      currentLineOffset += settings.linesPerPage;
      updatePreview();
      sendCommand('show');
    } else {
      // Try to go to next verse/chorus
      nextVerse();
    }
  }

  function prevLineWindow() {
    if (!currentHymn) return;
    if (currentLineOffset - settings.linesPerPage >= 0) {
      currentLineOffset -= settings.linesPerPage;
      updatePreview();
      sendCommand('show');
    } else {
      // At top of current block, try to go to previous block
      // But we need to land on the last page of the previous block

      // Save current state to revert if we can't move back
      const oldVerse = currentVerse;
      const oldChorus = isShowingChorus;

      prevVerse();

      // If state changed, calculate new offset
      if (currentVerse !== oldVerse || isShowingChorus !== oldChorus) {
        const prevLines = getCurrentLines();
        if (prevLines.length > 0) {
          currentLineOffset = Math.max(0, Math.floor((prevLines.length - 1) / settings.linesPerPage) * settings.linesPerPage);
        }

        updatePreview();
        sendCommand('show');
      }
    }
  }

  function sendTextSlide() {
    const input = document.getElementById('textSlideInput');
    const text = input ? input.value.trim() : '';
    if (!text) return;
    try {
      const payload = {
        type: 'textslide',
        lines: text.split('\n'),
        settings: getSettingsSnapshot(),
        timestamp: Date.now()
      };
      localStorage.setItem(storageKeys.textslide, JSON.stringify(payload));
      if (statusEl) statusEl.textContent = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('textSlide.sent') : 'Text slide sent';
    } catch (err) {
      console.error('[Text Slide Error]', err);
    }
  }

  function clearTextSlide() {
    qsChunks = [];
    qsChunkIdx = 0;
    updateQsControls();
    try {
      localStorage.setItem(storageKeys.textslide, JSON.stringify({ type: 'hide', timestamp: Date.now() }));
      if (statusEl) statusEl.textContent = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('textSlide.cleared') : 'Text slide cleared';
      if (isDisplaying && currentHymn) sendCommand('show');
    } catch (err) {
      console.error('[Text Slide Clear Error]', err);
    }
  }

  // Silently clears the textslide overlay without resetting QS state or status bar.
  // Used when a service item transition should hide any active text slide.
  function _clearTextSlideOnly() {
    try {
      localStorage.setItem(storageKeys.textslide, JSON.stringify({ type: 'hide', timestamp: Date.now() }));
    } catch (err) {}
  }

  function sendScriptureToOverlay(reference, text) {
    try {
      const payload = {
        type: 'textslide',
        title: reference || '',
        lines: text.split('\n'),
        settings: getSettingsSnapshot(),
        timestamp: Date.now()
      };
      localStorage.setItem(storageKeys.textslide, JSON.stringify(payload));
    } catch (err) {
      console.error('[Scripture Overlay Error]', err);
    }
  }

  function parseScriptureChunks(text) {
    return text.split(/\n[ \t]*\n/).map(s => s.trim()).filter(Boolean);
  }

  function updateQsControls() {
    const total = qsChunks.length;
    const info = document.getElementById('qsChunkInfo');
    const prev = document.getElementById('btnQsPrev');
    const next = document.getElementById('btnQsNext');
    if (info) info.textContent = total > 0 ? `${qsChunkIdx + 1}/${total}` : '—';
    if (prev) prev.disabled = qsChunkIdx <= 0 || total === 0;
    if (next) next.disabled = total === 0 || qsChunkIdx >= total - 1;
  }

  function qsLookup() {
    const refInput = document.getElementById('qsRef');
    const textArea = document.getElementById('qsText');
    const ref = (refInput?.value || '').trim();
    if (!ref) { refInput?.focus(); return; }

    if (!window.HymnFlowBibleLookup?.isLoaded()) {
      if (statusEl) statusEl.textContent = 'Bible not loaded — import a translation in the Library tab';
      return;
    }

    const result = window.HymnFlowBibleLookup.lookup(ref);
    if (result.found) {
      if (refInput) refInput.value = result.reference;
      if (textArea) textArea.value = result.text;
      if (statusEl) statusEl.textContent = result.verseCount > 1
        ? `Found ${result.verseCount} verses — press Display, then use ← → to step through`
        : `Found: ${result.reference} — press Display to send to overlay`;
    } else {
      if (statusEl) statusEl.textContent = result.error;
      refInput?.select();
    }
  }

  function displayQuickScripture() {
    const ref = (document.getElementById('qsRef')?.value || '').trim();
    const rawText = (document.getElementById('qsText')?.value || '').trim();
    if (!rawText) { document.getElementById('qsText')?.focus(); return; }
    qsChunks = parseScriptureChunks(rawText);
    if (!qsChunks.length) return;
    qsChunkIdx = 0;
    sendScriptureToOverlay(ref, qsChunks[0]);
    updateQsControls();
    if (statusEl) statusEl.textContent = ref
      ? (window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('quickScripture.status', { ref }) : `Scripture: ${ref}`)
      : (window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('quickScripture.statusNoRef') : 'Scripture displayed');
  }

  function qsNext() {
    if (qsChunkIdx >= qsChunks.length - 1) return;
    qsChunkIdx++;
    const ref = (document.getElementById('qsRef')?.value || '').trim();
    sendScriptureToOverlay(ref, qsChunks[qsChunkIdx]);
    updateQsControls();
  }

  function qsPrev() {
    if (qsChunkIdx <= 0) return;
    qsChunkIdx--;
    const ref = (document.getElementById('qsRef')?.value || '').trim();
    sendScriptureToOverlay(ref, qsChunks[qsChunkIdx]);
    updateQsControls();
  }

  function resetPosition() {
    currentLineOffset = 0;
    currentVerse = 0;
    isShowingChorus = false;
    updatePreview();
    if (isDisplaying && currentHymn) sendCommand('show');
  }

  function jumpToChorus() {
    if (!currentHymn || !currentHymn.chorus) {
      const msg = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('hymns.alerts.noChorus') : 'No chorus available for this hymn';
      alert(msg);
      return;
    }
    isShowingChorus = true;
    currentLineOffset = 0;
    updatePreview();
    sendCommand('show');
  }

  function emergencyClear() {
    sendCommand('hide');
    localStorage.setItem(storageKeys.textslide, JSON.stringify({ type: 'hide', timestamp: Date.now() }));
    qsChunks = [];
    qsChunkIdx = 0;
    updateQsControls();
    currentHymn = null;
    currentVerse = 0;
    currentLineOffset = 0;
    isShowingChorus = false;
    updatePreview();
    renderList();
  }

  function removeSelectedHymn() {
    if (!currentHymn) {
      const msg = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('hymns.alerts.noHymnSelected') : 'No hymn selected';
      alert(msg);
      return;
    }
    const affected = services.filter(s =>
      s.items.some(item => item.type === 'hymn' && item.hymnId === currentHymn.id)
    );
    let confirmMsg = window.HymnFlowI18n
      ? window.HymnFlowI18n.getTranslation('hymns.confirmations.delete', { title: currentHymn.title })
      : `Delete "${currentHymn.title}"?`;
    if (affected.length > 0) {
      const names = affected.map(s => `• ${s.name}`).join('\n');
      confirmMsg += `\n\nThis hymn is used in ${affected.length} service(s):\n${names}\nIt will be removed from those services.`;
    }
    if (confirm(confirmMsg)) {
      deleteHymn(currentHymn.id);
    }
  }

  function trapFocus(modal) {
    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (modal._trapController) modal._trapController.abort();
    modal._trapController = new AbortController();
    modal.addEventListener('keydown', function onKey(e) {
      if (e.key !== 'Tab') {
        if (e.key === 'Escape') closeEditModal();
        return;
      }
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }, { signal: modal._trapController.signal });
  }

  function openEditModal(hymn) {
    const modal = document.getElementById('editModal');
    const modalTitle = document.getElementById('modalTitle');

    if (hymn) {
      // Edit existing hymn
      modalTitle.textContent = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('modal.editHymn') : 'Edit Hymn';
      document.getElementById('editNumber').value = hymn.metadata?.number || '';
      document.getElementById('editSourceAbbr').value = hymn.metadata?.sourceAbbr || '';
      document.getElementById('editSource').value = hymn.metadata?.source || '';
      document.getElementById('editTitle').value = hymn.title;
      document.getElementById('editAuthor').value = hymn.author || '';
      document.getElementById('editVerses').value = hymn.verses.join('\n\n');
      document.getElementById('editChorus').value = hymn.chorus || '';
      modal.dataset.hymnId = hymn.id;
    } else {
      // Add new hymn
      modalTitle.textContent = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('modal.addHymn') : 'Add Hymn';
      document.getElementById('editNumber').value = '';
      document.getElementById('editSourceAbbr').value = '';
      document.getElementById('editSource').value = '';
      document.getElementById('editTitle').value = '';
      document.getElementById('editAuthor').value = '';
      document.getElementById('editVerses').value = '';
      document.getElementById('editChorus').value = '';
      modal.dataset.hymnId = '';
    }

    modal.style.display = 'flex';
    // Move focus to first field and trap Tab within modal
    requestAnimationFrame(() => {
      const firstInput = modal.querySelector('input, textarea');
      if (firstInput) firstInput.focus();
      trapFocus(modal);
    });
  }

  function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
  }

  function saveHymnEdit() {
    const modal = document.getElementById('editModal');
    const hymnId = modal.dataset.hymnId;
    const number = document.getElementById('editNumber').value.trim();
    const sourceAbbr = document.getElementById('editSourceAbbr').value.trim().toUpperCase();
    const source = document.getElementById('editSource').value.trim();
    const title = document.getElementById('editTitle').value.trim();
    const author = document.getElementById('editAuthor').value.trim();
    const versesText = document.getElementById('editVerses').value.trim();
    const chorus = document.getElementById('editChorus').value.trim();

    if (!title) {
      const msg = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('hymns.alerts.titleRequired') : 'Title is required';
      alert(msg);
      return;
    }

    if (!versesText) {
      const msg = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('hymns.alerts.versesRequired') : 'At least one verse is required';
      alert(msg);
      return;
    }

    const verses = versesText.split(/\n\s*\n/).map(v => v.trim()).filter(Boolean);

    if (hymnId) {
      // Edit existing hymn
      const hymn = hymns.find(h => h.id === hymnId);
      if (hymn) {
        hymn.title = title;
        hymn.author = author;
        hymn.verses = verses;
        hymn.chorus = chorus;

        // Update metadata
        hymn.metadata = hymn.metadata || {};

        if (number) {
          const parsedNumber = parseInt(number, 10);
          if (Number.isFinite(parsedNumber)) {
            hymn.metadata.number = parsedNumber;
          } else {
            delete hymn.metadata.number;
          }
        } else {
          delete hymn.metadata.number;
        }

        if (sourceAbbr) {
          hymn.metadata.sourceAbbr = sourceAbbr;
        } else {
          delete hymn.metadata.sourceAbbr;
        }

        if (source) {
          hymn.metadata.source = source;
        } else {
          delete hymn.metadata.source;
        }

        // Validate before saving
        const { valid, errors } = window.HymnValidator.validateHymn(hymn);
        if (!valid) {
          const msg = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('hymns.alerts.validationFailed', { errors: errors.join('\n') }) : 'Hymn validation failed:\n' + errors.join('\n');
          alert(msg);
          return;
        }
      }
    } else {
      // Add new hymn
      const metadata = {};
      if (number) {
        const parsedNumber = parseInt(number, 10);
        if (Number.isFinite(parsedNumber)) {
          metadata.number = parsedNumber;
        }
      }
      if (sourceAbbr) metadata.sourceAbbr = sourceAbbr;
      if (source) metadata.source = source;

      const newHymn = {
        id: generateUniqueHymnId(),
        title,
        author,
        verses,
        chorus,
        metadata,
        createdAt: new Date().toISOString()
      };

      // Validate before saving
      const { valid, errors } = window.HymnValidator.validateHymn(newHymn);
      if (!valid) {
        const msg = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('hymns.alerts.validationFailed', { errors: errors.join('\n') }) : 'Hymn validation failed:\n' + errors.join('\n');
        alert(msg);
        return;
      }

      hymns.push(newHymn);
    }

    saveHymns();
    filtered = hymns;
    renderSourceFilters();
    renderList();
    updatePreview();
    closeEditModal();
    if (window.HymnFlowI18n) {
      statusEl.textContent = window.HymnFlowI18n.getTranslation(hymnId ? 'app.status.hymnUpdated' : 'app.status.hymnAdded');
    } else {
      statusEl.textContent = hymnId ? 'Hymn updated' : 'Hymn added';
    }
  }


  function deleteHymn(id) {
    hymns = hymns.filter(h => h.id !== id);
    if (currentHymn && currentHymn.id === id) currentHymn = null;

    // Clean stale references from all services
    let servicesModified = 0;
    services.forEach(service => {
      const before = service.items.length;
      if (currentService && currentService.id === service.id) {
        const curItem = service.items[currentServiceItemIndex];
        if (curItem && curItem.type === 'hymn' && curItem.hymnId === id) {
          currentServiceItemIndex = -1;
        }
      }
      service.items = service.items.filter(item => !(item.type === 'hymn' && item.hymnId === id));
      if (service.items.length < before) servicesModified++;
    });
    if (servicesModified > 0) {
      saveServices();
      renderServicesList();
      statusEl.textContent = window.HymnFlowI18n
        ? window.HymnFlowI18n.getTranslation('services.status.hymnDeleted', { count: servicesModified })
        : `Hymn deleted (${servicesModified} service(s) updated)`;
    }

    saveHymns();
    filtered = hymns;
    renderSourceFilters();
    renderList();
    updatePreview();
  }

  function loadServices() {
    const stored = localStorage.getItem(storageKeys.services);
    try {
      services = stored ? JSON.parse(stored) : [];
      let migrated = false;
      services = services.map(s => {
        if (!s.items && Array.isArray(s.hymns)) {
          migrated = true;
          return { ...s, items: s.hymns.map(hymnId => ({ type: 'hymn', hymnId })) };
        }
        if (!s.items) s.items = [];
        return s;
      });
      if (migrated) saveServices();
    } catch (err) {
      console.error('[Services Load Error] Corrupted data:', err);
      services = [];
    }
  }

  function saveServices() {
    try {
      localStorage.setItem(storageKeys.services, JSON.stringify(services));
    } catch (err) {
      console.error('[Services Save Error]', err);
      if (window.HymnFlowI18n) {
        statusEl.textContent = window.HymnFlowI18n.getTranslation('services.errors.saveFailed', { error: err.message });
      } else {
        statusEl.textContent = 'Error saving services: ' + err.message;
      }
    }
  }

  function renderServicesList() {
    const listEl = document.getElementById('servicesList');
    if (services.length === 0) {
      const msg = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('services.noServicesFound') : 'No services created';
      listEl.innerHTML = `<div class="service-item" style="justify-content: center; color: var(--text-muted);">${msg}</div>`;
      return;
    }
    listEl.innerHTML = services.map(service => {
      const isActive = currentService && currentService.id === service.id;
      const itemsHtml = isActive ? service.items.map((item, index) => {
        const label = itemDisplayLabel(item);
        const badge = itemTypeBadge(item.type);
        const isCurrentItem = index === currentServiceItemIndex;
        const isPast = currentServiceItemIndex >= 0 && index < currentServiceItemIndex;
        return `
          <div class="service-hymn-list-item${isCurrentItem ? ' active' : ''}${isPast ? ' past' : ''}" role="listitem" aria-current="${isCurrentItem ? 'true' : 'false'}" onclick="window.hymnflowSelectItemFromService(${index})">
            <span class="service-hymn-order">${isPast ? '✓' : (index + 1) + '.'}</span>
            <span class="service-item-badge badge-${escapeHtml(item.type)}">${escapeHtml(badge)}</span>
            <span class="service-hymn-title">${escapeHtml(label)}</span>
          </div>
        `;
      }).join('') : '';

      const safeServiceName = escapeHtml(service.name);
      const count = service.items.length;
      const countLabel = `${count} item${count !== 1 ? 's' : ''}`;
      return `
        <div class="service-item${isActive ? ' active' : ''}" role="listitem" data-service-id="${service.id}">
          <div class="service-item-info" onclick="window.hymnflowSelectService('${service.id}')">
            <div class="service-item-name">${safeServiceName}</div>
            <div class="service-item-count">${escapeHtml(countLabel)}</div>
          </div>
          <div class="service-item-actions">
            <button class="btn btn-secondary" onclick="event.stopPropagation(); window.hymnflowSelectService('${service.id}')">${window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('services.buttons.load') : 'Load'}</button>
            <button class="btn btn-secondary" onclick="event.stopPropagation(); window.hymnflowEditService('${service.id}')">${window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('services.buttons.edit') : 'Edit'}</button>
            <button class="btn btn-secondary" onclick="event.stopPropagation(); window.hymnflowDuplicateService('${service.id}')" title="Duplicate this service">Dup</button>
            <button class="btn btn-remove" onclick="event.stopPropagation(); window.hymnflowDeleteService('${service.id}')">${window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('services.buttons.delete') : 'Del'}</button>
          </div>
          ${isActive ? `<div class="service-hymns-list" role="list">${itemsHtml}</div>` : ''}
        </div>
      `;
    }).join('');
  }

  function openServiceEditor(serviceId = null) {
    const editor = document.getElementById('serviceEditor');
    const nameInput = document.getElementById('serviceName');

    if (serviceId) {
      const original = services.find(s => s.id === serviceId);
      if (!original) return;
      // Deep-copy so edits don't mutate the live service while it's running
      editingService = JSON.parse(JSON.stringify(original));
      nameInput.value = editingService.name;
    } else {
      editingService = { id: generateUniqueServiceId(), name: '', items: [] };
      nameInput.value = '';
    }

    document.getElementById('hymnPicker').hidden = true;
    document.getElementById('itemForm').hidden = true;
    document.getElementById('btnAddToService').setAttribute('aria-pressed', 'false');
    currentItemFormType = null;
    editingItemIndex = null;
    serviceEditorDirty = false;
    renderServiceItems();
    editor.style.display = 'block';
    setTimeout(() => editor.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 0);
  }

  function closeServiceEditor(force = false) {
    if (!force && serviceEditorDirty) {
      if (!confirm('Discard unsaved changes?')) return;
    }
    document.getElementById('serviceEditor').style.display = 'none';
    document.getElementById('hymnPicker').hidden = true;
    document.getElementById('itemForm').hidden = true;
    document.getElementById('btnAddToService').setAttribute('aria-pressed', 'false');
    editingService = null;
    serviceEditorDirty = false;
  }

  function renderServiceItems() {
    const container = document.getElementById('serviceHymns');
    if (!editingService || editingService.items.length === 0) {
      container.innerHTML = `<div style="padding: 12px; text-align: center; color: var(--text-muted); font-size: 12px;">No items added yet</div>`;
      return;
    }
    container.innerHTML = editingService.items.map((item, index) => {
      const label = itemDisplayLabel(item);
      const badge = itemTypeBadge(item.type);
      const notesHtml = item.notes
        ? `<div class="service-item-notes">${escapeHtml(item.notes)}</div>`
        : '';
      return `
        <div class="service-hymn-item" role="listitem" draggable="true" data-drag-index="${index}">
          <div class="service-hymn-item-info">
            <div class="service-hymn-number">#${index + 1}</div>
            <span class="service-item-badge badge-${escapeHtml(item.type)}">${escapeHtml(badge)}</span>
            <div class="service-hymn-title-wrap">
              <div class="service-hymn-title">${escapeHtml(label)}</div>
              ${notesHtml}
            </div>
          </div>
          <div class="service-hymn-controls">
            ${item.type !== 'hymn' ? `<button class="btn btn-secondary" onclick="window.hymnflowEditServiceItem(${index})" title="Edit">✎</button>` : ''}
            <button class="btn btn-secondary" onclick="window.hymnflowMoveServiceItem(${index}, -1)" ${index === 0 ? 'disabled' : ''} aria-label="Move up">↑</button>
            <button class="btn btn-secondary" onclick="window.hymnflowMoveServiceItem(${index}, 1)" ${index === editingService.items.length - 1 ? 'disabled' : ''} aria-label="Move down">↓</button>
            <button class="btn btn-remove" onclick="window.hymnflowRemoveServiceItem(${index})" aria-label="Remove">×</button>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderHymnPicker(query) {
    const list = document.getElementById('hymnPickerList');
    if (!list) return;
    const q = (query || '').toLowerCase().trim();
    const results = q
      ? hymns.filter(h =>
          (typeof h.title === 'string' ? h.title : String(h.title ?? '')).toLowerCase().includes(q) ||
          (h.author || '').toLowerCase().includes(q) ||
          String(h.metadata?.number || '').includes(q)
        )
      : hymns;
    if (results.length === 0) {
      list.innerHTML = `<div class="hymn-picker-empty">No hymns found</div>`;
      return;
    }
    list.innerHTML = results.slice(0, 40).map(h => {
      const num = h.metadata?.number ? `${h.metadata.number} · ` : '';
      const title = escapeHtml(typeof h.title === 'string' ? h.title : String(h.title ?? ''));
      return `<div class="hymn-picker-item" onclick="window.hymnflowPickHymn('${escapeHtml(h.id)}')">${escapeHtml(num)}${title}</div>`;
    }).join('');
  }

  function updateAnnounceHint(text) {
    const hint = document.getElementById('announceCharHint');
    if (!hint) return;
    if (!text) { hint.hidden = true; return; }
    const label = text.length > 35 ? text.substring(0, 35) + '…' : text;
    hint.textContent = `List label: "${label}"`;
    hint.hidden = false;
  }

  function showItemForm(type, existingIndex = null) {
    currentItemFormType = type;
    editingItemIndex = existingIndex;
    const existing = existingIndex !== null ? editingService.items[existingIndex] : null;
    const titleEl = document.getElementById('itemFormTitle');
    const refRow = document.getElementById('itemFormRefRow');
    const refInput = document.getElementById('itemFormRef');
    const textRow = document.getElementById('itemFormTextRow');
    const textArea = document.getElementById('itemFormText');
    const addBtn = document.getElementById('btnItemFormAdd');
    refInput.value = existing ? (existing.label || '') : '';
    textArea.value = existing ? (existing.text || '') : '';
    const notesInput = document.getElementById('itemFormNotes');
    if (notesInput) notesInput.value = existing ? (existing.notes || '') : '';
    const t = (key, fb) => window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation(key) : fb;
    if (type === 'scripture') {
      titleEl.textContent = existing ? t('services.itemForm.titles.editScripture', 'Edit Scripture') : t('services.itemForm.titles.addScripture', 'Add Scripture');
      refRow.hidden = false;
      refInput.placeholder = t('services.itemForm.placeholders.scriptureRef', 'Reference (e.g., Ps 23, John 3:16)');
      textRow.hidden = true;
      addBtn.textContent = existing ? t('services.itemForm.buttons.save', 'Save') : t('services.itemForm.buttons.addScripture', 'Add Scripture');
      setTimeout(() => refInput.focus(), 0);
    } else if (type === 'announce') {
      titleEl.textContent = existing ? t('services.itemForm.titles.editAnnounce', 'Edit Announcement') : t('services.itemForm.titles.addAnnounce', 'Add Announcement');
      refRow.hidden = true;
      textRow.hidden = false;
      textArea.placeholder = t('services.itemForm.placeholders.announceText', 'Announcement text (e.g., Join us for fellowship after service)');
      addBtn.textContent = existing ? t('services.itemForm.buttons.save', 'Save') : t('services.itemForm.buttons.addAnnounce', 'Add Announcement');
      updateAnnounceHint(textArea.value);
      setTimeout(() => textArea.focus(), 0);
    } else if (type === 'divider') {
      titleEl.textContent = existing ? t('services.itemForm.titles.editDivider', 'Edit Divider') : t('services.itemForm.titles.addDivider', 'Add Divider');
      refRow.hidden = false;
      refInput.placeholder = t('services.itemForm.placeholders.dividerLabel', 'Section label (e.g., Offering, Sermon, Prayer)');
      textRow.hidden = true;
      addBtn.textContent = existing ? t('services.itemForm.buttons.save', 'Save') : t('services.itemForm.buttons.addDivider', 'Add Divider');
      setTimeout(() => refInput.focus(), 0);
    }
    document.getElementById('hymnPicker').hidden = true;
    document.getElementById('itemForm').hidden = false;
  }

  function saveService() {
    const nameInput = document.getElementById('serviceName');
    const name = nameInput.value.trim();

    if (!name) {
      const msg = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('services.alerts.nameRequired') : 'Service name is required';
      alert(msg);
      return;
    }

    if (editingService.items.length === 0) {
      alert(window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('services.alerts.itemRequired') : 'Add at least one item to the service');
      return;
    }

    editingService.name = name;

    const { valid, errors } = window.HymnValidator.validateService(editingService, hymns);
    if (!valid) {
      const msg = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('services.alerts.validationFailed', { errors: errors.join('\n') }) : 'Service validation failed:\n' + errors.join('\n');
      alert(msg);
      return;
    }

    const existingIndex = services.findIndex(s => s.id === editingService.id);
    if (existingIndex >= 0) {
      // If this is the currently running service, update the live reference and
      // try to keep the active item index pointing at the same item after any reorder.
      if (currentService && currentService.id === editingService.id) {
        const prevItem = currentService.items[currentServiceItemIndex];
        currentService = editingService;
        if (prevItem) {
          const newIdx = editingService.items.findIndex(item => {
            if (item.type !== prevItem.type) return false;
            if (item.type === 'hymn') return item.hymnId === prevItem.hymnId;
            return item.label === prevItem.label && item.text === prevItem.text;
          });
          currentServiceItemIndex = newIdx >= 0 ? newIdx : -1;
        } else {
          currentServiceItemIndex = -1;
        }
      }
      services[existingIndex] = editingService;
    } else {
      services.push(editingService);
    }

    saveServices();
    renderServicesList();
    updateServiceBanner();
    closeServiceEditor(true);
    statusEl.textContent = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('services.status.saved') : 'Service saved';
  }

  function updateServiceBanner() {
    const banner     = document.getElementById('serviceBanner');
    const bannerName = document.getElementById('serviceBannerName');
    const bannerPos  = document.getElementById('serviceBannerPos');
    const bannerNext = document.getElementById('serviceBannerNext');
    const btnPrevHymn = document.getElementById('btnPrevHymn');
    const btnNextHymn = document.getElementById('btnNextHymn');

    if (!currentService || currentService.items.length === 0) {
      if (banner) banner.style.display = 'none';
      return;
    }

    const total = currentService.items.length;
    const idx   = currentServiceItemIndex;

    if (banner) banner.style.display = 'flex';
    if (bannerName) bannerName.textContent = currentService.name;
    if (bannerPos) {
      bannerPos.textContent = idx >= 0 ? `${idx + 1}/${total}` : `–/${total}`;
    }
    if (btnPrevHymn) btnPrevHymn.disabled = idx <= 0;
    if (btnNextHymn) btnNextHymn.disabled = total === 0 || idx >= total - 1;

    // "Coming next" hint
    if (bannerNext) {
      const nextItem = (idx + 1 < total) ? currentService.items[idx + 1] : null;
      if (nextItem) {
        bannerNext.textContent = `Next: ${itemTypeBadge(nextItem.type)} ${itemDisplayLabel(nextItem)}`;
        bannerNext.hidden = false;
      } else {
        bannerNext.hidden = true;
      }
    }
  }

  function activateServiceItem(index) {
    if (!currentService || index < 0 || index >= currentService.items.length) return;
    const item = currentService.items[index];

    if (item.type === 'hymn') {
      const hymn = hymns.find(h => h.id === item.hymnId);
      if (hymn) {
        _clearTextSlideOnly();
        selectHymn(hymn.id);
        currentServiceItemIndex = index; // pin to this slot in case hymn appears twice
        updateServiceBanner();
        renderServicesList();
        return;
      }
      statusEl.textContent = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('services.status.hymnNotFound') : 'Hymn not found in library';
    } else if (item.type === 'scripture') {
      switchTab('live');
      const qsRefEl = document.getElementById('qsRef');
      if (qsRefEl) qsRefEl.value = item.label || '';
      qsLookup();
    } else if (item.type === 'announce') {
      sendScriptureToOverlay('', item.text || item.label || '');
      statusEl.textContent = item.label || 'Announcement displayed';
    } else if (item.type === 'divider') {
      _clearTextSlideOnly();
      statusEl.textContent = window.HymnFlowI18n
        ? window.HymnFlowI18n.getTranslation('services.status.divider', { label: item.label || 'Section' })
        : `▸ ${item.label || 'Section'}`;
    }

    currentServiceItemIndex = index;
    updateServiceBanner();
    renderServicesList();
  }

  function prevServiceItem() {
    if (!currentService || currentServiceItemIndex <= 0) return;
    activateServiceItem(currentServiceItemIndex - 1);
  }

  function nextServiceItem() {
    if (!currentService) return;
    const total = currentService.items.length;
    if (currentServiceItemIndex === -1 && total > 0) activateServiceItem(0);
    else if (currentServiceItemIndex < total - 1) activateServiceItem(currentServiceItemIndex + 1);
  }

  function selectService(serviceId) {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      const { valid, errors } = window.HymnValidator.validateService(service, hymns);
      if (!valid) {
        console.warn('[Service Validation] Issues loading service:', errors);
        statusEl.textContent = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('services.status.validationIssues') : 'Warning: Service has validation issues';
      }
      currentService = service;
      currentServiceItemIndex = -1;
      const count = service.items.length;
      statusEl.textContent = window.HymnFlowI18n
        ? window.HymnFlowI18n.getTranslation('services.status.loaded', { name: currentService.name, count })
        : `Loaded: ${currentService.name} (${count} item(s))`;
    }
    updateServiceBanner();
    renderServicesList();
  }

  function selectItemFromService(index) {
    activateServiceItem(index);
  }

  function deleteService(serviceId) {
    const confirmMsg = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('services.confirmations.delete') : 'Delete this service?';
    if (confirm(confirmMsg)) {
      const serviceToDelete = services.find(s => s.id === serviceId);
      if (serviceToDelete) {
        services = services.filter(s => s.id !== serviceId);
        if (currentService && currentService.id === serviceId) {
          currentService = null;
          updateServiceBanner();
        }
        saveServices();
        renderServicesList();
        if (window.HymnFlowI18n) {
          statusEl.textContent = window.HymnFlowI18n.getTranslation('services.status.deleted');
        } else {
          statusEl.textContent = 'Service deleted';
        }
      }
    }
  }

  function duplicateService(serviceId) {
    const original = services.find(s => s.id === serviceId);
    if (!original) return;
    const copy = JSON.parse(JSON.stringify(original));
    copy.id = generateUniqueServiceId();
    copy.name = original.name + ' (Copy)';
    services.push(copy);
    saveServices();
    renderServicesList();
    statusEl.textContent = `Duplicated: "${copy.name}"`;
  }

  // Global functions for onclick handlers
  window.hymnflowSelectService = selectService;
  window.hymnflowSelectItemFromService = selectItemFromService;
  window.hymnflowEditService = openServiceEditor;
  window.hymnflowDeleteService = deleteService;
  window.hymnflowDuplicateService = duplicateService;
  window.hymnflowPickHymn = (hymnId) => {
    if (!editingService) return;
    editingService.items.push({ type: 'hymn', hymnId });
    serviceEditorDirty = true;
    renderServiceItems();
    document.getElementById('hymnPicker').hidden = true;
    document.getElementById('hymnPickerSearch').value = '';
    document.getElementById('btnAddToService').setAttribute('aria-pressed', 'false');
  };
  window.hymnflowMoveServiceItem = (index, direction) => {
    if (!editingService) return;
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < editingService.items.length) {
      [editingService.items[index], editingService.items[newIndex]] = [editingService.items[newIndex], editingService.items[index]];
      serviceEditorDirty = true;
      renderServiceItems();
    }
  };
  window.hymnflowRemoveServiceItem = (index) => {
    if (!editingService) return;
    editingService.items.splice(index, 1);
    serviceEditorDirty = true;
    renderServiceItems();
  };
  window.hymnflowEditServiceItem = (index) => {
    if (!editingService) return;
    const item = editingService.items[index];
    if (!item || item.type === 'hymn') return;
    showItemForm(item.type, index);
  };


  function attachEvents() {
    // Populate cached nav button refs once
    navBtns.prevVerse  = document.getElementById('btnPrevVerse');
    navBtns.nextVerse  = document.getElementById('btnNextVerse');
    navBtns.prevLine   = document.getElementById('btnPrevLine');
    navBtns.nextLine   = document.getElementById('btnNextLine');
    navBtns.jumpChorus = document.getElementById('btnJumpChorus');

    searchEl.addEventListener('input', async (e) => {
      currentSearchQuery = e.target.value;
      const results = await performSearch(e.target.value);
      filtered = results;
      renderList();
    });

    document.getElementById('sourceFilters').addEventListener('click', (e) => {
      const chip = e.target.closest('.source-chip');
      if (!chip) return;
      activeSourceFilter = chip.dataset.source;
      renderSourceFilters();
      renderList();
    });

    listEl.addEventListener('click', (e) => {
      const item = e.target.closest('.list-item');
      if (!item) return;
      selectHymn(item.dataset.id);
    });

    document.getElementById('btnAdd').onclick = () => openEditModal();
    document.getElementById('btnEdit').onclick = () => {
      if (!currentHymn) {
        const msg = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('hymns.alerts.noHymnToEdit') : 'No hymn selected to edit';
        alert(msg);
        return;
      }
      openEditModal(currentHymn);
    };
    document.getElementById('btnRemove').onclick = removeSelectedHymn;
    document.getElementById('btnPrevVerse').onclick = prevVerse;
    document.getElementById('btnNextVerse').onclick = nextVerse;
    document.getElementById('btnPrevLine').onclick = prevLineWindow;
    document.getElementById('btnNextLine').onclick = nextLineWindow;
    document.getElementById('btnJumpChorus').onclick = jumpToChorus;
    document.getElementById('btnClear').onclick = emergencyClear;
    document.getElementById('btnReset').onclick = resetPosition;
    document.getElementById('displayToggle').onchange = toggleDisplay;

    document.getElementById('linesPerPage').oninput = (e) => {
      settings.linesPerPage = parseInt(e.target.value, 10);
      const sliderValue = e.target.parentElement.querySelector('.slider-value');
      if (sliderValue) sliderValue.textContent = settings.linesPerPage;
      saveSettings();
      updatePreview();
      // Auto-update overlay if displaying
      if (isDisplaying && currentHymn) sendCommand('show');
    };

    document.getElementById('fontFamily').onchange = (e) => {
      settings.fontFamily = e.target.value;
      saveSettings();
      if (isDisplaying && currentHymn) sendCommand('show');
    };
    document.getElementById('fontSize').oninput = (e) => {
      settings.fontSize = parseInt(e.target.value, 10);
      fontSizeValueEl.textContent = settings.fontSize + 'px';
      saveSettings();
      if (isDisplaying && currentHymn) sendCommand('show');
    };
    document.getElementById('bold').onchange = (e) => {
      settings.bold = e.target.checked;
      saveSettings();
      if (isDisplaying && currentHymn) sendCommand('show');
    };
    document.getElementById('italic').onchange = (e) => {
      settings.italic = e.target.checked;
      saveSettings();
      if (isDisplaying && currentHymn) sendCommand('show');
    };
    document.getElementById('shadow').onchange = (e) => {
      settings.shadow = e.target.checked;
      saveSettings();
      if (isDisplaying && currentHymn) sendCommand('show');
    };
    document.getElementById('glow').onchange = (e) => {
      settings.glow = e.target.checked;
      saveSettings();
      if (isDisplaying && currentHymn) sendCommand('show');
    };
    document.getElementById('outline').onchange = (e) => {
      settings.outline = e.target.checked;
      document.getElementById('outlineControls').style.display = e.target.checked ? 'block' : 'none';
      // Validate outline width is in valid range
      if (settings.outlineWidth < 1) settings.outlineWidth = 1;
      if (settings.outlineWidth > 15) settings.outlineWidth = 15;
      saveSettings();
      if (isDisplaying && currentHymn) sendCommand('show');
    };
    document.getElementById('outlineColor').oninput = (e) => {
      settings.outlineColor = e.target.value;
      saveSettings();
      if (isDisplaying && currentHymn) sendCommand('show');
    };
    document.getElementById('outlineWidth').oninput = (e) => {
      const width = parseInt(e.target.value, 10);
      settings.outlineWidth = Math.max(1, Math.min(width, 15)); // Clamp to 1-15
      document.getElementById('outlineWidthValue').textContent = settings.outlineWidth + 'px';
      saveSettings();
      if (isDisplaying && currentHymn) sendCommand('show');
    };
    document.getElementById('textColor').oninput = (e) => {
      settings.textColor = e.target.value;
      saveSettings();
      if (isDisplaying && currentHymn) sendCommand('show');
    };
    document.getElementById('bgType').onchange = (e) => {
      settings.bgType = e.target.value;
      const opacityRow = document.getElementById('bgOpacityRow');
      if (opacityRow) opacityRow.style.display = settings.bgType === 'transparent' ? 'none' : '';
      saveSettings();
      if (isDisplaying && currentHymn) sendCommand('show');
    };
    document.getElementById('bgColorA').oninput = (e) => {
      settings.bgColorA = e.target.value;
      saveSettings();
      if (isDisplaying && currentHymn) sendCommand('show');
    };
    document.getElementById('bgColorB').oninput = (e) => {
      settings.bgColorB = e.target.value;
      saveSettings();
      if (isDisplaying && currentHymn) sendCommand('show');
    };
    document.getElementById('bgOpacity').oninput = (e) => {
      settings.bgOpacity = parseInt(e.target.value, 10);
      document.getElementById('bgOpacityValue').textContent = settings.bgOpacity + '%';
      const row = document.getElementById('bgOpacityRow');
      if (row) row.style.display = settings.bgType === 'transparent' ? 'none' : '';
      saveSettings();
      if (isDisplaying && currentHymn) sendCommand('show');
    };
    document.getElementById('animation').onchange = (e) => {
      settings.animation = e.target.value;
      saveSettings();
      if (isDisplaying && currentHymn) sendCommand('show');
    };
    document.getElementById('position').onchange = (e) => {
      settings.position = e.target.value;
      saveSettings();
      if (isDisplaying && currentHymn) sendCommand('show');
    };

    document.getElementById('previewToggle').onclick = () => {
      const toggle = document.getElementById('previewToggle');
      const body = document.getElementById('previewBody');
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      body.hidden = expanded;
    };

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.onclick = () => switchTab(btn.dataset.tab);
    });

    document.getElementById('btnImport').onclick = () => document.getElementById('fileInput').click();
    document.getElementById('fileInput').onchange = handleImport;
    document.getElementById('btnExport').onclick = handleExport;
    document.getElementById('btnImportBible').onclick = () => document.getElementById('bibleFileInput').click();
    document.getElementById('bibleFileInput').onchange = handleBibleImport;

    // Modal controls
    document.getElementById('btnCloseModal').onclick = closeEditModal;
    document.getElementById('btnCancelEdit').onclick = closeEditModal;
    document.getElementById('btnSaveEdit').onclick = saveHymnEdit;

    // Close modal on outside click
    document.getElementById('editModal').onclick = (e) => {
      if (e.target.id === 'editModal') closeEditModal();
    };

    // Text slide controls
    document.getElementById('btnSendTextSlide').onclick = sendTextSlide;
    document.getElementById('btnClearTextSlide').onclick = clearTextSlide;
    document.getElementById('textSlideInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        sendTextSlide();
      }
    });

    // Quick Scripture controls (Live tab)
    document.getElementById('btnQsLookup').onclick = qsLookup;
    document.getElementById('btnQsDisplay').onclick = displayQuickScripture;
    document.getElementById('btnQsNext').onclick = qsNext;
    document.getElementById('btnQsPrev').onclick = qsPrev;
    document.getElementById('btnQsClear').onclick = clearTextSlide;
    document.getElementById('qsTranslation').onchange = (e) => {
      window.HymnFlowBibleLookup?.setActiveTranslation(e.target.value);
      renderBibleList();
      updateBibleStatusBadge();
    };
    document.getElementById('qsRef').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); qsLookup(); }
    });
    document.getElementById('qsText').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        displayQuickScripture();
      }
    });

    // Service banner Prev/Next Item
    document.getElementById('btnPrevHymn').onclick = prevServiceItem;
    document.getElementById('btnNextHymn').onclick = nextServiceItem;

    // Service controls
    document.getElementById('btnNewService').onclick = () => openServiceEditor();
    document.getElementById('btnAddToService').onclick = () => {
      if (!editingService) return;
      const btn = document.getElementById('btnAddToService');
      const picker = document.getElementById('hymnPicker');
      const isOpen = !picker.hidden;
      document.getElementById('itemForm').hidden = true;
      currentItemFormType = null;
      editingItemIndex = null;
      if (isOpen) {
        picker.hidden = true;
        btn.setAttribute('aria-pressed', 'false');
      } else {
        document.getElementById('hymnPickerSearch').value = '';
        renderHymnPicker('');
        picker.hidden = false;
        btn.setAttribute('aria-pressed', 'true');
        setTimeout(() => document.getElementById('hymnPickerSearch').focus(), 0);
      }
    };
    document.getElementById('hymnPickerSearch').oninput = (e) => renderHymnPicker(e.target.value);
    document.getElementById('serviceName').oninput = () => { if (editingService) serviceEditorDirty = true; };
    document.getElementById('btnHymnPickerCancel').onclick = () => {
      document.getElementById('hymnPicker').hidden = true;
      document.getElementById('btnAddToService').setAttribute('aria-pressed', 'false');
    };
    document.getElementById('btnAddScripture').onclick = () => {
      if (!editingService) return;
      showItemForm('scripture');
    };
    document.getElementById('btnAddAnnounce').onclick = () => {
      if (!editingService) return;
      showItemForm('announce');
    };
    document.getElementById('btnAddDivider').onclick = () => {
      if (!editingService) return;
      showItemForm('divider');
    };
    document.getElementById('btnItemFormAdd').onclick = () => {
      if (!editingService) return;
      const ref = document.getElementById('itemFormRef').value.trim();
      const text = document.getElementById('itemFormText').value.trim();
      let newItem = null;
      if (currentItemFormType === 'scripture') {
        if (!ref) { document.getElementById('itemFormRef').focus(); return; }
        // Validate against loaded Bible — warn but allow saving if unrecognised
        if (window.HymnFlowBibleLookup?.isLoaded() && !window.HymnFlowBibleLookup.canParse(ref)) {
          const warn = `"${ref}" doesn't look like a valid Bible reference.\nAdd it anyway?`;
          if (!confirm(warn)) { document.getElementById('itemFormRef').focus(); return; }
        }
        newItem = { type: 'scripture', label: ref };
      } else if (currentItemFormType === 'announce') {
        if (!text) { document.getElementById('itemFormText').focus(); return; }
        const label = text.length > 35 ? text.substring(0, 35) + '…' : text;
        newItem = { type: 'announce', label, text };
      } else if (currentItemFormType === 'divider') {
        if (!ref) { document.getElementById('itemFormRef').focus(); return; }
        newItem = { type: 'divider', label: ref };
      }
      if (!newItem) return;
      const notes = (document.getElementById('itemFormNotes')?.value || '').trim();
      if (notes) newItem.notes = notes;
      if (editingItemIndex !== null) {
        editingService.items[editingItemIndex] = newItem;
        editingItemIndex = null;
      } else {
        editingService.items.push(newItem);
      }
      serviceEditorDirty = true;
      renderServiceItems();
      document.getElementById('itemForm').hidden = true;
      currentItemFormType = null;
    };
    document.getElementById('btnItemFormCancel').onclick = () => {
      document.getElementById('itemForm').hidden = true;
      currentItemFormType = null;
      editingItemIndex = null;
    };
    document.getElementById('itemFormRef').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('btnItemFormAdd').click();
      }
    });
    document.getElementById('itemFormText').addEventListener('input', (e) => {
      if (currentItemFormType === 'announce') updateAnnounceHint(e.target.value);
    });
    document.getElementById('btnSaveService').onclick = saveService;
    document.getElementById('btnCancelService').onclick = closeServiceEditor;

    // OBS Connection panel
    document.getElementById('btnObsWsConnect')?.addEventListener('click', () => {
      const h = document.getElementById('obsWsHost');
      const p = document.getElementById('obsWsPort');
      const pw = document.getElementById('obsWsPassword');
      if (h)  settings.obsWsHost     = h.value.trim()    || '127.0.0.1';
      if (p)  settings.obsWsPort     = parseInt(p.value, 10) || 4455;
      if (pw) settings.obsWsPassword = pw.value;
      settings.obsWsEnabled = true;
      saveSettings();
      obsWsConnect();
    });
    document.getElementById('btnObsWsDisconnect')?.addEventListener('click', obsWsDisconnect);

    // Drag-and-drop reorder for service editor items
    const serviceHymns = document.getElementById('serviceHymns');
    let dragSrcIndex = null;
    serviceHymns.addEventListener('dragstart', e => {
      const el = e.target.closest('[data-drag-index]');
      if (!el) return;
      dragSrcIndex = parseInt(el.dataset.dragIndex, 10);
      e.dataTransfer.effectAllowed = 'move';
      el.classList.add('dragging');
    });
    serviceHymns.addEventListener('dragend', () => {
      serviceHymns.querySelectorAll('[data-drag-index]').forEach(el => {
        el.classList.remove('dragging', 'drag-over');
      });
      dragSrcIndex = null;
    });
    serviceHymns.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const el = e.target.closest('[data-drag-index]');
      serviceHymns.querySelectorAll('[data-drag-index]').forEach(n => n.classList.remove('drag-over'));
      if (el) el.classList.add('drag-over');
    });
    serviceHymns.addEventListener('drop', e => {
      e.preventDefault();
      const toEl = e.target.closest('[data-drag-index]');
      if (!toEl || !editingService || dragSrcIndex === null) return;
      const toIndex = parseInt(toEl.dataset.dragIndex, 10);
      if (dragSrcIndex === toIndex) return;
      const [moved] = editingService.items.splice(dragSrcIndex, 1);
      editingService.items.splice(toIndex, 0, moved);
      serviceEditorDirty = true;
      renderServiceItems();
    });

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      // Escape closes service editor (even from inside inputs)
      if (e.key === 'Escape') {
        const editor = document.getElementById('serviceEditor');
        if (editor && editor.style.display !== 'none') {
          e.preventDefault();
          closeServiceEditor();
          return;
        }
      }
      // Don't intercept navigation keys when typing in input/textarea
      const target = e.target;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      // Verse navigation
      if (e.key === 'ArrowRight') { e.preventDefault(); nextVerse(); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prevVerse(); }
      // Line-window scroll (multi-line / long verses)
      if (e.key === 'ArrowDown')  { e.preventDefault(); nextLineWindow(); }
      if (e.key === 'ArrowUp')    { e.preventDefault(); prevLineWindow(); }
      // Service item navigation
      if (e.key === ']' || e.key === 'PageDown') { e.preventDefault(); nextServiceItem(); }
      if (e.key === '[' || e.key === 'PageUp')   { e.preventDefault(); prevServiceItem(); }
      // Toggle display
      if (e.key === ' ') { e.preventDefault(); toggleDisplay(); }
    });
  }

  let importInProgress = false;

  async function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (importInProgress) return;
    importInProgress = true;
    const btnImport = document.getElementById('btnImport');
    if (btnImport) btnImport.disabled = true;
    try {
      const ext = file.name.split('.').pop().toLowerCase();
      let parsed = [];
      if (ext === 'txt') parsed = await parseTxt(file);
      else if (ext === 'csv') parsed = await parseCsv(file);
      else if (ext === 'json') parsed = await parseJson(file);
      else throw new Error('Use .txt, .csv, or .json');

      const SAFE_ID = /^hymn_[\w-]{1,80}$/;
      parsed.forEach((h) => {
        const hasValidId = typeof h.id === 'string' && SAFE_ID.test(h.id);
        if (!hasValidId) h.id = generateUniqueHymnId();
        if (!h.createdAt) h.createdAt = new Date().toISOString();
      });

      // Validate all imported hymns
      const { valid, invalid } = window.HymnValidator.batchValidate(parsed);

      if (invalid.length > 0) {
        const errorSummary = invalid.map(i => `Row ${i.index + 1}: ${i.errors[0]}`).join('; ');
        console.warn('[Import Warnings]', invalid.length, 'row(s) skipped:', errorSummary);
      }

      if (valid.length === 0) {
        throw new Error(`No valid hymns found. ${invalid.length} entries had errors: ${invalid[0]?.errors[0] || 'Unknown error'}`);
      }

      // Chunked merge — keeps UI responsive on large imports (1000+ hymns)
      await new Promise(resolve => {
        const CHUNK = 100;
        let offset = 0;
        function processChunk() {
          const slice = valid.slice(offset, offset + CHUNK);
          hymns = [...hymns, ...slice];
          offset += CHUNK;
          if (statusEl) {
            statusEl.textContent = `Importing… (${Math.min(offset, valid.length)}/${valid.length})`;
          }
          if (offset < valid.length) {
            setTimeout(processChunk, 0);
          } else {
            resolve();
          }
        }
        processChunk();
      });

      saveHymns();
      filtered = hymns;
      renderSourceFilters();
      renderList();

      if (window.HymnFlowI18n) {
        const skipped = invalid.length > 0 ? ` (${invalid.length} skipped)` : '';
        statusEl.textContent = window.HymnFlowI18n.getTranslation('hymns.status.imported', { count: valid.length, skipped: skipped });
      } else {
        const message = `Imported ${valid.length} hymn${valid.length !== 1 ? 's' : ''}${invalid.length > 0 ? ` (${invalid.length} skipped due to errors)` : ''}`;
        statusEl.textContent = message;
      }
    } catch (err) {
      if (window.HymnFlowI18n) {
        statusEl.textContent = window.HymnFlowI18n.getTranslation('hymns.alerts.importFailed', { error: err.message });
      } else {
        statusEl.textContent = 'Import failed: ' + err.message;
      }
      console.error('[Import Error]', err);
    } finally {
      e.target.value = '';
      importInProgress = false;
      const btnImportEl = document.getElementById('btnImport');
      if (btnImportEl) btnImportEl.disabled = false;
    }
  }

  function updateQsTranslationSelect() {
    const sel = document.getElementById('qsTranslation');
    if (!sel || !window.HymnFlowBibleLookup) return;
    const names = window.HymnFlowBibleLookup.listTranslations();
    const active = window.HymnFlowBibleLookup.getActiveTranslation();
    sel.innerHTML = '';
    if (!names.length) {
      sel.hidden = true;
      return;
    }
    sel.hidden = false;
    names.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      if (name === active) opt.selected = true;
      sel.appendChild(opt);
    });
  }

  function renderBibleList() {
    const list = document.getElementById('bibleTranslationList');
    if (!list || !window.HymnFlowBibleLookup) return;
    const names = window.HymnFlowBibleLookup.listTranslations();
    const active = window.HymnFlowBibleLookup.getActiveTranslation();
    if (!names.length) {
      list.innerHTML = '<p class="bible-empty-state">No translations loaded</p>';
      return;
    }
    list.innerHTML = names.map(name => {
      const n = escapeHtml(name);
      return `
      <div class="bible-translation-item${name === active ? ' active' : ''}" data-name="${n}">
        <span class="bible-translation-name">${n}${name === active ? ' ✓' : ''}</span>
        <div class="bible-translation-actions">
          ${name !== active ? `<button class="btn btn-secondary bible-set-active-btn" data-name="${n}">Set active</button>` : ''}
          <button class="btn bible-remove-btn" data-name="${n}" title="Remove ${n}">✕</button>
        </div>
      </div>`;
    }).join('');

    list.querySelectorAll('.bible-set-active-btn').forEach(btn => {
      btn.onclick = () => {
        window.HymnFlowBibleLookup.setActiveTranslation(btn.dataset.name);
        renderBibleList();
        updateQsTranslationSelect();
        updateBibleStatusBadge();
      };
    });
    list.querySelectorAll('.bible-remove-btn').forEach(btn => {
      btn.onclick = () => {
        window.HymnFlowBibleLookup.removeBible(btn.dataset.name);
        renderBibleList();
        updateQsTranslationSelect();
        updateBibleStatusBadge();
      };
    });
  }

  function updateBibleStatusBadge() {
    const badge = document.getElementById('bibleStatusBadge');
    if (!badge) return;
    const loaded = window.HymnFlowBibleLookup?.isLoaded();
    if (loaded) {
      const active = window.HymnFlowBibleLookup.getActiveTranslation();
      const count = window.HymnFlowBibleLookup.listTranslations().length;
      badge.textContent = count > 1 ? `${active} ✓ (+${count - 1})` : `${active} ✓`;
      badge.className = 'bible-status-badge loaded';
    } else {
      badge.textContent = window.HymnFlowI18n
        ? window.HymnFlowI18n.getTranslation('bible.notLoaded')
        : 'Not loaded';
      badge.className = 'bible-status-badge not-loaded';
    }
  }

  async function handleBibleImport(e) {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file || !window.HymnFlowBibleLookup) return;
    const nameInput = document.getElementById('bibleTranslationName');
    const rawName = (nameInput?.value || '').trim();
    // Derive name from filename if input is blank: "en_kjv.json" → "KJV"
    const derived = file.name.replace(/\.(json|js)$/i, '').split(/[\W_]+/).pop().toUpperCase() || 'BIBLE';
    const name = rawName || derived;
    if (nameInput) nameInput.value = '';
    if (statusEl) statusEl.textContent = window.HymnFlowI18n?.getTranslation('bible.loading') || 'Loading Bible…';
    const result = await window.HymnFlowBibleLookup.importFile(file, name);
    if (statusEl) statusEl.textContent = result.message;
    updateBibleStatusBadge();
    renderBibleList();
    updateQsTranslationSelect();
    updateQsControls();
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(hymns, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hymnflow-export.json';
    a.click();
    URL.revokeObjectURL(url);
    if (window.HymnFlowI18n) {
      statusEl.textContent = window.HymnFlowI18n.getTranslation('hymns.status.exported', { filename: 'hymnflow-export.json' });
    } else {
      statusEl.textContent = 'Exported hymnflow-export.json';
    }
  }

  function applySettingsUI() {
    const linesPerPageSlider = document.getElementById('linesPerPage');
    linesPerPageSlider.value = settings.linesPerPage;
    const sliderValue = linesPerPageSlider.parentElement.querySelector('.slider-value');
    if (sliderValue) sliderValue.textContent = settings.linesPerPage;
    document.getElementById('fontFamily').value = settings.fontFamily;
    document.getElementById('fontSize').value = settings.fontSize;
    fontSizeValueEl.textContent = settings.fontSize + 'px';
    document.getElementById('bold').checked = settings.bold;
    document.getElementById('italic').checked = settings.italic;
    document.getElementById('shadow').checked = settings.shadow;
    document.getElementById('glow').checked = settings.glow;
    document.getElementById('outline').checked = settings.outline;

    // Validate and clamp outline properties
    if (typeof settings.outlineWidth !== 'number' || settings.outlineWidth < 1) {
      settings.outlineWidth = 2;
    }
    if (settings.outlineWidth > 15) {
      settings.outlineWidth = 15;
    }

    document.getElementById('outlineColor').value = settings.outlineColor || '#000000';
    document.getElementById('outlineWidth').value = settings.outlineWidth;
    document.getElementById('outlineWidthValue').textContent = settings.outlineWidth + 'px';
    document.getElementById('outlineControls').style.display = settings.outline ? 'block' : 'none';
    document.getElementById('textColor').value = settings.textColor;
    document.getElementById('bgType').value = settings.bgType;
    document.getElementById('bgColorA').value = settings.bgColorA;
    document.getElementById('bgColorB').value = settings.bgColorB;
    const opacityVal = typeof settings.bgOpacity === 'number' ? settings.bgOpacity : 80;
    settings.bgOpacity = opacityVal;
    document.getElementById('bgOpacity').value = opacityVal;
    document.getElementById('bgOpacityValue').textContent = opacityVal + '%';
    const opacityRow = document.getElementById('bgOpacityRow');
    if (opacityRow) opacityRow.style.display = settings.bgType === 'transparent' ? 'none' : '';
    document.getElementById('animation').value = settings.animation;
    document.getElementById('position').value = settings.position;

    const obsHostEl = document.getElementById('obsWsHost');
    const obsPortEl = document.getElementById('obsWsPort');
    const obsPwdEl  = document.getElementById('obsWsPassword');
    if (obsHostEl) obsHostEl.value = settings.obsWsHost || '127.0.0.1';
    if (obsPortEl) obsPortEl.value = settings.obsWsPort || 4455;
    if (obsPwdEl)  obsPwdEl.value  = settings.obsWsPassword || '';
  }

  // ========================================
  // Language Selector Handler
  // ========================================
  function setupLanguageSelector() {
    const languageSelect = document.getElementById('languageSelect');
    if (!languageSelect || !window.HymnFlowI18n) return;

    // Set current language in selector
    languageSelect.value = window.HymnFlowI18n.getCurrentLanguage();

    // Handle language change
    languageSelect.addEventListener('change', async (e) => {
      const newLang = e.target.value;
      const success = await window.HymnFlowI18n.changeLanguage(newLang);
      if (success) {
        // Re-render lists to update any dynamic content
        renderList();
        renderServicesList();
        if (currentHymn) {
          updatePreview();
        }
      }
    });

    // Listen for language changes from other sources
    window.addEventListener('languageChanged', () => {
      languageSelect.value = window.HymnFlowI18n.getCurrentLanguage();
      // Re-render lists to update dynamic content
      renderList();
      renderServicesList();
      if (currentHymn) {
        updatePreview();
      }
      // Update status bar
      if (statusEl) {
        statusEl.textContent = window.HymnFlowI18n.getTranslation('app.status.ready', { storage: 'localStorage' });
      }
    });
  }

  // Initialize
  loadHymns();
  loadSettings();
  if (settings.obsWsEnabled) obsWsConnect();
  loadServices();
  if (window.HymnFlowBibleLookup) {
    window.HymnFlowBibleLookup.restoreFromStorage().then(() => {
      updateBibleStatusBadge();
      renderBibleList();
      updateQsTranslationSelect();
    });
  }
  buildSearchIndex();
  renderSourceFilters();
  renderList();
  renderServicesList();
  updateServiceBanner();
  attachEvents();
  switchTab(settings.activeTab || 'library');
  setupLanguageSelector();
  if (window.HymnFlowI18n) {
    statusEl.textContent = window.HymnFlowI18n.getTranslation('app.status.ready', { storage: 'localStorage' });
  } else {
    statusEl.textContent = 'Ready (localStorage)';
  }
})();
