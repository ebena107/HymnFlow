// HymnFlow OBS Dock Controller
(() => {
  const listEl = document.getElementById('hymnList');
  const searchEl = document.getElementById('search');
  const statusEl = document.getElementById('status');
  const previewEl = document.getElementById('preview');
  const fontSizeValueEl = document.getElementById('fontSizeValue');
  const verseInfoEl = document.getElementById('verseInfo');
  const currentTitleEl = document.getElementById('currentTitle');

  let hymns = [];
  let filtered = [];
  let currentHymn = null;
  let currentVerse = 0;
  let currentLineOffset = 0;
  let isDisplaying = false;
  let isShowingChorus = false;
  let services = [];
  let currentService = null;
  let editingService = null;
  let activeSourceFilter = 'all';
  let currentSearchQuery = '';

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
    position: 'bottom'
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
    if (normalizeHymnNumbers(hymns)) {
      saveHymns();
    }
    filtered = hymns;
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
      buildSearchIndex(); // Rebuild index when hymns change
    } catch (err) {
      console.error('[Hymns Save Error]', err);
      statusEl.textContent = 'Error saving hymns: ' + err.message;
    }
  }

  function loadSettings() {
    const stored = localStorage.getItem(storageKeys.prefs);
    if (stored) {
      try {
        Object.assign(settings, JSON.parse(stored));
      } catch (err) {
        console.error('[Settings Load Error] Corrupted settings, using defaults:', err);
        // Settings object keeps defaults, no action needed
      }
    }
    applySettingsUI();
  }

  // Debounced settings save - prevents thrashing localStorage
  let settingsSaveTimeout = null;
  function saveSettings() {
    clearTimeout(settingsSaveTimeout);
    settingsSaveTimeout = setTimeout(() => {
      try {
        localStorage.setItem(storageKeys.prefs, JSON.stringify(settings));
        if (isDisplaying && currentHymn) {
          sendCommand('show'); // Update overlay with new settings
        }
      } catch (err) {
        console.error('[Settings Save Error]', err);
        statusEl.textContent = 'Error saving settings: ' + err.message;
      }
    }, 300); // Debounce: wait 300ms after last change before saving
  }

  function highlightMatch(text, query) {
    if (!query || !text) return escapeHtml(text || '');
    const escaped = escapeHtml(text);
    const escapedQuery = escapeHtml(query);
    const idx = escaped.toLowerCase().indexOf(escapedQuery.toLowerCase());
    if (idx === -1) return escaped;
    return (
      escaped.slice(0, idx) +
      '<mark>' + escaped.slice(idx, idx + escapedQuery.length) + '</mark>' +
      escaped.slice(idx + escapedQuery.length)
    );
  }

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
      const fullTitle = hymnRef + h.title;
      const highlightedTitle = highlightMatch(fullTitle, q);
      const safeAuthor = escapeHtml(h.author || 'Unknown');
      const isActive = currentHymn && currentHymn.id === h.id ? ' active' : '';
      const versesLabel = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('hymns.labels.versesCount', { count: h.verses.length }) : `${h.verses.length} verse(s)`;
      return `
      <div class="list-item${isActive}" data-id="${h.id}" role="option" aria-selected="${isActive ? 'true' : 'false'}">
        <div class="title">${highlightedTitle}</div>
        <div class="meta">${safeAuthor} • ${versesLabel}</div>
      </div>`;
    }).join('');
  }

  function renderSourceFilters() {
    const container = document.getElementById('sourceFilters');
    if (!container) return;

    const sources = [...new Set(hymns.map(h => h.metadata?.sourceAbbr).filter(Boolean))].sort();
    if (sources.length === 0) {
      container.innerHTML = '';
      return;
    }

    const allChip = `<button class="source-chip${activeSourceFilter === 'all' ? ' active' : ''}" data-source="all">All</button>`;
    const chips = sources.map(src =>
      `<button class="source-chip${activeSourceFilter === src ? ' active' : ''}" data-source="${escapeHtml(src)}">${escapeHtml(src)}</button>`
    ).join('');
    container.innerHTML = allChip + chips;
  }

  function selectHymn(id) {
    currentHymn = hymns.find(h => h.id === id);
    currentVerse = 0;
    currentLineOffset = 0;
    isShowingChorus = false;

    // Auto-expand preview when hymn is selected
    const toggle = document.getElementById('previewToggle');
    const body = document.getElementById('previewBody');
    if (toggle && body && toggle.getAttribute('aria-expanded') === 'false') {
      toggle.setAttribute('aria-expanded', 'true');
      body.hidden = false;
    }

    updatePreview();
    updateServiceBanner();
    renderList();
    sendCommand('show'); // Auto-display when hymn is selected
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

    let lines = [];

    if (isShowingChorus && currentHymn.chorus) {
      lines = currentHymn.chorus.split('\n');
    } else {
      const verseText = currentHymn.verses[currentVerse] || '';
      lines = verseText.split('\n');
    }

    const windowed = lines.slice(currentLineOffset, currentLineOffset + settings.linesPerPage);
    previewEl.textContent = windowed.join('\n');

    const isLastVerse = currentVerse === currentHymn.verses.length - 1;
    const isLastVerseLabel = isLastVerse && !isShowingChorus && !currentHymn.chorus
      ? ' · Last verse'
      : (isLastVerse && isShowingChorus ? ' · Last chorus' : '');

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
    const btnPrevVerse = document.getElementById('btnPrevVerse');
    const btnNextVerse = document.getElementById('btnNextVerse');
    const btnPrevLine = document.getElementById('btnPrevLine');
    const btnNextLine = document.getElementById('btnNextLine');
    const btnJumpChorus = document.getElementById('btnJumpChorus');

    if (!currentHymn) {
      [btnPrevVerse, btnNextVerse, btnPrevLine, btnNextLine, btnJumpChorus].forEach(b => { if (b) b.disabled = true; });
      return;
    }

    const atFirstContent = currentVerse === 0 && !isShowingChorus;
    const atLastContent = currentVerse === currentHymn.verses.length - 1 &&
      (!currentHymn.chorus || isShowingChorus);

    let currentLines = [];
    if (isShowingChorus && currentHymn.chorus) {
      currentLines = currentHymn.chorus.split('\n');
    } else {
      currentLines = (currentHymn.verses[currentVerse] || '').split('\n');
    }

    const atFirstLineWindow = currentLineOffset === 0;
    const atLastLineWindow = currentLineOffset + settings.linesPerPage >= currentLines.length;

    if (btnPrevVerse) btnPrevVerse.disabled = atFirstContent;
    if (btnNextVerse) btnNextVerse.disabled = atLastContent;
    if (btnPrevLine) btnPrevLine.disabled = atFirstContent && atFirstLineWindow;
    if (btnNextLine) btnNextLine.disabled = atLastContent && atLastLineWindow;
    if (btnJumpChorus) btnJumpChorus.disabled = !currentHymn.chorus;
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

      let lines = [];
      if (isShowingChorus && currentHymn.chorus) {
        lines = currentHymn.chorus.split('\n');
      } else {
        const verseText = currentHymn.verses[currentVerse] || '';
        lines = verseText.split('\n');
      }

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
        settings: { ...settings },
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
      sendCommand('show'); // Auto-update overlay
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

    let lines = [];
    if (isShowingChorus && currentHymn.chorus) {
      lines = currentHymn.chorus.split('\n');
    } else {
      lines = currentHymn.verses[currentVerse].split('\n');
    }

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
        let prevLines = [];
        if (isShowingChorus && currentHymn.chorus) {
          prevLines = currentHymn.chorus.split('\n');
        } else {
          prevLines = currentHymn.verses[currentVerse].split('\n');
        }

        // Calculate last page offset
        if (prevLines.length > 0) {
          const remainder = prevLines.length % settings.linesPerPage;
          if (remainder === 0) {
            currentLineOffset = Math.max(0, prevLines.length - settings.linesPerPage);
          } else {
            currentLineOffset = Math.floor(prevLines.length / settings.linesPerPage) * settings.linesPerPage;
            // Wait, if 5 lines, 2 per page: 0-1, 2-3, 4. 
            // Length 5. Floor(5/2)*2 = 4. Correct.
            // If 4 lines, 2 per page: 0-1, 2-3.
            // Length 4. Floor(4/2)*2 = 4. Incorrect. Should be 2.
            // If exact multiple, logic should be length - perPage.
          }

          // Simplified logic that covers both:
          currentLineOffset = Math.floor((prevLines.length - 1) / settings.linesPerPage) * settings.linesPerPage;
          if (currentLineOffset < 0) currentLineOffset = 0;
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
        settings: { ...settings },
        timestamp: Date.now()
      };
      localStorage.setItem(storageKeys.textslide, JSON.stringify(payload));
      sendCommand('hide'); // Hide hymn overlay when text slide is sent
      if (statusEl) statusEl.textContent = 'Text slide sent';
    } catch (err) {
      console.error('[Text Slide Error]', err);
    }
  }

  function clearTextSlide() {
    try {
      localStorage.setItem(storageKeys.textslide, JSON.stringify({ type: 'hide', timestamp: Date.now() }));
      if (statusEl) statusEl.textContent = 'Text slide cleared';
    } catch (err) {
      console.error('[Text Slide Clear Error]', err);
    }
  }

  function resetPosition() {
    currentLineOffset = 0;
    currentVerse = 0;
    isShowingChorus = false;
    updatePreview();
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
    const confirmMsg = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('hymns.confirmations.delete', { title: currentHymn.title }) : 'Delete "' + currentHymn.title + '"?';
    if (confirm(confirmMsg)) {
      deleteHymn(currentHymn.id);
    }
  }

  function openEditModal(hymn) {
    const modal = document.getElementById('editModal');
    const modalTitle = document.getElementById('modalTitle');

    if (hymn) {
      // Edit existing hymn
      modalTitle.textContent = 'Edit Hymn';
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
      modalTitle.textContent = 'Add New Hymn';
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

  function addHymnDialog(existing) {
    const title = prompt('Title', existing ? existing.title : '');
    if (!title) return;
    const author = prompt('Author', existing ? existing.author : '');
    const versesText = prompt('Verses (separate verses with blank line)', existing ? existing.verses.join('\n\n') : '');
    if (!versesText) return;
    const verses = versesText.split(/\n\s*\n/).map(v => v.trim()).filter(Boolean);
    if (existing) {
      existing.title = title;
      existing.author = author;
      existing.verses = verses;
    } else {
      hymns.push({
        id: `hymn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        title,
        author,
        verses,
        chorus: '',
        metadata: {},
        createdAt: new Date().toISOString()
      });
    }
    saveHymns();
    filtered = hymns;
    renderList();
  }

  function deleteHymn(id) {
    hymns = hymns.filter(h => h.id !== id);
    if (currentHymn && currentHymn.id === id) currentHymn = null;

    // Clean stale references from all services
    let servicesModified = 0;
    services.forEach(service => {
      const before = service.hymns.length;
      service.hymns = service.hymns.filter(hId => hId !== id);
      if (service.hymns.length < before) servicesModified++;
    });
    if (servicesModified > 0) {
      saveServices();
      renderServicesList();
      statusEl.textContent = `Hymn deleted (${servicesModified} service${servicesModified > 1 ? 's' : ''} updated)`;
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
      const hymnsHtml = isActive ? service.hymns.map((hymnId, index) => {
        const hymn = hymns.find(h => h.id === hymnId);
        if (!hymn) return '';
        const number = hymn.metadata?.number ? `${hymn.metadata.number} - ` : '';
        const safeTitle = escapeHtml(number + hymn.title);
        const isCurrentHymn = currentHymn && currentHymn.id === hymnId;
        return `
          <div class="service-hymn-list-item${isCurrentHymn ? ' active' : ''}" onclick="window.hymnflowSelectHymnFromService('${hymnId}')">
            <span class="service-hymn-order">${index + 1}.</span>
            <span class="service-hymn-title">${safeTitle}</span>
          </div>
        `;
      }).join('') : '';

      const safeServiceName = escapeHtml(service.name);
      return `
        <div class="service-item${isActive ? ' active' : ''}" data-service-id="${service.id}">
          <div class="service-item-info" onclick="window.hymnflowSelectService('${service.id}')">
            <div class="service-item-name">${safeServiceName}</div>
            <div class="service-item-count">${window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('services.hymnsCount', { count: service.hymns.length }) : service.hymns.length + ' hymn(s)'}</div>
          </div>
          <div class="service-item-actions">
            <button class="btn btn-secondary" onclick="event.stopPropagation(); window.hymnflowSelectService('${service.id}')">${window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('services.buttons.load') : 'Load'}</button>
            <button class="btn btn-secondary" onclick="event.stopPropagation(); window.hymnflowEditService('${service.id}')">${window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('services.buttons.edit') : 'Edit'}</button>
            <button class="btn btn-remove" onclick="event.stopPropagation(); window.hymnflowDeleteService('${service.id}')">${window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('services.buttons.delete') : 'Del'}</button>
          </div>
          ${isActive ? `<div class="service-hymns-list">${hymnsHtml}</div>` : ''}
        </div>
      `;
    }).join('');
  }

  function openServiceEditor(serviceId = null) {
    const editor = document.getElementById('serviceEditor');
    const nameInput = document.getElementById('serviceName');
    const hymnsContainer = document.getElementById('serviceHymns');

    if (serviceId) {
      editingService = services.find(s => s.id === serviceId);
      nameInput.value = editingService.name;
    } else {
      editingService = { id: generateUniqueServiceId(), name: '', hymns: [] };
      nameInput.value = '';
    }

    renderServiceHymns();
    editor.style.display = 'block';
  }

  function closeServiceEditor() {
    document.getElementById('serviceEditor').style.display = 'none';
    editingService = null;
  }

  function renderServiceHymns() {
    const container = document.getElementById('serviceHymns');
    if (!editingService || editingService.hymns.length === 0) {
      const msg = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('services.noHymnsInService') : 'No hymns added yet';
      container.innerHTML = `<div style="padding: 12px; text-align: center; color: var(--text-muted); font-size: 12px;">${msg}</div>`;
      return;
    }
    container.innerHTML = editingService.hymns.map((hymnId, index) => {
      const hymn = hymns.find(h => h.id === hymnId);
      if (!hymn) return '';
      const number = hymn.metadata?.number ? `${hymn.metadata.number} - ` : '';
      const safeTitle = escapeHtml(number + hymn.title);
      return `
        <div class="service-hymn-item">
          <div class="service-hymn-item-info">
            <div class="service-hymn-number">#${index + 1}</div>
            <div class="service-hymn-title">${safeTitle}</div>
          </div>
          <div class="service-hymn-controls">
            <button class="btn btn-secondary" onclick="window.hymnflowMoveServiceHymn(${index}, -1)">↑</button>
            <button class="btn btn-secondary" onclick="window.hymnflowMoveServiceHymn(${index}, 1)">↓</button>
            <button class="btn btn-remove" onclick="window.hymnflowRemoveServiceHymn(${index})">×</button>
          </div>
        </div>
      `;
    }).join('');
  }

  function saveService() {
    const nameInput = document.getElementById('serviceName');
    const name = nameInput.value.trim();

    if (!name) {
      const msg = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('services.alerts.nameRequired') : 'Service name is required';
      alert(msg);
      return;
    }

    if (editingService.hymns.length === 0) {
      const msg = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('services.alerts.atLeastOneHymn') : 'Add at least one hymn to the service';
      alert(msg);
      return;
    }

    editingService.name = name;

    // Validate service structure before saving
    const { valid, errors } = window.HymnValidator.validateService(editingService, hymns);
    if (!valid) {
      const msg = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('services.alerts.validationFailed', { errors: errors.join('\n') }) : 'Service validation failed:\n' + errors.join('\n');
      alert(msg);
      return;
    }

    const existingIndex = services.findIndex(s => s.id === editingService.id);
    if (existingIndex >= 0) {
      services[existingIndex] = editingService;
    } else {
      services.push(editingService);
    }

    saveServices();
    renderServicesList();
    closeServiceEditor();
    if (window.HymnFlowI18n) {
      statusEl.textContent = window.HymnFlowI18n.getTranslation('services.status.saved');
    } else {
      statusEl.textContent = 'Service saved';
    }
  }

  function updateServiceBanner() {
    const banner = document.getElementById('serviceBanner');
    const bannerName = document.getElementById('serviceBannerName');
    const bannerPos = document.getElementById('serviceBannerPos');
    const btnPrevHymn = document.getElementById('btnPrevHymn');
    const btnNextHymn = document.getElementById('btnNextHymn');

    if (!currentService || currentService.hymns.length === 0) {
      if (banner) banner.style.display = 'none';
      return;
    }

    const validHymns = currentService.hymns.filter(id => hymns.find(h => h.id === id));
    if (validHymns.length === 0) {
      if (banner) banner.style.display = 'none';
      return;
    }

    const currentIdx = currentHymn
      ? validHymns.indexOf(currentHymn.id)
      : -1;

    if (banner) banner.style.display = 'flex';
    if (bannerName) bannerName.textContent = currentService.name;
    if (bannerPos) {
      bannerPos.textContent = currentIdx >= 0
        ? `${currentIdx + 1}/${validHymns.length}`
        : `0/${validHymns.length}`;
    }
    if (btnPrevHymn) btnPrevHymn.disabled = currentIdx <= 0;
    if (btnNextHymn) btnNextHymn.disabled = currentIdx >= validHymns.length - 1;
  }

  function prevServiceHymn() {
    if (!currentService) return;
    const validHymns = currentService.hymns.filter(id => hymns.find(h => h.id === id));
    const currentIdx = currentHymn ? validHymns.indexOf(currentHymn.id) : -1;
    if (currentIdx > 0) selectHymn(validHymns[currentIdx - 1]);
  }

  function nextServiceHymn() {
    if (!currentService) return;
    const validHymns = currentService.hymns.filter(id => hymns.find(h => h.id === id));
    const currentIdx = currentHymn ? validHymns.indexOf(currentHymn.id) : -1;
    if (currentIdx < validHymns.length - 1) selectHymn(validHymns[currentIdx + 1]);
    else if (currentIdx === -1 && validHymns.length > 0) selectHymn(validHymns[0]);
  }

  function selectService(serviceId) {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      // Validate service before loading
      const { valid, errors } = window.HymnValidator.validateService(service, hymns);
      if (!valid) {
        console.warn('[Service Validation] Issues loading service:', errors);
        if (window.HymnFlowI18n) {
          statusEl.textContent = window.HymnFlowI18n.getTranslation('services.status.validationIssues');
        } else {
          statusEl.textContent = 'Warning: Service has validation issues';
        }
      }
      currentService = service;
      if (window.HymnFlowI18n) {
        statusEl.textContent = window.HymnFlowI18n.getTranslation('services.status.loaded', { name: currentService.name, count: currentService.hymns.length });
      } else {
        statusEl.textContent = `Loaded service: ${currentService.name} (${currentService.hymns.length} hymns)`;
      }
    }
    updateServiceBanner();
    renderServicesList();
  }

  function selectHymnFromService(hymnId) {
    const hymn = hymns.find(h => h.id === hymnId);
    if (hymn) {
      selectHymn(hymn.id);
      renderServicesList(); // Re-render to show active hymn
    }
  }

  function deleteService(serviceId) {
    const confirmMsg = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('services.confirmations.delete') : 'Delete this service?';
    if (confirm(confirmMsg)) {
      const serviceToDelete = services.find(s => s.id === serviceId);
      if (serviceToDelete) {
        services = services.filter(s => s.id !== serviceId);
        if (currentService && currentService.id === serviceId) {
          currentService = null;
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

  // Global functions for onclick handlers
  window.hymnflowSelectService = selectService;
  window.hymnflowSelectHymnFromService = selectHymnFromService;
  window.hymnflowEditService = openServiceEditor;
  window.hymnflowDeleteService = deleteService;
  window.hymnflowMoveServiceHymn = (index, direction) => {
    if (!editingService) return;
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < editingService.hymns.length) {
      [editingService.hymns[index], editingService.hymns[newIndex]] = [editingService.hymns[newIndex], editingService.hymns[index]];
      renderServiceHymns();
    }
  };
  window.hymnflowRemoveServiceHymn = (index) => {
    if (!editingService) return;
    editingService.hymns.splice(index, 1);
    renderServiceHymns();
  };


  function attachEvents() {
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

    document.getElementById('btnImport').onclick = () => document.getElementById('fileInput').click();
    document.getElementById('fileInput').onchange = handleImport;
    document.getElementById('btnExport').onclick = handleExport;

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

    // Service banner Prev/Next Hymn
    document.getElementById('btnPrevHymn').onclick = prevServiceHymn;
    document.getElementById('btnNextHymn').onclick = nextServiceHymn;

    // Service controls
    document.getElementById('btnNewService').onclick = () => openServiceEditor();
    document.getElementById('btnAddToService').onclick = () => {
      if (!currentHymn) {
        const msg = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('hymns.alerts.noHymnSelected') : 'Select a hymn first';
        alert(msg);
        return;
      }
      if (!editingService.hymns.includes(currentHymn.id)) {
        editingService.hymns.push(currentHymn.id);
        renderServiceHymns();
      }
    };
    document.getElementById('btnSaveService').onclick = saveService;
    document.getElementById('btnCancelService').onclick = closeServiceEditor;

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      // Don't intercept keys when typing in input/textarea
      const target = e.target;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === 'ArrowRight') { e.preventDefault(); nextVerse(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prevVerse(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); prevLineWindow(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); nextLineWindow(); }
      if (e.key === ' ') { e.preventDefault(); toggleDisplay(); }
    });
  }

  async function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const ext = file.name.split('.').pop().toLowerCase();
      let parsed = [];
      if (ext === 'txt') parsed = await parseTxt(file);
      else if (ext === 'csv') parsed = await parseCsv(file);
      else if (ext === 'json') parsed = await parseJson(file);
      else throw new Error('Use .txt, .csv, or .json');

      // Generate unique IDs BEFORE validation (validators expect id field)
      parsed.forEach((h) => {
        const hasValidId = typeof h.id === 'string' && h.id.startsWith('hymn_');
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
    }
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
  loadServices();
  buildSearchIndex();
  renderSourceFilters();
  renderList();
  renderServicesList();
  updateServiceBanner();
  attachEvents();
  setupLanguageSelector();
  if (window.HymnFlowI18n) {
    statusEl.textContent = window.HymnFlowI18n.getTranslation('app.status.ready', { storage: 'localStorage' });
  } else {
    statusEl.textContent = 'Ready (localStorage)';
  }
})();
