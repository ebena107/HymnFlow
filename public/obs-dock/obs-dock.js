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
    filtered = hymns;
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

  function renderList() {
    if (!filtered.length) {
      listEl.innerHTML = '<div class="list-item">No hymns found</div>';
      return;
    }
    listEl.innerHTML = filtered.map(h => {
      // Build hymn reference (sourceAbbr + number, or just number)
      const sourceAbbr = h.metadata?.sourceAbbr || '';
      const number = h.metadata?.number || '';
      let hymnRef = '';
      if (sourceAbbr && number) {
        hymnRef = `${sourceAbbr} ${number} - `;
      } else if (number) {
        hymnRef = `${number} - `;
      }
      const safeTitle = escapeHtml(hymnRef + h.title);
      const safeAuthor = escapeHtml(h.author || 'Unknown');
      const isActive = currentHymn && currentHymn.id === h.id ? ' active' : '';
      return `
      <div class="list-item${isActive}" data-id="${h.id}" role="option" aria-selected="${isActive ? 'true' : 'false'}">
        <div class="title">${safeTitle}</div>
        <div class="meta">${safeAuthor} • ${h.verses.length} verse(s)</div>
      </div>`;
    }).join('');
  }

  function selectHymn(id) {
    currentHymn = hymns.find(h => h.id === id);
    currentVerse = 0;
    currentLineOffset = 0;
    isShowingChorus = false;
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
    currentTitleEl.textContent = currentHymn.title;

    let lines = [];
    let label = '';

    if (isShowingChorus && currentHymn.chorus) {
      lines = currentHymn.chorus.split('\n');
      label = `Chorus · Lines ${currentLineOffset + 1}-${Math.min(lines.length, currentLineOffset + settings.linesPerPage)} of ${lines.length}`;
    } else {
      const verseText = currentHymn.verses[currentVerse] || '';
      lines = verseText.split('\n');
      label = `Verse ${currentVerse + 1}/${currentHymn.verses.length} · Lines ${currentLineOffset + 1}-${Math.min(lines.length, currentLineOffset + settings.linesPerPage)} of ${lines.length}`;
    }

    const windowed = lines.slice(currentLineOffset, currentLineOffset + settings.linesPerPage);
    previewEl.textContent = windowed.join('\n');
    verseInfoEl.textContent = label;
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
      statusEl.textContent = 'Error sending to overlay: ' + err.message;
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

  function resetPosition() {
    currentLineOffset = 0;
    currentVerse = 0;
    isShowingChorus = false;
    updatePreview();
  }

  function jumpToChorus() {
    if (!currentHymn || !currentHymn.chorus) {
      alert('No chorus available for this hymn');
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

        // Update metadata
        hymn.metadata = hymn.metadata || {};

        if (number) {
          hymn.metadata.number = parseInt(number, 10);
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
          alert('Hymn validation failed:\n' + errors.join('\n'));
          return;
        }
      }
    } else {
      // Add new hymn
      const metadata = {};
      if (number) metadata.number = parseInt(number, 10);
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
        alert('Hymn validation failed:\n' + errors.join('\n'));
        return;
      }

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
    saveHymns();
    filtered = hymns;
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
      statusEl.textContent = 'Error saving services: ' + err.message;
    }
  }

  function renderServicesList() {
    const listEl = document.getElementById('servicesList');
    if (services.length === 0) {
      listEl.innerHTML = '<div class="service-item" style="justify-content: center; color: var(--text-muted);">No services created</div>';
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
            <div class="service-item-count">${service.hymns.length} hymn(s)</div>
          </div>
          <div class="service-item-actions">
            <button class="btn btn-secondary" onclick="event.stopPropagation(); window.hymnflowSelectService('${service.id}')">Load</button>
            <button class="btn btn-secondary" onclick="event.stopPropagation(); window.hymnflowEditService('${service.id}')">Edit</button>
            <button class="btn btn-remove" onclick="event.stopPropagation(); window.hymnflowDeleteService('${service.id}')">Del</button>
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
      container.innerHTML = '<div style="padding: 12px; text-align: center; color: var(--text-muted); font-size: 12px;">No hymns added yet</div>';
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
      alert('Service name is required');
      return;
    }

    if (editingService.hymns.length === 0) {
      alert('Add at least one hymn to the service');
      return;
    }

    editingService.name = name;

    // Validate service structure before saving
    const { valid, errors } = window.HymnValidator.validateService(editingService, hymns);
    if (!valid) {
      alert('Service validation failed:\n' + errors.join('\n'));
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
    statusEl.textContent = 'Service saved';
  }

  function selectService(serviceId) {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      // Validate service before loading
      const { valid, errors } = window.HymnValidator.validateService(service, hymns);
      if (!valid) {
        console.warn('[Service Validation] Issues loading service:', errors);
        statusEl.textContent = 'Warning: Service has validation issues';
      }
      currentService = service;
      statusEl.textContent = `Loaded service: ${currentService.name} (${currentService.hymns.length} hymns)`;
    }
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
    if (confirm('Delete this service?')) {
      const serviceToDelete = services.find(s => s.id === serviceId);
      if (serviceToDelete) {
        services = services.filter(s => s.id !== serviceId);
        if (currentService && currentService.id === serviceId) {
          currentService = null;
        }
        saveServices();
        renderServicesList();
        statusEl.textContent = 'Service deleted';
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
      const results = await performSearch(e.target.value);
      filtered = results;
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
        if (!h.id) h.id = generateUniqueHymnId();
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

      hymns = [...hymns, ...valid];
      saveHymns();
      filtered = hymns;
      renderList();

      const message = `Imported ${valid.length} hymn${valid.length !== 1 ? 's' : ''}${invalid.length > 0 ? ` (${invalid.length} skipped due to errors)` : ''}`;
      statusEl.textContent = message;
    } catch (err) {
      statusEl.textContent = 'Import failed: ' + err.message;
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
    document.getElementById('animation').value = settings.animation;
    document.getElementById('position').value = settings.position;
  }

  // Initialize
  loadHymns();
  loadSettings();
  loadServices();
  buildSearchIndex();
  renderList();
  renderServicesList();
  attachEvents();
  statusEl.textContent = 'Ready (localStorage)';
})();
