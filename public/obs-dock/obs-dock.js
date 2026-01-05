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

  const settings = {
    linesPerPage: 2,
    fontFamily: "Inter, sans-serif",
    fontSize: 48,
    bold: false,
    italic: false,
    shadow: false,
    glow: false,
    textColor: '#ffffff',
    bgType: 'transparent',
    bgColorA: '#000000',
    bgColorB: '#2b2b2b',
    animation: 'fade',
    position: 'bottom'
  };

  const storageKeys = {
    hymns: 'hymnflow-hymns',
    cmd: 'hymnflow-lowerthird-command',
    prefs: 'hymnflow-dock-settings'
  };

  function loadHymns() {
    const stored = localStorage.getItem(storageKeys.hymns);
    if (stored) {
      hymns = JSON.parse(stored);
    } else {
      hymns = DEFAULT_HYMNS || [];
      localStorage.setItem(storageKeys.hymns, JSON.stringify(hymns));
    }
    filtered = hymns;
  }

  function saveHymns() {
    localStorage.setItem(storageKeys.hymns, JSON.stringify(hymns));
  }

  function loadSettings() {
    const stored = localStorage.getItem(storageKeys.prefs);
    if (stored) Object.assign(settings, JSON.parse(stored));
    applySettingsUI();
  }

  function saveSettings() {
    localStorage.setItem(storageKeys.prefs, JSON.stringify(settings));
  }

  function renderList() {
    if (!filtered.length) {
      listEl.innerHTML = '<div class="list-item">No hymns found</div>';
      return;
    }
    listEl.innerHTML = filtered.map(h => {
      const hymnNumber = h.metadata?.number ? `${h.metadata.number} - ` : '';
      return `
      <div class="list-item${currentHymn && currentHymn.id === h.id ? ' active' : ''}" data-id="${h.id}">
        <div class="title">${hymnNumber}${h.title}</div>
        <div class="meta">${h.author || 'Unknown'} • ${h.verses.length} verse(s)</div>
      </div>`;
    }).join('');
  }

  function selectHymn(id) {
    currentHymn = hymns.find(h => h.id === id);
    currentVerse = 0;
    currentLineOffset = 0;
    updatePreview();
    renderList();
    sendCommand('show'); // Auto-display when hymn is selected
  }

  function updatePreview() {
    if (!currentHymn) {
      currentTitleEl.textContent = 'No hymn selected';
      verseInfoEl.textContent = '-';
      previewEl.textContent = '';
      return;
    }
    currentTitleEl.textContent = currentHymn.title;
    const verseText = currentHymn.verses[currentVerse] || '';
    const lines = verseText.split('\n');
    const windowed = lines.slice(currentLineOffset, currentLineOffset + settings.linesPerPage);
    previewEl.textContent = windowed.join('\n');
    verseInfoEl.textContent = `Verse ${currentVerse + 1}/${currentHymn.verses.length} · Lines ${currentLineOffset + 1}-${Math.min(lines.length, currentLineOffset + settings.linesPerPage)} of ${lines.length}`;
  }

  function sendCommand(type) {
    if (type === 'hide') {
      localStorage.setItem(storageKeys.cmd, JSON.stringify({ type: 'hide', timestamp: Date.now() }));
      isDisplaying = false;
      updateDisplayButton();
      return;
    }
    if (!currentHymn) return;
    const verseText = currentHymn.verses[currentVerse] || '';
    const lines = verseText.split('\n');
    const windowed = lines.slice(currentLineOffset, currentLineOffset + settings.linesPerPage);
    
    console.log('[Dock] Sending command:', { 
      title: currentHymn.title, 
      verseNumber: currentVerse + 1,
      lines: windowed,
      linesPerPage: settings.linesPerPage,
      currentLineOffset
    });
    
    const payload = {
      type: 'show',
      hymnId: currentHymn.id,
      title: currentHymn.title,
      author: currentHymn.author,
      metadata: currentHymn.metadata || {},
      verseNumber: currentVerse + 1,
      totalVerses: currentHymn.verses.length,
      lines: windowed,
      settings: { ...settings },
      timestamp: Date.now()
    };
    localStorage.setItem(storageKeys.cmd, JSON.stringify(payload));
    isDisplaying = true;
    updateDisplayButton();
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
  }

  function nextVerse() {
    if (!currentHymn) return;
    if (currentVerse < currentHymn.verses.length - 1) {
      currentVerse++;
      currentLineOffset = 0;
      updatePreview();
      sendCommand('show'); // Auto-update overlay
    }
  }

  function prevVerse() {
    if (!currentHymn) return;
    if (currentVerse > 0) {
      currentVerse--;
      currentLineOffset = 0;
      updatePreview();
      sendCommand('show'); // Auto-update overlay
    }
  }

  function nextLineWindow() {
    if (!currentHymn) return;
    const lines = currentHymn.verses[currentVerse].split('\n');
    if (currentLineOffset + settings.linesPerPage < lines.length) {
      currentLineOffset += settings.linesPerPage;
      updatePreview();
      sendCommand('show'); // Auto-update overlay
    } else if (currentVerse < currentHymn.verses.length - 1) {
      // At end of verse, advance to next verse
      currentVerse++;
      currentLineOffset = 0;
      updatePreview();
      sendCommand('show'); // Auto-update overlay
    }
  }

  function prevLineWindow() {
    if (!currentHymn) return;
    if (currentLineOffset - settings.linesPerPage >= 0) {
      currentLineOffset -= settings.linesPerPage;
      updatePreview();
      sendCommand('show'); // Auto-update overlay
    } else if (currentLineOffset === 0 && currentVerse > 0) {
      // At beginning of verse, go to previous verse (last line window)
      currentVerse--;
      const prevLines = currentHymn.verses[currentVerse].split('\n');
      // Position at last complete window of previous verse
      currentLineOffset = Math.max(0, prevLines.length - settings.linesPerPage);
      updatePreview();
      sendCommand('show'); // Auto-update overlay
    } else {
      currentLineOffset = 0;
      updatePreview();
      sendCommand('show'); // Auto-update overlay
    }
  }

  function resetPosition() {
    currentLineOffset = 0;
    currentVerse = 0;
    updatePreview();
  }

  function jumpToChorus() {
    if (!currentHymn || !currentHymn.chorus) {
      alert('No chorus available for this hymn');
      return;
    }
    // In the future, we can implement chorus display
    alert('Chorus: ' + currentHymn.chorus);
  }

  function emergencyClear() {
    sendCommand('hide');
    currentHymn = null;
    currentVerse = 0;
    currentLineOffset = 0;
    updatePreview();
    renderList();
  }

  function removeSelectedHymn() {
    if (!currentHymn) {
      alert('No hymn selected');
      return;
    }
    if (confirm('Delete "' + currentHymn.title + '"?')) {
      deleteHymn(currentHymn.id);
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
        id: `hymn_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
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
    saveHymns();
    filtered = hymns;
    renderList();
    updatePreview();
  }

  function attachEvents() {
    searchEl.addEventListener('input', () => {
      const q = searchEl.value.toLowerCase();
      filtered = hymns.filter(h => 
        h.title.toLowerCase().includes(q) || 
        (h.author || '').toLowerCase().includes(q) ||
        (h.id || '').toLowerCase().includes(q) ||
        (h.metadata?.number?.toString() || '').includes(q)
      );
      renderList();
    });

    listEl.addEventListener('click', (e) => {
      const item = e.target.closest('.list-item');
      if (!item) return;
      selectHymn(item.dataset.id);
    });

    document.getElementById('btnAdd').onclick = () => addHymnDialog();
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
    };

    document.getElementById('fontFamily').onchange = (e) => { settings.fontFamily = e.target.value; saveSettings(); };
    document.getElementById('fontSize').oninput = (e) => { settings.fontSize = parseInt(e.target.value,10); fontSizeValueEl.textContent = settings.fontSize + 'px'; saveSettings(); };
    document.getElementById('bold').onchange = (e) => { settings.bold = e.target.checked; saveSettings(); };
    document.getElementById('italic').onchange = (e) => { settings.italic = e.target.checked; saveSettings(); };
    document.getElementById('shadow').onchange = (e) => { settings.shadow = e.target.checked; saveSettings(); };
    document.getElementById('glow').onchange = (e) => { settings.glow = e.target.checked; saveSettings(); };
    document.getElementById('textColor').oninput = (e) => { settings.textColor = e.target.value; saveSettings(); };
    document.getElementById('bgType').onchange = (e) => { settings.bgType = e.target.value; saveSettings(); };
    document.getElementById('bgColorA').oninput = (e) => { settings.bgColorA = e.target.value; saveSettings(); };
    document.getElementById('bgColorB').oninput = (e) => { settings.bgColorB = e.target.value; saveSettings(); };
    document.getElementById('animation').onchange = (e) => { settings.animation = e.target.value; saveSettings(); };
    document.getElementById('position').onchange = (e) => { settings.position = e.target.value; saveSettings(); };

    document.getElementById('btnImport').onclick = () => document.getElementById('fileInput').click();
    document.getElementById('fileInput').onchange = handleImport;
    document.getElementById('btnExport').onclick = handleExport;

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
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
      else if (ext === 'json') parsed = await parseJson(file);
      else throw new Error('Use .txt or .json');
      parsed.forEach(h => {
        h.id = `hymn_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
        h.createdAt = new Date().toISOString();
      });
      hymns = [...hymns, ...parsed];
      saveHymns();
      filtered = hymns;
      renderList();
      statusEl.textContent = `Imported ${parsed.length} hymns`;
    } catch (err) {
      statusEl.textContent = 'Import failed: ' + err.message;
    } finally {
      e.target.value = '';
    }
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(hymns, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hymnview-export.json';
    a.click();
    URL.revokeObjectURL(url);
    statusEl.textContent = 'Exported hymns.json';
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
    document.getElementById('textColor').value = settings.textColor;
    document.getElementById('bgType').value = settings.bgType;
    document.getElementById('bgColorA').value = settings.bgColorA;
    document.getElementById('bgColorB').value = settings.bgColorB;
    document.getElementById('animation').value = settings.animation;
    document.getElementById('position').value = settings.position;
  }

  // Initialize
  loadHymns();
  loadSettings();
  renderList();
  attachEvents();
  statusEl.textContent = 'Ready (localStorage)';
})();
