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
  let services = [];
  let currentService = null;
  let editingService = null;

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
    animation: 'fade',
    position: 'bottom'
  };

  const storageKeys = {
    hymns: 'hymnflow-hymns',
    cmd: 'hymnflow-lowerthird-command',
    prefs: 'hymnflow-dock-settings',
    services: 'hymnflow-services'
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

  function openEditModal(hymn) {
    const modal = document.getElementById('editModal');
    const modalTitle = document.getElementById('modalTitle');
    
    if (hymn) {
      // Edit existing hymn
      modalTitle.textContent = 'Edit Hymn';
      document.getElementById('editNumber').value = hymn.metadata?.number || '';
      document.getElementById('editTitle').value = hymn.title;
      document.getElementById('editAuthor').value = hymn.author || '';
      document.getElementById('editVerses').value = hymn.verses.join('\n\n');
      document.getElementById('editChorus').value = hymn.chorus || '';
      modal.dataset.hymnId = hymn.id;
    } else {
      // Add new hymn
      modalTitle.textContent = 'Add New Hymn';
      document.getElementById('editNumber').value = '';
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
    const title = document.getElementById('editTitle').value.trim();
    const author = document.getElementById('editAuthor').value.trim();
    const versesText = document.getElementById('editVerses').value.trim();
    const chorus = document.getElementById('editChorus').value.trim();

    if (!title) {
      alert('Title is required');
      return;
    }

    if (!versesText) {
      alert('At least one verse is required');
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
        if (number) {
          hymn.metadata = hymn.metadata || {};
          hymn.metadata.number = parseInt(number, 10);
        } else if (hymn.metadata) {
          delete hymn.metadata.number;
        }
      }
    } else {
      // Add new hymn
      const newHymn = {
        id: `hymn_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
        title,
        author,
        verses,
        chorus,
        metadata: number ? { number: parseInt(number, 10) } : {},
        createdAt: new Date().toISOString()
      };
      hymns.push(newHymn);
    }

    saveHymns();
    filtered = hymns;
    renderList();
    updatePreview();
    closeEditModal();
    statusEl.textContent = hymnId ? 'Hymn updated' : 'Hymn added';
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

  function loadServices() {
    const stored = localStorage.getItem(storageKeys.services);
    services = stored ? JSON.parse(stored) : [];
  }

  function saveServices() {
    localStorage.setItem(storageKeys.services, JSON.stringify(services));
  }

  function renderServicesList() {
    const listEl = document.getElementById('servicesList');
    if (services.length === 0) {
      listEl.innerHTML = '<div class="service-item" style="justify-content: center; color: var(--text-muted);">No services created</div>';
      return;
    }
    listEl.innerHTML = services.map(service => `
      <div class="service-item${currentService && currentService.id === service.id ? ' active' : ''}">
        <div class="service-item-info">
          <div class="service-item-name">${service.name}</div>
          <div class="service-item-count">${service.hymns.length} hymn(s)</div>
        </div>
        <div class="service-item-actions">
          <button class="btn btn-secondary" onclick="window.hymnflowSelectService('${service.id}')">Load</button>
          <button class="btn btn-secondary" onclick="window.hymnflowEditService('${service.id}')">Edit</button>
          <button class="btn btn-remove" onclick="window.hymnflowDeleteService('${service.id}')">Del</button>
        </div>
      </div>
    `).join('');
  }

  function openServiceEditor(serviceId = null) {
    const editor = document.getElementById('serviceEditor');
    const nameInput = document.getElementById('serviceName');
    const hymnsContainer = document.getElementById('serviceHymns');
    
    if (serviceId) {
      editingService = services.find(s => s.id === serviceId);
      nameInput.value = editingService.name;
    } else {
      editingService = { id: `srv_${Date.now()}`, name: '', hymns: [] };
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
      container.innerHTML = '<div style="padding: 12px; text-align: center; color: var(--text-muted); font-size: 12px;">No hymns added yet</div>';
      return;
    }
    container.innerHTML = editingService.hymns.map((hymnId, index) => {
      const hymn = hymns.find(h => h.id === hymnId);
      if (!hymn) return '';
      const number = hymn.metadata?.number ? `${hymn.metadata.number} - ` : '';
      return `
        <div class="service-hymn-item">
          <div class="service-hymn-item-info">
            <div class="service-hymn-number">#${index + 1}</div>
            <div class="service-hymn-title">${number}${hymn.title}</div>
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
      alert('Service name is required');
      return;
    }
    
    if (editingService.hymns.length === 0) {
      alert('Add at least one hymn to the service');
      return;
    }
    
    editingService.name = name;
    
    const existingIndex = services.findIndex(s => s.id === editingService.id);
    if (existingIndex >= 0) {
      services[existingIndex] = editingService;
    } else {
      services.push(editingService);
    }
    
    saveServices();
    renderServicesList();
    closeServiceEditor();
    statusEl.textContent = 'Service saved';
  }

  function selectService(serviceId) {
    currentService = services.find(s => s.id === serviceId);
    if (currentService) {
      // Load first hymn from service
      const hymnId = currentService.hymns[0];
      const hymn = hymns.find(h => h.id === hymnId);
      if (hymn) {
        selectHymn(hymn.id);
        statusEl.textContent = `Loaded service: ${currentService.name}`;
      }
    }
    renderServicesList();
  }

  function deleteService(serviceId) {
    if (confirm('Delete this service?')) {
      services = services.filter(s => s.id !== serviceId);
      if (currentService && currentService.id === serviceId) {
        currentService = null;
      }
      saveServices();
      renderServicesList();
      statusEl.textContent = 'Service deleted';
    }
  }

  // Global functions for onclick handlers
  window.hymnflowSelectService = selectService;
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

    document.getElementById('btnAdd').onclick = () => openEditModal();
    document.getElementById('btnEdit').onclick = () => {
      if (!currentHymn) {
        alert('No hymn selected to edit');
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
    };

    document.getElementById('fontFamily').onchange = (e) => { settings.fontFamily = e.target.value; saveSettings(); };
    document.getElementById('fontSize').oninput = (e) => { settings.fontSize = parseInt(e.target.value,10); fontSizeValueEl.textContent = settings.fontSize + 'px'; saveSettings(); };
    document.getElementById('bold').onchange = (e) => { settings.bold = e.target.checked; saveSettings(); };
    document.getElementById('italic').onchange = (e) => { settings.italic = e.target.checked; saveSettings(); };
    document.getElementById('shadow').onchange = (e) => { settings.shadow = e.target.checked; saveSettings(); };
    document.getElementById('glow').onchange = (e) => { settings.glow = e.target.checked; saveSettings(); };
    document.getElementById('outline').onchange = (e) => { 
      settings.outline = e.target.checked; 
      document.getElementById('outlineControls').style.display = e.target.checked ? 'block' : 'none';
      saveSettings(); 
    };
    document.getElementById('outlineColor').oninput = (e) => { settings.outlineColor = e.target.value; saveSettings(); };
    document.getElementById('outlineWidth').oninput = (e) => { 
      settings.outlineWidth = parseInt(e.target.value, 10); 
      document.getElementById('outlineWidthValue').textContent = settings.outlineWidth + 'px';
      saveSettings(); 
    };
    document.getElementById('textColor').oninput = (e) => { settings.textColor = e.target.value; saveSettings(); };
    document.getElementById('bgType').onchange = (e) => { settings.bgType = e.target.value; saveSettings(); };
    document.getElementById('bgColorA').oninput = (e) => { settings.bgColorA = e.target.value; saveSettings(); };
    document.getElementById('bgColorB').oninput = (e) => { settings.bgColorB = e.target.value; saveSettings(); };
    document.getElementById('animation').onchange = (e) => { settings.animation = e.target.value; saveSettings(); };
    document.getElementById('position').onchange = (e) => { settings.position = e.target.value; saveSettings(); };

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

    // Service controls
    document.getElementById('btnNewService').onclick = () => openServiceEditor();
    document.getElementById('btnAddToService').onclick = () => {
      if (!currentHymn) {
        alert('Select a hymn first');
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
    document.getElementById('outline').checked = settings.outline;
    document.getElementById('outlineColor').value = settings.outlineColor;
    document.getElementById('outlineWidth').value = settings.outlineWidth;
    document.getElementById('outlineWidthValue').textContent = settings.outlineWidth + 'px';
    document.getElementById('outlineControls').style.display = settings.outline ? 'block' : 'none';
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
  loadServices();
  renderList();
  renderServicesList();
  attachEvents();
  statusEl.textContent = 'Ready (localStorage)';
})();
