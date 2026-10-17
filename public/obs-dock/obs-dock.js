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


  // ── In-dock notifications & confirmations (replace blocking alert/confirm) ──
  // Looks the key up in the English dictionary first so brand-new strings can
  // ship with an inline English fallback without console warning floods.
  const t = (key, fallback, params = {}) => {
    const fill = (str) => {
      Object.keys(params).forEach(k => { str = str.split('{' + k + '}').join(String(params[k])); });
      return str;
    };
    const en = window.HymnFlowTranslations && window.HymnFlowTranslations.en;
    const known = en && key.split('.').reduce((o, k) => (o && typeof o === 'object' && k in o) ? o[k] : undefined, en);
    if (typeof known !== 'string' || !window.HymnFlowI18n) return fill(fallback);
    return window.HymnFlowI18n.getTranslation(key, params);
  };

  // action: optional { label, fn } rendered as a button inside the toast
  // (used for Undo / Restore).
  function notify(message, type = 'error', action = null) {
    let host = document.getElementById('toastHost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'toastHost';
      host.className = 'toast-host';
      host.setAttribute('role', 'status');
      host.setAttribute('aria-live', 'polite');
      document.body.appendChild(host);
    }
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    const text = document.createElement('span');
    text.textContent = message;
    el.appendChild(text);
    const dismiss = () => { el.classList.add('toast-out'); setTimeout(() => el.remove(), 200); };
    if (action) {
      const btn = document.createElement('button');
      btn.className = 'toast-action';
      btn.textContent = action.label;
      btn.onclick = (e) => { e.stopPropagation(); dismiss(); action.fn(); };
      el.appendChild(btn);
    }
    el.onclick = dismiss;
    host.appendChild(el);
    while (host.children.length > 3) host.firstChild.remove();
    setTimeout(dismiss, action ? 9000 : Math.min(12000, 3500 + message.length * 40));
    statusEl.textContent = message.split('\n')[0];
  }

  function askConfirm(message, okLabel) {
    return new Promise(resolve => {
      const prevFocus = document.activeElement;
      const overlay = document.createElement('div');
      overlay.className = 'confirm-overlay';
      const box = document.createElement('div');
      box.className = 'confirm-box';
      box.setAttribute('role', 'alertdialog');
      box.setAttribute('aria-modal', 'true');
      const text = document.createElement('p');
      text.className = 'confirm-text';
      text.textContent = message;
      const row = document.createElement('div');
      row.className = 'confirm-actions';
      const cancel = document.createElement('button');
      cancel.className = 'btn btn-secondary';
      cancel.textContent = t('modal.buttons.cancel', 'Cancel');
      const ok = document.createElement('button');
      ok.className = 'btn btn-add';
      ok.textContent = okLabel || t('modal.buttons.ok', 'OK');
      row.append(cancel, ok);
      box.append(text, row);
      overlay.appendChild(box);
      document.body.appendChild(overlay);
      const done = result => {
        document.removeEventListener('keydown', onKey, true);
        overlay.remove();
        if (prevFocus && prevFocus.focus) prevFocus.focus();
        resolve(result);
      };
      const onKey = e => {
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); done(false); }
        else if (e.key === 'Tab') {
          e.preventDefault();
          (document.activeElement === ok ? cancel : ok).focus();
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.stopPropagation();
        }
      };
      document.addEventListener('keydown', onKey, true);
      cancel.onclick = () => done(false);
      ok.onclick = () => done(true);
      overlay.onclick = e => { if (e.target === overlay) done(false); };
      cancel.focus();
    });
  }

  let hymns = [];
  let filtered = [];
  let currentHymn = null;
  let currentVerse = 0;
  let currentLineOffset = 0;
  let isDisplaying = false;
  let isShowingChorus = false;
  let advanceArmedUntil = 0;   // end-of-item guard: second Next within window advances
  let lastLive = null;         // what was on screen before Blank / Emergency Clear
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
    // Scripture display (projection style for Bible verses)
    scriptureFontFamily: 'serif',   // 'serif' | 'lyrics' | explicit font stack
    scriptureItalic: true,
    scriptureShowReference: true,
    scriptureShowBadge: true,
    scriptureCustomSize: false,
    scriptureFontSize: 44,
    scriptureAutoDisplay: false,  // planned scripture items go live on activation
    confirmItemAdvance: true,     // last verse + Next asks for a second press before changing item
    // Collapsible panel states
    scripturePanelOpen: false,
    obsPanelOpen: false,
    textSlidePanelOpen: false,
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

          // Search in pre-computed lowercase fields. Single-character queries
          // match hymn numbers exactly (typing "5" finds hymn 5, not 15/50/...).
          const numStr = idxEntry.number.toString();
          return (
            idxEntry.titleLower.includes(q) ||
            idxEntry.authorLower.includes(q) ||
            (q.length > 1 ? numStr.includes(q) : numStr === q) ||
            idxEntry.sourceAbbrLower.includes(q) ||
            idxEntry.sourceLower.includes(q) ||
            combinedRef.includes(q)
          );
        });

        resolve(results);
      }, debounceMs);
    });
  }

  // ── Data safety ───────────────────────────────────────────────────────────
  // Hymns, services and settings live in localStorage. Three layers protect
  // them: unreadable data is quarantined (never silently overwritten), one
  // snapshot is taken each time the dock opens, and destructive actions can be
  // undone for a few seconds. A full backup file can also be exported/restored.
  const BACKUP_SLOTS = ['hymnflow-backup-1', 'hymnflow-backup-2'];
  const PRE_RESTORE_KEY = 'hymnflow-backup-pre-restore';
  const BACKUP_HYMN_LIMIT = 400000;   // chars; bigger libraries rely on file backups

  function quarantineCorrupt(name, raw) {
    if (!raw) return;
    try {
      localStorage.setItem(`hymnflow-corrupt-${name}-${Date.now()}`, raw);
      const kept = Object.keys(localStorage).filter(k => k.startsWith(`hymnflow-corrupt-${name}-`)).sort();
      while (kept.length > 2) localStorage.removeItem(kept.shift());
    } catch (e) { /* storage full — nothing more can be done */ }
    notify(t('operator.corruptKept',
      'Saved {name} data could not be read. A copy was kept in browser storage (hymnflow-corrupt-{name}-*) so it can be recovered.',
      { name }), 'warn');
  }

  function readSlot(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }

  function currentRawData() {
    return {
      ts: Date.now(),
      hymns: localStorage.getItem(storageKeys.hymns),
      services: localStorage.getItem(storageKeys.services),
      prefs: localStorage.getItem(storageKeys.prefs)
    };
  }

  // Once per dock open, before anything migrates or normalises stored data.
  function snapshotData() {
    try {
      const cur = currentRawData();
      if (!cur.services && !cur.hymns) return;
      // Never rotate unreadable data over a good snapshot; quarantine handles it on load.
      const readable = (raw) => { if (!raw) return true; try { JSON.parse(raw); return true; } catch (e) { return false; } };
      if (!readable(cur.hymns) || !readable(cur.services) || !readable(cur.prefs)) return;
      const snap = {
        ts: cur.ts,
        services: cur.services,
        prefs: cur.prefs,
        hymns: cur.hymns && cur.hymns.length <= BACKUP_HYMN_LIMIT ? cur.hymns : null
      };
      const last = readSlot(BACKUP_SLOTS[0]);
      if (last && last.services === snap.services && last.prefs === snap.prefs && last.hymns === snap.hymns) return;
      const prev = localStorage.getItem(BACKUP_SLOTS[0]);
      if (prev) {
        try { localStorage.setItem(BACKUP_SLOTS[1], prev); }
        catch (e) { localStorage.removeItem(BACKUP_SLOTS[1]); }
      }
      localStorage.setItem(BACKUP_SLOTS[0], JSON.stringify(snap));
    } catch (e) {
      console.warn('[Backup] snapshot skipped:', e);
    }
  }

  function snapshotLabel(snap) {
    let h = null, sv = 0;
    try { h = snap.hymns ? JSON.parse(snap.hymns).length : null; } catch (e) { /* ignore */ }
    try { sv = snap.services ? JSON.parse(snap.services).length : 0; } catch (e) { /* ignore */ }
    return `${new Date(snap.ts).toLocaleString()} — ${h === null ? 'hymns not stored' : h + ' hymn(s)'}, ${sv} service(s)`;
  }

  function refreshBackupSlots() {
    const sel = document.getElementById('backupSlot');
    const btn = document.getElementById('btnBackupRestoreAuto');
    if (!sel) return;
    sel.innerHTML = '';
    const names = { [BACKUP_SLOTS[0]]: 'Latest', [BACKUP_SLOTS[1]]: 'Previous', [PRE_RESTORE_KEY]: 'Before last restore' };
    [BACKUP_SLOTS[0], BACKUP_SLOTS[1], PRE_RESTORE_KEY].forEach(key => {
      const snap = readSlot(key);
      if (!snap) return;
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = `${names[key]}: ${snapshotLabel(snap)}`;
      sel.appendChild(opt);
    });
    if (!sel.children.length) {
      const opt = document.createElement('option');
      opt.textContent = 'No snapshots yet';
      sel.appendChild(opt);
    }
    if (btn) btn.disabled = !readSlot(sel.value);
  }

  // Keeps the OBS connection details of this machine when restoring settings.
  function mergedPrefsRaw(prefsObj) {
    const keep = {};
    ['obsWsHost', 'obsWsPort', 'obsWsPassword', 'obsWsEnabled'].forEach(k => { keep[k] = settings[k]; });
    return JSON.stringify(Object.assign({}, prefsObj || {}, keep));
  }

  // Stores today's data so a restore can itself be undone. Returns false when
  // the library is too large to keep a second copy in browser storage.
  function storePreRestore() {
    try {
      localStorage.setItem(PRE_RESTORE_KEY, JSON.stringify(currentRawData()));
      return true;
    } catch (e) {
      try { localStorage.removeItem(PRE_RESTORE_KEY); } catch (e2) { /* ignore */ }
      return false;
    }
  }

  async function confirmAndRestore(summary, apply, hasSafetyCopy) {
    let msg = summary;
    if (!hasSafetyCopy) {
      msg += `\n\nYour library is too large to keep an automatic safety copy — export a backup file first if you may want today's data back.`;
    }
    if (!(await askConfirm(msg, t('operator.restore', 'Restore')))) return false;
    apply();
    location.reload();
    return true;
  }

  async function restoreSnapshot(key) {
    const snap = readSlot(key);
    if (!snap) { notify(t('operator.noSnapshot', 'That snapshot is no longer available.')); return; }
    const hasSafety = storePreRestore();
    // Writing the safety copy may have replaced the snapshot we are restoring.
    const source = key === PRE_RESTORE_KEY ? snap : (readSlot(key) || snap);
    let summary = `Replace the current hymns, services and settings with the snapshot from ${snapshotLabel(source)}?`;
    if (!source.hymns) summary += `\n\nHymns were too large to store in this snapshot and will be left as they are.`;
    await confirmAndRestore(summary, () => {
      if (source.hymns) localStorage.setItem(storageKeys.hymns, source.hymns);
      if (source.services !== null && source.services !== undefined) localStorage.setItem(storageKeys.services, source.services);
      if (source.prefs) {
        let parsed = null;
        try { parsed = JSON.parse(source.prefs); } catch (e) { /* ignore */ }
        if (parsed) localStorage.setItem(storageKeys.prefs, mergedPrefsRaw(parsed));
      }
    }, hasSafety);
  }

  async function exportBackup() {
    const prefs = Object.assign({}, settings);
    ['obsWsHost', 'obsWsPort', 'obsWsPassword', 'obsWsEnabled'].forEach(k => { delete prefs[k]; });
    const data = {
      format: 'hymnflow-backup',
      version: 1,
      exportedAt: new Date().toISOString(),
      hymns,
      services,
      settings: prefs
    };
    const stamp = new Date().toISOString().slice(0, 10);
    const result = await saveTextFile(`hymnflow-backup-${stamp}.json`, JSON.stringify(data, null, 2), 'application/json', '.json');
    notify(exportStatusMessage(result), result.cancelled ? 'warn' : 'info');
  }

  async function restoreFromFile(file) {
    let obj = null;
    try { obj = JSON.parse(await file.text()); } catch (e) { /* handled below */ }
    if (!obj || obj.format !== 'hymnflow-backup' || !Array.isArray(obj.hymns) || !Array.isArray(obj.services)) {
      notify(t('operator.notBackup', 'That file is not a HymnFlow backup.'));
      return;
    }
    const checked = window.HymnValidator ? window.HymnValidator.batchValidate(obj.hymns) : { valid: obj.hymns, invalid: [] };
    const svc = obj.services.filter(x => x && typeof x.id === 'string' && typeof x.name === 'string' && Array.isArray(x.items));
    const skipped = checked.invalid.length + (obj.services.length - svc.length);
    if (!checked.valid.length) { notify(t('operator.emptyBackup', 'The backup contains no usable hymns.')); return; }
    const hasSafety = storePreRestore();
    let summary = `Replace ALL current hymns, services and settings with this backup (${checked.valid.length} hymn(s), ${svc.length} service(s))?`;
    if (skipped) summary += `\n\n${skipped} unusable entr${skipped === 1 ? 'y' : 'ies'} in the file will be skipped.`;
    await confirmAndRestore(summary, () => {
      localStorage.setItem(storageKeys.hymns, JSON.stringify(checked.valid));
      localStorage.setItem(storageKeys.services, JSON.stringify(svc));
      localStorage.setItem(storageKeys.prefs, mergedPrefsRaw(obj.settings));
    }, hasSafety);
  }

  // Undo for destructive actions: toast with an Undo button for a few seconds.
  function captureState() {
    return {
      hymns: JSON.stringify(hymns),
      services: JSON.stringify(services),
      serviceId: currentService ? currentService.id : null,
      hymnId: currentHymn ? currentHymn.id : null
    };
  }

  function offerUndo(message, before) {
    notify(message, 'info', {
      label: t('operator.undo', 'Undo'),
      fn: () => {
        hymns = JSON.parse(before.hymns);
        services = JSON.parse(before.services);
        saveHymns();
        saveServices();
        filtered = hymns;
        currentService = before.serviceId ? (services.find(x => x.id === before.serviceId) || null) : null;
        currentHymn = before.hymnId ? (hymns.find(h => h.id === before.hymnId) || null) : null;
        renderSourceFilters();
        renderList();
        renderServicesList();
        updateServiceBanner();
        updatePreview();
        statusEl.textContent = t('operator.undone', 'Restored');
      }
    });
  }

  // ── Live-state restore (after Blank / Emergency Clear) ────────────────────
  function updateRestoreButton() {
    const btn = document.getElementById('btnRestore');
    if (btn) btn.hidden = !lastLive;
  }

  function captureLive() {
    if (!currentHymn && !qsChunks.length) return;
    if (!isDisplaying && lastLive) return;   // don't overwrite a good capture with "nothing live"
    const refEl = document.getElementById('qsRef');
    lastLive = {
      hymnId: currentHymn ? currentHymn.id : null,
      verse: currentVerse,
      chorus: isShowingChorus,
      offset: currentLineOffset,
      displaying: isDisplaying,
      serviceIdx: currentServiceItemIndex,
      qs: qsChunks.length ? { chunks: qsChunks.slice(), idx: qsChunkIdx, ref: refEl ? refEl.value.trim() : '' } : null
    };
    updateRestoreButton();
  }

  function offerRestore(message) {
    if (!lastLive) return;
    notify(message, 'info', { label: t('operator.restore', 'Restore'), fn: restoreLive });
  }

  function restoreLive() {
    if (!lastLive) { notify(t('operator.nothingToRestore', 'Nothing to restore'), 'info'); return; }
    const snap = lastLive;
    lastLive = null;
    updateRestoreButton();
    if (snap.hymnId) {
      const h = hymns.find(x => x.id === snap.hymnId);
      if (h) {
        currentHymn = h;
        currentVerse = Math.min(snap.verse, h.verses.length - 1);
        isShowingChorus = snap.chorus && !!h.chorus;
        currentLineOffset = snap.offset;
        if (currentService && snap.serviceIdx >= 0) currentServiceItemIndex = snap.serviceIdx;
        updatePreview();
        updateServiceBanner();
        renderList();
        renderServicesList();
        if (snap.displaying) sendCommand('show');
      }
    }
    if (snap.qs) {
      qsChunks = snap.qs.chunks;
      qsChunkIdx = snap.qs.idx;
      sendScriptureToOverlay(snap.qs.ref, qsChunks[qsChunkIdx]);
      previewScripture(snap.qs.ref, qsChunks[qsChunkIdx]);
      updateQsControls();
    }
    statusEl.textContent = t('operator.restored', 'Restored what was on screen');
  }

  // ── Verse jump chips ──────────────────────────────────────────────────────
  function renderVerseChips() {
    const box = document.getElementById('verseChips');
    if (!box) return;
    box.innerHTML = '';
    if (!currentHymn) return;
    const mk = (label, verse, active, title) => {
      const b = document.createElement('button');
      b.className = 'verse-chip' + (active ? ' active' : '');
      b.dataset.verse = verse;
      b.textContent = label;
      b.title = title;
      b.setAttribute('aria-pressed', active ? 'true' : 'false');
      return b;
    };
    currentHymn.verses.forEach((_, i) => {
      box.appendChild(mk(String(i + 1), String(i), i === currentVerse && !isShowingChorus, `Show verse ${i + 1}`));
    });
    if (currentHymn.chorus) box.appendChild(mk('C', 'chorus', isShowingChorus, 'Show chorus'));
  }

  function jumpToVerse(index) {
    if (!currentHymn || index < 0 || index >= currentHymn.verses.length) return;
    currentVerse = index;
    isShowingChorus = false;
    currentLineOffset = 0;
    advanceArmedUntil = 0;
    updatePreview();
    sendCommand('show');
  }

  // ── Shortcut cheat sheet ──────────────────────────────────────────────────
  function showShortcuts() {
    if (document.querySelector('.confirm-overlay')) return;
    const rows = [
      ['→  ←', 'Next / previous verse (chorus is inserted after each verse)'],
      ['↓  ↑', 'Next / previous line window'],
      ['1 – 9', 'Jump straight to that verse'],
      ['C', 'Show the chorus'],
      [']  PgDn', 'Next service item'],
      ['[  PgUp', 'Previous service item'],
      ['Space', 'Display on / off'],
      ['B', 'Blank the screen (keeps your place)'],
      ['X', 'Emergency Clear'],
      ['Z', 'Restore what was on screen before Blank / Clear'],
      ['Esc', 'Close dialogs and editors'],
      ['?', 'Show this list']
    ];
    const prevFocus = document.activeElement;
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    const box = document.createElement('div');
    box.className = 'confirm-box shortcut-box';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Keyboard shortcuts');
    const table = document.createElement('table');
    table.className = 'shortcut-table';
    rows.forEach(([k, d]) => {
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      const kbd = document.createElement('code');
      kbd.textContent = k;
      td1.appendChild(kbd);
      const td2 = document.createElement('td');
      td2.textContent = d;
      tr.append(td1, td2);
      table.appendChild(tr);
    });
    const note = document.createElement('p');
    note.className = 'backup-note';
    note.textContent = 'Shortcuts work while the dock has focus. For keys that work from any window, connect OBS hotkeys in Style → OBS Connection.';
    const close = document.createElement('button');
    close.className = 'btn btn-add';
    close.textContent = 'Close';
    const row = document.createElement('div');
    row.className = 'confirm-actions';
    row.appendChild(close);
    box.append(table, note, row);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    const done = () => {
      document.removeEventListener('keydown', onKey, true);
      overlay.remove();
      if (prevFocus && prevFocus.focus) prevFocus.focus();
    };
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === '?') { e.preventDefault(); e.stopPropagation(); done(); }
      else if (e.key === 'Tab') { e.preventDefault(); close.focus(); }
      else { e.stopPropagation(); }
    };
    document.addEventListener('keydown', onKey, true);
    close.onclick = done;
    overlay.onclick = (e) => { if (e.target === overlay) done(); };
    close.focus();
  }

  function setHotkeyChip(state) {
    const chip = document.getElementById('hotkeyChip');
    if (!chip) return;
    const label = state === 'connected' ? 'Global hotkeys: on'
      : state === 'connecting' ? 'Global hotkeys: connecting…'
      : 'Global hotkeys: off';
    chip.textContent = '⌨ ' + label;
    chip.className = 'hotkey-chip' + (state === 'connected' ? ' on' : state === 'connecting' ? ' connecting' : '');
    chip.title = state === 'connected'
      ? 'OBS hotkeys are connected'
      : 'Click to set up global hotkeys (Style → OBS Connection)';
  }

  function loadHymns() {
    const stored = localStorage.getItem(storageKeys.hymns);
    if (stored) {
      try {
        hymns = JSON.parse(stored);
      } catch (err) {
        quarantineCorrupt('hymns', stored);
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
        quarantineCorrupt('settings', stored);
        console.error('[Settings Load Error] Corrupted settings, using defaults:', err);
      }
    }
    settingsCacheValid = false;
    applySettingsUI();
  }

  // Debounced settings save - prevents thrashing localStorage
  let settingsSaveTimeout = null;
  function saveSettings() {
    // Invalidate the snapshot cache immediately — callers often re-push the
    // overlay right after mutating settings, before the debounced write runs.
    settingsCacheValid = false;
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
  let obsWsRetryCount = 0;        // consecutive failed reconnect attempts
  let obsWsWasConnected = false;  // to announce unexpected drops exactly once

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
    setHotkeyChip(state);
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
      case 'blank':          blankScreen();      break;
      case 'clear':          emergencyClear();   break;
      case 'jump_chorus':    jumpToChorus();     break;
      case 'restore':        restoreLive();      break;
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
        if (obsWsRetryCount > 0 || !obsWsWasConnected) {
          statusEl.textContent = 'OBS hotkeys connected';
        }
        obsWsRetryCount = 0;
        obsWsWasConnected = true;
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
        // Announce the drop in the status bar (once), so the operator learns
        // their global hotkeys died before pressing a dead key mid-service.
        if (obsWsWasConnected && obsWsRetryCount === 0) {
          statusEl.textContent = t('display.hotkeysReconnecting', 'OBS hotkeys disconnected — reconnecting…');
        }
        obsWsRetryCount++;
        const badge = document.getElementById('obsWsBadge');
        if (badge) badge.title = `Disconnected — retrying (attempt ${obsWsRetryCount})`;
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

  // Builds the highlight regex once per render (renderList calls this once,
  // not per row) — pass the result to highlightMatch.
  function buildHighlightRegex(query) {
    const escapedQuery = escapeHtml(query || '');
    if (!escapedQuery) return null;
    return new RegExp(escapedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  }

  function highlightMatch(text, regex) {
    const escaped = escapeHtml(text || '');
    if (!regex || !escaped) return escaped;
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

    const hlRegex = buildHighlightRegex(currentSearchQuery.trim());
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
      const highlightedTitle = highlightMatch(fullTitle, hlRegex);
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
    advanceArmedUntil = 0;
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
    if (isDisplaying) {
      sendCommand('show');
    } else {
      // Most common "why is the screen blank" moment: hymn selected, Display off
      statusEl.textContent = window.HymnFlowI18n
        ? window.HymnFlowI18n.getTranslation('display.displayOffHint')
        : t('display.offHint', 'Display is OFF — flip the Display switch to show this hymn');
    }
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

  function previewHexToRgba(hex, alpha) {
    if (!/^#[0-9a-fA-F]{6}$/.test(hex || '')) return `rgba(0,0,0,${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // Resolves the scripture font setting to a concrete CSS font stack.
  // 'serif' → classic serif default, 'lyrics' → follow the lyric font.
  function scriptureFontStack(s) {
    if (s.scriptureFontFamily === 'lyrics') return s.fontFamily || 'inherit';
    if (s.scriptureFontFamily && s.scriptureFontFamily !== 'serif') return s.scriptureFontFamily;
    return "'Georgia', 'Times New Roman', serif";
  }

  // Applies a scaled-down version of the live overlay look to the dock preview
  // box, so the operator previews a faithful render rather than raw text.
  function applyPreviewStyles({ scripture = false } = {}) {
    if (!previewEl) return;
    const s = settings;
    previewEl.style.fontSize = Math.max(13, Math.min(34, Math.round((s.fontSize || 48) * 0.45))) + 'px';
    previewEl.style.color = s.textColor || '#ffffff';
    previewEl.style.textAlign = 'center';
    if (scripture) {
      previewEl.style.fontFamily = scriptureFontStack(s);
      previewEl.style.fontStyle = s.scriptureItalic === false ? 'normal' : 'italic';
      previewEl.style.fontWeight = '400';
      if (s.scriptureCustomSize && typeof s.scriptureFontSize === 'number') {
        previewEl.style.fontSize = Math.max(13, Math.min(34, Math.round(s.scriptureFontSize * 0.45))) + 'px';
      }
    } else {
      previewEl.style.fontFamily = s.fontFamily || 'inherit';
      previewEl.style.fontStyle = s.italic ? 'italic' : 'normal';
      previewEl.style.fontWeight = s.bold ? '700' : '400';
    }
    const opacity = typeof s.bgOpacity === 'number' ? s.bgOpacity / 100 : 0.8;
    if (s.bgType === 'solid') {
      previewEl.style.background = previewHexToRgba(s.bgColorA, opacity);
    } else if (s.bgType === 'gradient') {
      previewEl.style.background = `linear-gradient(135deg, ${previewHexToRgba(s.bgColorA, opacity)}, ${previewHexToRgba(s.bgColorB, opacity)})`;
    } else {
      previewEl.style.background = 'var(--bg)'; // transparent → neutral dock backdrop
    }
  }

  function expandPreview() {
    const toggle = document.getElementById('previewToggle');
    const body = document.getElementById('previewBody');
    if (toggle && body && toggle.getAttribute('aria-expanded') === 'false') {
      toggle.setAttribute('aria-expanded', 'true');
      body.hidden = false;
    }
  }

  // Renders a faithful scripture preview (reference + translation badge + serif
  // prose) and auto-expands the preview panel.
  function previewScripture(rawRef, text) {
    if (!previewEl) return;
    const { reference, translation } = splitReferenceTranslation(rawRef);
    applyPreviewStyles({ scripture: true });
    const badge = (translation && settings.scriptureShowBadge !== false)
      ? ` <span class="preview-translation-badge">${escapeHtml(translation)}</span>`
      : '';
    const head = ((reference || badge) && settings.scriptureShowReference !== false)
      ? `<div class="preview-scripture-head">📖 ${escapeHtml(reference)}${badge}</div>`
      : '';
    previewEl.innerHTML = `${head}<div class="preview-scripture-body">${escapeHtml(text)}</div>`;
    expandPreview();
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
      renderVerseChips();
      updateNavButtonStates();
      return;
    }
    currentTitleEl.textContent = currentHymn.title;

    const lines = getCurrentLines();
    const windowed = lines.slice(currentLineOffset, currentLineOffset + settings.linesPerPage);
    applyPreviewStyles({ scripture: false });
    previewEl.textContent = windowed.join('\n'); // textContent also clears any prior scripture markup

    const isLastVerse = currentVerse === currentHymn.verses.length - 1;
    const i18n = window.HymnFlowI18n;
    const isLastVerseLabel = isLastVerse && !isShowingChorus && !currentHymn.chorus
      ? (i18n ? i18n.getTranslation('navigation.lastVerse') : ' · Last verse')
      : (isLastVerse && isShowingChorus
          ? (i18n ? i18n.getTranslation('navigation.lastChorus') : ' · Last chorus')
          : '');

    if (window.HymnFlowI18n) {
      const i18nKey = (isShowingChorus && currentHymn.chorus) ? 'navigation.chorusInfo' : 'navigation.verseInfo';
      // Sequence hint: with a chorus, "Next" inserts it after every verse —
      // surface that so the flow isn't a surprise mid-song.
      const chorusNext = (currentHymn.chorus && !isShowingChorus) ? t('navigation.chorusNext', ' · Chorus next') : '';
      // The overlay auto-shrinks over-long text to fit; warn the operator that
      // the projector render will be smaller than the configured size.
      const windowedChars = windowed.join(' ').length;
      const fitHint = windowedChars > slideCharBudget() ? t('navigation.shrinksToFit', ' · ⚠ shrinks to fit') : '';
      verseInfoEl.textContent = window.HymnFlowI18n.getTranslation(i18nKey, {
        current: currentVerse + 1,
        total: currentHymn.verses.length,
        startLine: currentLineOffset + 1,
        endLine: Math.min(lines.length, currentLineOffset + settings.linesPerPage),
        totalLines: lines.length
      }) + isLastVerseLabel + chorusNext + fitHint;
    }

    renderVerseChips();
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
      if (!currentHymn) {
        // Nothing to show — resync the toggle so it can't sit ON while the
        // screen is empty, and tell the operator why nothing happened.
        isDisplaying = false;
        updateDisplayButton();
        statusEl.textContent = window.HymnFlowI18n
          ? window.HymnFlowI18n.getTranslation('display.noHymnSelected')
          : 'Nothing to display — select a hymn first';
        return;
      }

      const lines = getCurrentLines();
      const windowed = lines.slice(currentLineOffset, currentLineOffset + settings.linesPerPage);

      const payload = {
        type: 'show',
        v: 2,
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
      lastLive = null;
      updateRestoreButton();
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

    // At last content — advance to next service item if one exists. By default
    // the first press only arms the advance, so a stray extra tap during the
    // final verse can't swap the hymn on screen.
    if (currentService && currentServiceItemIndex >= 0 &&
        currentServiceItemIndex < currentService.items.length - 1) {
      if (settings.confirmItemAdvance !== false && Date.now() > advanceArmedUntil) {
        advanceArmedUntil = Date.now() + 4000;
        const nxt = currentService.items[currentServiceItemIndex + 1];
        notify(t('operator.pressAgain', 'Last verse — press Next again for {item}',
          { item: itemTypeBadge(nxt.type) + ' ' + itemDisplayLabel(nxt) }), 'info');
        return;
      }
      advanceArmedUntil = 0;
      nextServiceItem();
    }
  }

  function prevVerse() {
    if (!currentHymn) return;
    advanceArmedUntil = 0;

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
    sendOverlayTextSlide(text, { scripture: false });
    if (statusEl) statusEl.textContent = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('textSlide.sent') : 'Text slide sent';
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

  // Splits a reference like "John 3:16 (KJV)" into { reference, translation }.
  // Falls back to the active translation when the string has no "(...)" suffix.
  function splitReferenceTranslation(ref) {
    const m = (ref || '').match(/^(.*\S)\s*\(([^)]+)\)\s*$/);
    if (m) return { reference: m[1].trim(), translation: m[2].trim() };
    return {
      reference: (ref || '').trim(),
      translation: window.HymnFlowBibleLookup?.getActiveTranslation?.() || ''
    };
  }

  // Single writer for the text-slide channel. scriptureMode/reference/translation
  // are additive v2 fields; older overlays ignore them and render plain text.
  function sendOverlayTextSlide(text, { reference = '', translation = '', scripture = false } = {}) {
    try {
      const payload = {
        type: 'textslide',
        v: 2,
        title: reference || '',
        reference: scripture ? reference : '',
        translation: scripture ? translation : '',
        scriptureMode: !!scripture,
        lines: String(text).split('\n'),
        settings: getSettingsSnapshot(),
        timestamp: Date.now()
      };
      localStorage.setItem(storageKeys.textslide, JSON.stringify(payload));
    } catch (err) {
      console.error('[Overlay TextSlide Error]', err);
    }
  }

  function sendScriptureToOverlay(rawRef, text) {
    lastLive = null;
    updateRestoreButton();
    const { reference, translation } = splitReferenceTranslation(rawRef);
    sendOverlayTextSlide(text, { reference, translation, scripture: true });
  }

  // Approx. characters that read comfortably on one slide before the overlay
  // would have to shrink text toward illegibility. Larger fonts fit less, so
  // we scale the budget down as font size grows.
  function slideCharBudget() {
    const fs = settings.fontSize || 48;
    // ~520 chars at 48px, scaling inversely with font size; clamped to a sane range.
    return Math.max(180, Math.min(900, Math.round(520 * (48 / fs))));
  }

  // Splits a single over-long passage into multiple slides at word boundaries
  // so long verses paginate instead of being shrunk to an unreadable size.
  function paginateLongChunk(chunk, budget) {
    if (chunk.length <= budget) return [chunk];
    const words = chunk.split(/\s+/);
    const pages = [];
    let line = '';
    for (const w of words) {
      if (line && (line.length + 1 + w.length) > budget) {
        pages.push(line);
        line = w;
      } else {
        line = line ? `${line} ${w}` : w;
      }
    }
    if (line) pages.push(line);
    return pages;
  }

  // First honours operator-inserted blank lines, then auto-paginates any chunk
  // that is still too long for one readable slide.
  function parseScriptureChunks(text) {
    const blocks = text.split(/\n[ \t]*\n/).map(s => s.trim()).filter(Boolean);
    const budget = slideCharBudget();
    return blocks.flatMap(b => paginateLongChunk(b, budget));
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

  // Returns true when the reference resolved (used by auto-display).
  function qsLookup() {
    const refInput = document.getElementById('qsRef');
    const textArea = document.getElementById('qsText');
    const ref = (refInput?.value || '').trim();
    if (!ref) { refInput?.focus(); return false; }

    if (!window.HymnFlowBibleLookup?.isLoaded()) {
      if (statusEl) statusEl.textContent = 'Bible not loaded — import a translation in the Library tab';
      return false;
    }

    const result = window.HymnFlowBibleLookup.lookup(ref);
    if (result.found) {
      // Write back the bare reference (no "(KJV)" suffix) so re-searching or
      // editing the verse number in place still parses.
      if (refInput) refInput.value = splitReferenceTranslation(result.reference).reference;
      if (textArea) textArea.value = result.text;
      // Confidence preview: show a faithful render of the first page before the
      // operator pushes it live (also fires when activating a planned scripture item).
      const firstPage = parseScriptureChunks(result.text)[0] || result.text;
      previewScripture(result.reference, firstPage);
      if (statusEl) statusEl.textContent = result.verseCount > 1
        ? `Found ${result.verseCount} verses — press Display, then use ← → to step through`
        : `Found: ${result.reference} — press Display to send to overlay`;
      return true;
    } else {
      if (statusEl) statusEl.textContent = result.error;
      refInput?.select();
      return false;
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
    previewScripture(ref, qsChunks[0]);
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
    previewScripture(ref, qsChunks[qsChunkIdx]);
    updateQsControls();
  }

  function qsPrev() {
    if (qsChunkIdx <= 0) return;
    qsChunkIdx--;
    const ref = (document.getElementById('qsRef')?.value || '').trim();
    sendScriptureToOverlay(ref, qsChunks[qsChunkIdx]);
    previewScripture(ref, qsChunks[qsChunkIdx]);
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
      notify(msg);
      return;
    }
    isShowingChorus = true;
    currentLineOffset = 0;
    updatePreview();
    sendCommand('show');
  }

  // Calm "take the screen down" — hides both overlay channels but keeps the
  // current hymn, service position, and scripture pages so the operator can
  // resume instantly. Emergency Clear below is the full reset.
  function blankScreen() {
    captureLive();
    sendCommand('hide');
    _clearTextSlideOnly();
    statusEl.textContent = window.HymnFlowI18n
      ? window.HymnFlowI18n.getTranslation('display.blanked')
      : 'Screen blanked — Display or Quick Scripture will bring it back';
    offerRestore(t('operator.blanked', 'Screen blanked'));
  }

  function emergencyClear() {
    captureLive();
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
    offerRestore(t('operator.cleared', 'Screen cleared'));
  }

  function removeSelectedHymn() {
    if (!currentHymn) {
      const msg = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('hymns.alerts.noHymnSelected') : 'No hymn selected';
      notify(msg);
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
    askConfirm(confirmMsg, t('modal.buttons.delete', 'Delete')).then(ok => {
      if (!ok || !currentHymn) return;
      const before = captureState();
      const title = currentHymn.title;
      deleteHymn(currentHymn.id);
      offerUndo(t('operator.hymnDeleted', 'Deleted "{title}"', { title }), before);
    });
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
      notify(msg);
      return;
    }

    if (!versesText) {
      const msg = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('hymns.alerts.versesRequired') : 'At least one verse is required';
      notify(msg);
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
          notify(msg);
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
        notify(msg);
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
      quarantineCorrupt('services', stored);
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
            ${item.type === 'divider' ? '<span class="service-item-hint">screen goes dark</span>' : ''}
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
            <details class="service-more" onclick="event.stopPropagation()">
              <summary class="btn btn-secondary" title="More actions" aria-label="More actions for ${safeServiceName}">⋯</summary>
              <div class="service-more-menu">
                <button class="btn btn-secondary" onclick="this.closest('details').open = false; window.hymnflowDuplicateService('${service.id}')">Duplicate</button>
                <button class="btn btn-secondary" onclick="this.closest('details').open = false; window.hymnflowExportService('${service.id}')">Export .txt</button>
                <button class="btn btn-remove" onclick="this.closest('details').open = false; window.hymnflowDeleteService('${service.id}')">${window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('services.buttons.delete') : 'Delete'}</button>
              </div>
            </details>
          </div>
          ${isActive ? `<div class="service-hymns-list" role="list">${itemsHtml}</div>` : ''}
        </div>
      `;
    }).join('');
  }

  // ── Editor dirty state, draft persistence and layered closing ─────────────
  const SERVICE_DRAFT_KEY = 'hymnflow-service-draft';

  // Marks the editor dirty, reflects it on the Save button, and snapshots a
  // draft so a dock reload (OBS scene change, crash, F5) can't lose the edit.
  function markServiceDirty() {
    serviceEditorDirty = true;
    updateServiceSaveButton();
    saveServiceDraft();
  }

  function updateServiceSaveButton() {
    const btn = document.getElementById('btnSaveService');
    if (!btn) return;
    // Dot is CSS ::after so i18n text replacement can't wipe it
    btn.classList.toggle('dirty', serviceEditorDirty);
    btn.title = serviceEditorDirty ? 'You have unsaved changes' : '';
  }

  function saveServiceDraft() {
    try {
      if (!editingService) { sessionStorage.removeItem(SERVICE_DRAFT_KEY); return; }
      const nameInput = document.getElementById('serviceName');
      const snapshot = { ...editingService, name: nameInput ? nameInput.value : editingService.name };
      sessionStorage.setItem(SERVICE_DRAFT_KEY, JSON.stringify(snapshot));
    } catch (e) { /* storage full/unavailable — draft is best-effort */ }
  }

  function clearServiceDraft() {
    try { sessionStorage.removeItem(SERVICE_DRAFT_KEY); } catch (e) { /* ignore */ }
  }

  // Reopens an in-progress edit after a dock reload.
  function restoreServiceDraft() {
    let draft = null;
    try { draft = JSON.parse(sessionStorage.getItem(SERVICE_DRAFT_KEY)); } catch (e) { /* ignore */ }
    if (!draft || !Array.isArray(draft.items)) return;
    switchTab('service');
    openServiceEditor();
    editingService = draft;
    document.getElementById('serviceName').value = draft.name || '';
    renderServiceItems();
    markServiceDirty();
    statusEl.textContent = 'Restored unsaved service draft';
  }

  // Which "+ ..." button opened the item form, so focus can return to it.
  let itemFormTriggerId = null;

  function closeItemForm(returnFocus = true) {
    document.getElementById('itemForm').hidden = true;
    currentItemFormType = null;
    editingItemIndex = null;
    if (returnFocus && itemFormTriggerId) {
      document.getElementById(itemFormTriggerId)?.focus();
    }
    itemFormTriggerId = null;
  }

  function closeHymnPicker(returnFocus = true) {
    document.getElementById('hymnPicker').hidden = true;
    const btn = document.getElementById('btnAddToService');
    btn.setAttribute('aria-pressed', 'false');
    if (returnFocus) btn.focus();
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
      // Prefilled name saves a keystroke on the most common flow; kept
      // selected so typing replaces it instantly.
      const defaultName = `Service — ${new Date().toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}`;
      editingService = { id: generateUniqueServiceId(), name: defaultName, items: [] };
      nameInput.value = defaultName;
    }

    document.getElementById('hymnPicker').hidden = true;
    document.getElementById('itemForm').hidden = true;
    document.getElementById('btnAddToService').setAttribute('aria-pressed', 'false');
    currentItemFormType = null;
    editingItemIndex = null;
    serviceEditorDirty = false;
    updateServiceSaveButton();
    renderServiceItems();
    editor.style.display = 'block';
    setTimeout(() => {
      editor.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      if (!serviceId) { nameInput.focus(); nameInput.select(); }
    }, 0);
  }

  async function closeServiceEditor(force = false) {
    if (!force && serviceEditorDirty) {
      if (!(await askConfirm(t('modal.confirmations.discard', 'Discard unsaved changes?'), t('modal.buttons.discard', 'Discard')))) return;
    }
    document.getElementById('serviceEditor').style.display = 'none';
    document.getElementById('hymnPicker').hidden = true;
    document.getElementById('itemForm').hidden = true;
    document.getElementById('btnAddToService').setAttribute('aria-pressed', 'false');
    editingService = null;
    serviceEditorDirty = false;
    updateServiceSaveButton();
    clearServiceDraft();
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
              ${item.type === 'divider' ? '<div class="service-item-hint">screen goes dark here</div>' : ''}
              ${notesHtml}
            </div>
          </div>
          <div class="service-hymn-controls">
            <button class="btn btn-secondary" onclick="window.hymnflowEditServiceItem(${index})" title="${item.type === 'hymn' ? 'Edit cue notes' : 'Edit'}">✎</button>
            <button class="btn btn-secondary" onclick="window.hymnflowMoveServiceItem(${index}, -1)" ${index === 0 ? 'disabled' : ''} aria-label="Move up">↑</button>
            <button class="btn btn-secondary" onclick="window.hymnflowMoveServiceItem(${index}, 1)" ${index === editingService.items.length - 1 ? 'disabled' : ''} aria-label="Move down">↓</button>
            <button class="btn btn-remove" onclick="window.hymnflowRemoveServiceItem(${index})" aria-label="Remove">×</button>
          </div>
        </div>
      `;
    }).join('');
  }

  let pickerActiveIndex = -1;

  function renderHymnPicker(query) {
    const list = document.getElementById('hymnPickerList');
    if (!list) return;
    pickerActiveIndex = -1;
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
    const capped = results.length > 40;
    list.innerHTML = results.slice(0, 40).map(h => {
      const num = h.metadata?.number ? `${h.metadata.number} · ` : '';
      const title = escapeHtml(typeof h.title === 'string' ? h.title : String(h.title ?? ''));
      return `<div class="hymn-picker-item" onclick="window.hymnflowPickHymn('${escapeHtml(h.id)}')">${escapeHtml(num)}${title}</div>`;
    }).join('') + (capped ? `<div class="hymn-picker-cap">Showing 40 of ${results.length} — refine your search</div>` : '');
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
    itemFormTriggerId = { hymn: 'btnAddToService', scripture: 'btnAddScripture', announce: 'btnAddAnnounce', divider: 'btnAddDivider' }[type] || null;
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
    if (type === 'hymn') {
      // Hymns are edited only for their cue notes — the hymn itself is fixed.
      titleEl.textContent = `Cue Notes — ${existing ? itemDisplayLabel(existing) : ''}`;
      refRow.hidden = true;
      textRow.hidden = true;
      addBtn.textContent = t('services.itemForm.buttons.save', 'Save');
      setTimeout(() => notesInput?.focus(), 0);
    } else if (type === 'scripture') {
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
    document.getElementById('btnAddToService').setAttribute('aria-pressed', 'false');
    document.getElementById('itemForm').hidden = false;
  }

  function saveService() {
    const nameInput = document.getElementById('serviceName');
    const name = nameInput.value.trim();

    if (!name) {
      const msg = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('services.alerts.nameRequired') : 'Service name is required';
      notify(msg);
      return;
    }

    if (editingService.items.length === 0) {
      notify(window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('services.alerts.itemRequired') : 'Add at least one item to the service');
      return;
    }

    editingService.name = name;

    const { valid, errors } = window.HymnValidator.validateService(editingService, hymns);
    if (!valid) {
      const msg = window.HymnFlowI18n ? window.HymnFlowI18n.getTranslation('services.alerts.validationFailed', { errors: errors.join('\n') }) : 'Service validation failed:\n' + errors.join('\n');
      notify(msg);
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
        bannerNext.textContent = `Next: ${itemTypeBadge(nextItem.type)} ${itemDisplayLabel(nextItem)}` +
          (nextItem.type === 'divider' ? ' — screen goes dark' : '');
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
      const found = qsLookup();
      // Opt-in: rehearsed services can skip the confidence-preview step
      if (found && settings.scriptureAutoDisplay) displayQuickScripture();
    } else if (item.type === 'announce') {
      sendOverlayTextSlide(item.text || item.label || '', { scripture: false });
      statusEl.textContent = item.label || 'Announcement displayed';
    } else if (item.type === 'divider') {
      // A section divider takes the whole screen down — both channels — so
      // the last hymn verse doesn't linger through "— SERMON —".
      _clearTextSlideOnly();
      if (isDisplaying) sendCommand('hide');
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
    askConfirm(confirmMsg, t('modal.buttons.delete', 'Delete')).then(ok => {
      if (!ok) return;
      const before = captureState();
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
        offerUndo(t('operator.serviceDeleted', 'Deleted service "{name}"', { name: serviceToDelete.name }), before);
      }
    });
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

  // ── Service schedule text export / import ─────────────────────────────────
  // Format (round-trippable, hand-editable):
  //   Service: Sunday Morning
  //
  //   1. Hymn: 234 - Amazing Grace
  //      Notes: pianist starts soft
  //   2. Scripture: John 3:16-18
  //   3. Announce: Youth meeting Wednesday 5pm
  //      Bring your Bibles
  //   4. Divider: — SERMON —
  // Indented lines attach to the item above them (Notes: → cue notes;
  // anything else continues an announcement). "#" lines are comments.

  function serviceToText(service) {
    const lines = [`Service: ${service.name}`, ''];
    service.items.forEach((item, i) => {
      const n = `${i + 1}. `;
      if (item.type === 'hymn') {
        lines.push(`${n}Hymn: ${itemDisplayLabel(item)}`);
      } else if (item.type === 'announce') {
        const txt = (item.text || item.label || '').split('\n');
        lines.push(`${n}Announce: ${txt[0]}`);
        txt.slice(1).forEach(t => lines.push(`   ${t}`));
      } else {
        // scripture, divider — label carries the content
        lines.push(`${n}${itemTypeBadge(item.type)}: ${item.label || ''}`);
      }
      if (item.notes) {
        String(item.notes).split('\n').forEach(t => lines.push(`   Notes: ${t}`));
      }
    });
    return lines.join('\n') + '\n';
  }

  // Saves text to a user-chosen location via the native Save As dialog where
  // the browser supports it (Chromium/CEF, incl. OBS docks on recent OBS).
  // Falls back to a regular download into the Downloads folder elsewhere.
  // Returns { saved, cancelled, method, name, emptyFileAtPickedLocation }.
  async function saveTextFile(filename, text, mimeType = 'text/plain', extension = '.txt') {
    let emptyFileAtPickedLocation = false;
    if (typeof window.showSaveFilePicker === 'function') {
      let handle = null;
      try {
        handle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [{ description: 'HymnFlow export', accept: { [mimeType]: [extension] } }],
        });
      } catch (err) {
        if (err && err.name === 'AbortError') {
          return { saved: false, cancelled: true };
        }
        // Picker unavailable in this context (permissions, embedding) —
        // fall through to the classic download.
        console.warn('[Export] Save dialog unavailable, falling back to download:', err);
      }
      if (handle) {
        try {
          const writable = await handle.createWritable();
          await writable.write(new Blob([text], { type: mimeType }));
          await writable.close();
          // Some embedded browsers (OBS docks among them) show the dialog and
          // create the file but never commit the bytes, leaving a 0-byte
          // file. Read it back before trusting the save.
          let committed = true;
          try {
            const onDisk = await handle.getFile();
            committed = onDisk.size > 0 || text.length === 0;
          } catch (verifyErr) { /* can't verify — assume the write landed */ }
          if (committed) {
            return { saved: true, method: 'picker', name: handle.name };
          }
          console.warn('[Export] Save dialog committed 0 bytes — falling back to download');
          emptyFileAtPickedLocation = true;
        } catch (err) {
          console.warn('[Export] Save dialog write failed, falling back to download:', err);
          emptyFileAtPickedLocation = true;
        }
      }
    }
    const blob = new Blob([text], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    return { saved: true, method: 'download', name: filename, emptyFileAtPickedLocation };
  }

  // One consistent status line for both export paths.
  function exportStatusMessage(result) {
    if (result.cancelled) return 'Export cancelled';
    if (result.method === 'picker') return `Saved ${result.name}`;
    if (result.emptyFileAtPickedLocation) {
      return `This browser couldn't write to your chosen location (the file there is empty) — exported ${result.name} to your Downloads folder instead`;
    }
    return `Exported ${result.name} to your Downloads folder`;
  }

  async function exportServiceTxt(serviceId) {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;
    const slug = (service.name || 'service').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'service';
    const filename = `hymnflow-service-${slug}.txt`;
    const result = await saveTextFile(filename, serviceToText(service));
    statusEl.textContent = exportStatusMessage(result);
  }

  // Finds a hymn from "234 - Amazing Grace", "234" or "Amazing Grace".
  // Number match wins, then exact title, then title-contains.
  function resolveHymnFromText(content) {
    const m = content.match(/^(\d+)\s*[-–.]?\s*(.*)$/);
    if (m) {
      const byNum = hymns.find(x => String(x.metadata?.number ?? '') === m[1]);
      if (byNum) return byNum;
    }
    const title = ((m && m[2]) ? m[2] : content).trim().toLowerCase();
    if (!title) return null;
    return hymns.find(x => x.title.toLowerCase() === title)
        || hymns.find(x => x.title.toLowerCase().includes(title))
        || null;
  }

  function announceLabel(text) {
    return text.length > 35 ? text.substring(0, 35) + '…' : text;
  }

  // Parses schedule text into { name, items, warnings }.
  // Untyped lines are resolved as hymn → scripture reference → announcement.
  function parseServiceText(text, fallbackName) {
    let name = '';
    const items = [];
    const warnings = [];
    for (const raw of String(text).split(/\r?\n/)) {
      const line = raw.replace(/\s+$/, '');
      if (!line.trim() || /^\s*#/.test(line)) continue;

      // Indented lines belong to the previous item
      if (/^\s/.test(line) && items.length) {
        const prev = items[items.length - 1];
        const nm = line.trim().match(/^Notes:\s*(.*)$/i);
        if (nm) {
          prev.notes = prev.notes ? prev.notes + '\n' + nm[1] : nm[1];
        } else if (prev.type === 'announce') {
          prev.text += '\n' + line.trim();
          prev.label = announceLabel(prev.text);
        } else {
          prev.notes = prev.notes ? prev.notes + '\n' + line.trim() : line.trim();
        }
        continue;
      }

      const sm = line.match(/^Service:\s*(.*)$/i);
      if (sm) { name = sm[1].trim(); continue; }

      const im = line.trim().match(/^(?:\d+[.)]\s*)?(?:(Hymn|Scripture|Announce(?:ment)?|Divider)\s*:\s*)?(.+)$/i);
      if (!im) continue;
      const type = (im[1] || '').toLowerCase();
      const content = im[2].trim();

      if (type.startsWith('announce')) {
        items.push({ type: 'announce', label: announceLabel(content), text: content });
      } else if (type === 'scripture') {
        items.push({ type: 'scripture', label: content });
        if (window.HymnFlowBibleLookup?.isLoaded() && !window.HymnFlowBibleLookup.canParse(content)) {
          warnings.push(`Unrecognised scripture reference: "${content}"`);
        }
      } else if (type === 'divider') {
        items.push({ type: 'divider', label: content });
      } else if (type === 'hymn') {
        const h = resolveHymnFromText(content);
        if (h) items.push({ type: 'hymn', hymnId: h.id });
        else {
          items.push({ type: 'divider', label: `(hymn not in library) ${content}` });
          warnings.push(`Hymn not found in library: "${content}"`);
        }
      } else {
        // Untyped line: hymn → scripture → announcement
        const h = resolveHymnFromText(content);
        if (h) items.push({ type: 'hymn', hymnId: h.id });
        else if (window.HymnFlowBibleLookup?.isLoaded() && window.HymnFlowBibleLookup.canParse(content)) {
          items.push({ type: 'scripture', label: content });
        } else {
          items.push({ type: 'announce', label: announceLabel(content), text: content });
        }
      }
    }
    return { name: name || fallbackName, items, warnings };
  }

  function handleServiceImport(e) {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const fallback = file.name.replace(/\.txt$/i, '').replace(/^hymnflow-service-/i, '').replace(/[-_]+/g, ' ').trim() || 'Imported Service';
      const { name, items, warnings } = parseServiceText(ev.target.result, fallback);
      if (!items.length) {
        statusEl.textContent = 'Import failed: no service items found in file';
        return;
      }
      services.push({ id: generateUniqueServiceId(), name, items });
      saveServices();
      renderServicesList();
      statusEl.textContent = `Imported "${name}" — ${items.length} item${items.length !== 1 ? 's' : ''}${warnings.length ? `, ${warnings.length} warning${warnings.length !== 1 ? 's' : ''}` : ''}`;
      if (warnings.length) {
        console.warn('[Service Import]', warnings);
        notify('Service imported with warnings:\n\n' + warnings.join('\n'));
      }
    };
    reader.onerror = () => { statusEl.textContent = 'Could not read file'; };
    reader.readAsText(file);
  }

  // Global functions for onclick handlers
  window.hymnflowSelectService = selectService;
  window.hymnflowSelectItemFromService = selectItemFromService;
  window.hymnflowEditService = openServiceEditor;
  window.hymnflowDeleteService = deleteService;
  window.hymnflowDuplicateService = duplicateService;
  window.hymnflowExportService = exportServiceTxt;
  window.hymnflowPickHymn = (hymnId) => {
    if (!editingService) return;
    editingService.items.push({ type: 'hymn', hymnId });
    markServiceDirty();
    renderServiceItems();
    document.getElementById('hymnPickerSearch').value = '';
    closeHymnPicker();
  };
  window.hymnflowMoveServiceItem = (index, direction) => {
    if (!editingService) return;
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < editingService.items.length) {
      [editingService.items[index], editingService.items[newIndex]] = [editingService.items[newIndex], editingService.items[index]];
      markServiceDirty();
      renderServiceItems();
    }
  };
  window.hymnflowRemoveServiceItem = (index) => {
    if (!editingService) return;
    editingService.items.splice(index, 1);
    markServiceDirty();
    renderServiceItems();
  };
  window.hymnflowEditServiceItem = (index) => {
    if (!editingService) return;
    const item = editingService.items[index];
    if (!item) return;
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
        notify(msg);
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
    document.getElementById('btnBlank').onclick = blankScreen;
    document.getElementById('btnRestore').onclick = restoreLive;
    document.getElementById('btnShortcuts').onclick = showShortcuts;
    document.getElementById('hotkeyChip').onclick = () => {
      switchTab('style');
      const panel = document.getElementById('obsConnPanel');
      panel.open = true;
      panel.scrollIntoView({ block: 'center' });
    };
    document.getElementById('verseChips').onclick = (e) => {
      const chip = e.target.closest('.verse-chip');
      if (!chip) return;
      if (chip.dataset.verse === 'chorus') jumpToChorus();
      else jumpToVerse(parseInt(chip.dataset.verse, 10));
    };
    document.getElementById('btnBackupExport').onclick = exportBackup;
    document.getElementById('btnBackupImport').onclick = () => document.getElementById('backupFile').click();
    document.getElementById('backupFile').onchange = (e) => {
      const file = e.target.files[0];
      e.target.value = '';
      if (file) restoreFromFile(file);
    };
    document.getElementById('backupSlot').onchange = (e) => {
      document.getElementById('btnBackupRestoreAuto').disabled = !readSlot(e.target.value);
    };
    document.getElementById('btnBackupRestoreAuto').onclick = () => {
      restoreSnapshot(document.getElementById('backupSlot').value);
    };

    // Pulse the status bar whenever its message changes, so rapid successive
    // messages don't silently overwrite each other unnoticed.
    if (statusEl) {
      new MutationObserver(() => {
        statusEl.classList.remove('status-pulse');
        void statusEl.offsetWidth; // restart the CSS animation
        statusEl.classList.add('status-pulse');
      }).observe(statusEl, { childList: true, characterData: true, subtree: true });
    }
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

    // Scripture display customization. Changes re-push the current scripture
    // slide (if one is live) so the operator sees the effect immediately.
    function refreshScriptureDisplay() {
      if (!qsChunks.length) return;
      const ref = (document.getElementById('qsRef')?.value || '').trim();
      sendScriptureToOverlay(ref, qsChunks[qsChunkIdx]);
      previewScripture(ref, qsChunks[qsChunkIdx]);
    }
    document.getElementById('scriptureFontFamily').onchange = (e) => {
      settings.scriptureFontFamily = e.target.value;
      saveSettings();
      refreshScriptureDisplay();
    };
    document.getElementById('scriptureItalic').onchange = (e) => {
      settings.scriptureItalic = e.target.checked;
      saveSettings();
      refreshScriptureDisplay();
    };
    document.getElementById('scriptureShowReference').onchange = (e) => {
      settings.scriptureShowReference = e.target.checked;
      saveSettings();
      refreshScriptureDisplay();
    };
    document.getElementById('scriptureShowBadge').onchange = (e) => {
      settings.scriptureShowBadge = e.target.checked;
      saveSettings();
      refreshScriptureDisplay();
    };
    document.getElementById('scriptureCustomSize').onchange = (e) => {
      settings.scriptureCustomSize = e.target.checked;
      document.getElementById('scriptureSizeRow').style.display = e.target.checked ? '' : 'none';
      saveSettings();
      refreshScriptureDisplay();
    };
    document.getElementById('scriptureFontSize').oninput = (e) => {
      settings.scriptureFontSize = parseInt(e.target.value, 10);
      document.getElementById('scriptureFontSizeValue').textContent = settings.scriptureFontSize + 'px';
      saveSettings();
      refreshScriptureDisplay();
    };
    // The same setting is exposed in Style (full list) and Live (next to Display)
    ['scriptureAutoDisplay', 'qsAutoDisplay'].forEach(id => {
      document.getElementById(id).onchange = (e) => {
        settings.scriptureAutoDisplay = e.target.checked;
        document.getElementById('scriptureAutoDisplay').checked = e.target.checked;
        document.getElementById('qsAutoDisplay').checked = e.target.checked;
        saveSettings();
      };
    });
    document.getElementById('confirmItemAdvance').onchange = (e) => {
      settings.confirmItemAdvance = e.target.checked;
      saveSettings();
    };

    // Persist collapsible panel states so the Style tab reopens as the operator left it
    document.getElementById('scriptureStylePanel').addEventListener('toggle', (e) => {
      settings.scripturePanelOpen = e.target.open;
      saveSettings();
    });
    document.getElementById('textSlidePanel').addEventListener('toggle', (e) => {
      settings.textSlidePanelOpen = e.target.open;
      saveSettings();
    });
    document.getElementById('obsConnPanel').addEventListener('toggle', (e) => {
      settings.obsPanelOpen = e.target.open;
      saveSettings();
    });

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
    document.getElementById('btnImportService').onclick = () => document.getElementById('serviceFileInput').click();
    document.getElementById('serviceFileInput').addEventListener('change', handleServiceImport);
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
    document.getElementById('serviceName').oninput = () => { if (editingService) markServiceDirty(); };
    // Enter in the name field: save if the service has items, otherwise move on
    // to adding the first item.
    document.getElementById('serviceName').addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || !editingService) return;
      e.preventDefault();
      if (editingService.items.length > 0) saveService();
      else document.getElementById('btnAddToService').focus();
    });
    document.getElementById('btnHymnPickerCancel').onclick = () => closeHymnPicker();
    // Keyboard navigation in the hymn picker: ↑/↓ move, Enter selects
    document.getElementById('hymnPickerSearch').addEventListener('keydown', (e) => {
      const list = document.getElementById('hymnPickerList');
      const rows = [...list.querySelectorAll('.hymn-picker-item')];
      if (!rows.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        pickerActiveIndex = e.key === 'ArrowDown'
          ? Math.min(pickerActiveIndex + 1, rows.length - 1)
          : Math.max(pickerActiveIndex - 1, 0);
        rows.forEach((r, i) => r.classList.toggle('active', i === pickerActiveIndex));
        rows[pickerActiveIndex].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        (rows[pickerActiveIndex] || rows[0]).click();
      }
    });
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
    document.getElementById('btnItemFormAdd').onclick = async () => {
      if (!editingService) return;
      const ref = document.getElementById('itemFormRef').value.trim();
      const text = document.getElementById('itemFormText').value.trim();
      let newItem = null;
      if (currentItemFormType === 'scripture') {
        if (!ref) { document.getElementById('itemFormRef').focus(); return; }
        // Validate against loaded Bible — warn but allow saving if unrecognised
        if (window.HymnFlowBibleLookup?.isLoaded() && !window.HymnFlowBibleLookup.canParse(ref)) {
          const warn = t('modal.confirmations.badReference', `"${ref}" doesn't look like a valid Bible reference.\nAdd it anyway?`, { ref });
          if (!(await askConfirm(warn, t('modal.buttons.addAnyway', 'Add anyway')))) { document.getElementById('itemFormRef').focus(); return; }
        }
        newItem = { type: 'scripture', label: ref };
      } else if (currentItemFormType === 'announce') {
        if (!text) { document.getElementById('itemFormText').focus(); return; }
        const label = text.length > 35 ? text.substring(0, 35) + '…' : text;
        newItem = { type: 'announce', label, text };
      } else if (currentItemFormType === 'divider') {
        if (!ref) { document.getElementById('itemFormRef').focus(); return; }
        newItem = { type: 'divider', label: ref };
      } else if (currentItemFormType === 'hymn') {
        // Cue-notes-only edit: keep the hymn, replace the notes below
        if (editingItemIndex === null) return;
        newItem = { ...editingService.items[editingItemIndex] };
        delete newItem.notes;
      }
      if (!newItem) return;
      const notes = (document.getElementById('itemFormNotes')?.value || '').trim();
      if (notes) newItem.notes = notes;
      if (editingItemIndex !== null) {
        editingService.items[editingItemIndex] = newItem;
      } else {
        editingService.items.push(newItem);
      }
      markServiceDirty();
      renderServiceItems();
      closeItemForm();
    };
    document.getElementById('btnItemFormCancel').onclick = () => closeItemForm();
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
      markServiceDirty();
      renderServiceItems();
    });

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      // Escape closes the innermost open layer first: item form → hymn
      // picker → service editor (even from inside inputs).
      if (e.key === 'Escape') {
        const itemForm = document.getElementById('itemForm');
        const picker = document.getElementById('hymnPicker');
        const editor = document.getElementById('serviceEditor');
        if (itemForm && !itemForm.hidden) {
          e.preventDefault();
          closeItemForm();
          return;
        }
        if (picker && !picker.hidden) {
          e.preventDefault();
          closeHymnPicker();
          return;
        }
        if (editor && editor.style.display !== 'none') {
          e.preventDefault();
          closeServiceEditor();
          return;
        }
      }
      // Don't intercept navigation keys when typing in input/textarea/select,
      // while a dialog is open, or when a browser shortcut (Ctrl/Cmd/Alt) is used.
      const target = e.target;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable) {
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (document.querySelector('.confirm-overlay')) return;
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
      // Blank / chorus / clear / restore / verse jump / help
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === 'b') { e.preventDefault(); blankScreen(); }
      if (k === 'c') { e.preventDefault(); jumpToChorus(); }
      if (k === 'x') { e.preventDefault(); emergencyClear(); }
      if (k === 'z') { e.preventDefault(); restoreLive(); }
      if (k.length === 1 && k >= '1' && k <= '9') { e.preventDefault(); jumpToVerse(parseInt(k, 10) - 1); }
      if (e.key === '?') { e.preventDefault(); showShortcuts(); }
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

  // First-run convenience: if no Bible is loaded yet, seed the bundled default
  // (KJV) into IndexedDB by dynamically loading its JS global. file:// blocks
  // fetch(), so a <script> injection is the only offline-safe way to read it.
  // Once a seed succeeds we set a flag so a deliberately-emptied library stays
  // empty; a missing bundle file (e.g. a code-only install) is a silent no-op.
  function seedDefaultBibleIfEmpty() {
    return new Promise(resolve => {
      if (!window.HymnFlowBibleLookup || window.HymnFlowBibleLookup.isLoaded()) return resolve(false);
      if (localStorage.getItem('hymnflow-bible-seeded')) return resolve(false);
      const script = document.createElement('script');
      script.src = '../data/bible-kjv.js?v=2.9.0';
      script.onload = () => {
        const seed = window.HymnFlowBible;
        if (!seed) return resolve(false);
        window.HymnFlowBibleLookup.importParsed(seed, 'KJV').then(res => {
          try { delete window.HymnFlowBible; } catch (e) { window.HymnFlowBible = undefined; }
          if (res && res.ok) {
            try { localStorage.setItem('hymnflow-bible-seeded', '1'); } catch (e) { /* ignore */ }
            if (statusEl) statusEl.textContent = 'KJV loaded — ready for scripture lookup';
          }
          resolve(!!(res && res.ok));
        });
      };
      script.onerror = () => resolve(false); // no bundled Bible present — fine
      document.head.appendChild(script);
    });
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

  async function handleExport() {
    const result = await saveTextFile('hymnflow-export.json',
      JSON.stringify(hymns, null, 2), 'application/json', '.json');
    statusEl.textContent = exportStatusMessage(result);
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

    // Scripture display customization
    document.getElementById('scriptureFontFamily').value = settings.scriptureFontFamily || 'serif';
    document.getElementById('scriptureItalic').checked = settings.scriptureItalic !== false;
    document.getElementById('scriptureShowReference').checked = settings.scriptureShowReference !== false;
    document.getElementById('scriptureShowBadge').checked = settings.scriptureShowBadge !== false;
    document.getElementById('scriptureCustomSize').checked = !!settings.scriptureCustomSize;
    document.getElementById('scriptureAutoDisplay').checked = !!settings.scriptureAutoDisplay;
    document.getElementById('qsAutoDisplay').checked = !!settings.scriptureAutoDisplay;
    document.getElementById('confirmItemAdvance').checked = settings.confirmItemAdvance !== false;
    const qsSize = typeof settings.scriptureFontSize === 'number' ? settings.scriptureFontSize : 44;
    settings.scriptureFontSize = Math.max(24, Math.min(96, qsSize));
    document.getElementById('scriptureFontSize').value = settings.scriptureFontSize;
    document.getElementById('scriptureFontSizeValue').textContent = settings.scriptureFontSize + 'px';
    document.getElementById('scriptureSizeRow').style.display = settings.scriptureCustomSize ? '' : 'none';

    // Collapsible panel states
    document.getElementById('scriptureStylePanel').open = !!settings.scripturePanelOpen;
    document.getElementById('obsConnPanel').open = !!settings.obsPanelOpen;
    document.getElementById('textSlidePanel').open = !!settings.textSlidePanelOpen;
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
  snapshotData();   // before anything migrates or normalises stored data
  loadHymns();
  loadSettings();
  if (settings.obsWsEnabled) obsWsConnect();
  loadServices();
  refreshBackupSlots();
  updateRestoreButton();
  if (window.HymnFlowBibleLookup) {
    window.HymnFlowBibleLookup.restoreFromStorage()
      .then(() => seedDefaultBibleIfEmpty())
      .then(() => {
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
  restoreServiceDraft();
  setupLanguageSelector();
  if (window.HymnFlowI18n) {
    statusEl.textContent = window.HymnFlowI18n.getTranslation('app.status.ready', { storage: 'localStorage' });
  } else {
    statusEl.textContent = 'Ready (localStorage)';
  }
})();
