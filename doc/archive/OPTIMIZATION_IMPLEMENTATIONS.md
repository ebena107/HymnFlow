# HymnFlow - Optimization Implementation Guide

Quick-reference code snippets for implementing the recommended optimizations.

---

## 1. HIGH PRIORITY: Data Validation Module

**File:** `public/validation.js` (NEW FILE)

```javascript
/**
 * HymnFlow Data Validation
 * Ensures data integrity across import, edit, and service operations
 */

const HymnValidator = {
  /**
   * Validate complete hymn object
   * @param {Object} hymn - Hymn to validate
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validateHymn(hymn) {
    const errors = [];

    // ID validation
    if (!hymn.id || typeof hymn.id !== 'string' || !hymn.id.startsWith('hymn_')) {
      errors.push('Invalid or missing hymn ID');
    }

    // Title validation
    if (!hymn.title || typeof hymn.title !== 'string' || !hymn.title.trim()) {
      errors.push('Title is required and must be non-empty');
    }

    // Author validation
    if (hymn.author !== undefined && typeof hymn.author !== 'string') {
      errors.push('Author must be a string');
    }

    // Verses validation (CRITICAL)
    if (!Array.isArray(hymn.verses)) {
      errors.push('Verses must be an array');
    } else if (hymn.verses.length === 0) {
      errors.push('At least one verse is required');
    } else {
      hymn.verses.forEach((verse, idx) => {
        if (typeof verse !== 'string') {
          errors.push(`Verse ${idx + 1} is not a string`);
        } else if (!verse.trim()) {
          errors.push(`Verse ${idx + 1} is empty`);
        }
      });
    }

    // Chorus validation (optional)
    if (hymn.chorus !== undefined && typeof hymn.chorus !== 'string') {
      errors.push('Chorus must be a string');
    }

    // Metadata validation (optional)
    if (hymn.metadata !== undefined) {
      if (typeof hymn.metadata !== 'object' || Array.isArray(hymn.metadata)) {
        errors.push('Metadata must be an object');
      } else if (hymn.metadata.number !== undefined) {
        if (typeof hymn.metadata.number !== 'number' || hymn.metadata.number < 0) {
          errors.push('Hymn number must be a positive integer');
        }
      }
    }

    // createdAt validation (optional)
    if (hymn.createdAt !== undefined && isNaN(Date.parse(hymn.createdAt))) {
      errors.push('Invalid createdAt timestamp');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  /**
   * Validate service object
   * @param {Object} service - Service to validate
   * @param {Array} allHymns - All available hymns (for reference checking)
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validateService(service, allHymns = []) {
    const errors = [];

    if (!service.id || typeof service.id !== 'string') {
      errors.push('Service ID is invalid');
    }

    if (!service.name || typeof service.name !== 'string' || !service.name.trim()) {
      errors.push('Service name is required');
    }

    if (!Array.isArray(service.hymns) || service.hymns.length === 0) {
      errors.push('Service must contain at least one hymn');
    } else if (allHymns.length > 0) {
      // Verify all hymn IDs exist
      service.hymns.forEach((hymnId, idx) => {
        const found = allHymns.find(h => h.id === hymnId);
        if (!found) {
          errors.push(`Hymn at position ${idx + 1} (ID: ${hymnId}) not found in library`);
        }
      });
    }

    if (service.date !== undefined && isNaN(Date.parse(service.date))) {
      errors.push('Invalid service date');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  /**
   * Sanitize and fix common hymn issues
   * @param {Object} hymn - Hymn to sanitize
   * @returns {Object} Sanitized hymn
   */
  sanitizeHymn(hymn) {
    const sanitized = { ...hymn };

    // Trim strings
    if (sanitized.title) sanitized.title = sanitized.title.trim();
    if (sanitized.author) sanitized.author = sanitized.author.trim();
    if (sanitized.chorus) sanitized.chorus = sanitized.chorus.trim();

    // Clean verses (remove empty ones, trim lines)
    if (Array.isArray(sanitized.verses)) {
      sanitized.verses = sanitized.verses
        .map(v => v.trim())
        .filter(v => v.length > 0);
    }

    return sanitized;
  }
};

// Export for use in obs-dock.js
// window.HymnValidator = HymnValidator;
```

**Usage in `obs-dock.js`:**
```javascript
async function handleImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const ext = file.name.split('.').pop().toLowerCase();
    let parsed = [];
    
    if (ext === 'txt') parsed = await parseTxt(file);
    else if (ext === 'json') parsed = await parseJson(file);
    else if (ext === 'csv') parsed = await parseCsv(file);
    else throw new Error('Use .txt, .csv, or .json');

    // VALIDATE ALL HYMNS
    let imported = 0;
    let skipped = 0;

    parsed.forEach((h, idx) => {
      // Sanitize first
      const sanitized = HymnValidator.sanitizeHymn(h);
      
      // Then validate
      const { valid, errors } = HymnValidator.validateHymn(sanitized);
      
      if (!valid) {
        console.warn(`Skipping invalid hymn at row ${idx + 1}:`, errors);
        skipped++;
        return; // Skip this hymn
      }

      // Generate unique ID
      sanitized.id = `hymn_${Date.now()}_${generateRandomId()}_${idx}`;
      sanitized.createdAt = new Date().toISOString();
      
      hymns.push(sanitized);
      imported++;
    });

    saveHymns();
    filtered = hymns;
    renderList();
    setStatus(`Imported ${imported} hymns${skipped > 0 ? ` (${skipped} skipped due to errors)` : ''}`);
  } catch (err) {
    setStatus('Import failed: ' + err.message);
  } finally {
    e.target.value = '';
  }
}

// Add unique ID generator
function generateRandomId() {
  return Math.random().toString(36).substring(2, 10);
}
```

---

## 2. HIGH PRIORITY: Improved ID Generation

**Add to `obs-dock.js`:**

```javascript
// ID generation with collision prevention
const IdGenerator = (() => {
  let lastTimestamp = 0;
  let sameTimeCounter = 0;

  return {
    generate(prefix = 'hymn') {
      const now = Date.now();
      
      if (now === lastTimestamp) {
        sameTimeCounter++;
      } else {
        lastTimestamp = now;
        sameTimeCounter = 0;
      }

      const randomPart = Math.random().toString(36).substring(2, 10);
      return `${prefix}_${now}_${sameTimeCounter}_${randomPart}`;
    },

    // For services
    generateServiceId() {
      return this.generate('service');
    },

    // For hymns
    generateHymnId() {
      return this.generate('hymn');
    }
  };
})();

// Usage
const newHymn = {
  id: IdGenerator.generateHymnId(),
  title,
  author,
  verses,
  chorus,
  metadata: {},
  createdAt: new Date().toISOString()
};
```

---

## 3. MEDIUM PRIORITY: Optimized Search with Debouncing

**Replace search event listener in `obs-dock.js`:**

```javascript
// Search optimization with debounce
const SearchEngine = (() => {
  let searchIndex = [];
  let searchTimeout = null;

  return {
    // Build index once on load (O(n) time)
    buildIndex(hymnArray) {
      searchIndex = hymnArray.map((h, idx) => ({
        idx,
        titleLower: h.title.toLowerCase(),
        authorLower: (h.author || '').toLowerCase(),
        number: h.metadata?.number || 0
      }));
    },

    // Search with debounce (fast feedback)
    search(query, hymnArray, debounceMs = 150) {
      return new Promise((resolve) => {
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
          if (!query.trim()) {
            resolve(hymnArray); // No filter
            return;
          }

          const q = query.toLowerCase();
          const results = hymnArray.filter((h, idx) => {
            if (idx >= searchIndex.length) return false;
            
            const idx_entry = searchIndex[idx];
            
            // Search in indexed fields
            return (
              idx_entry.titleLower.includes(q) ||
              idx_entry.authorLower.includes(q) ||
              (q.length > 1 && idx_entry.number.toString().includes(q))
            );
          });

          resolve(results);
        }, debounceMs);
      });
    },

    // Rebuild on data change
    invalidate() {
      clearTimeout(searchTimeout);
    }
  };
})();

// Initialize
SearchEngine.buildIndex(hymns);

// Replace in attachEvents()
searchEl.addEventListener('input', async (e) => {
  const results = await SearchEngine.search(e.target.value, hymns);
  filtered = results;
  renderList();
});

// Call invalidate when hymns change
function saveHymns() {
  localStorage.setItem(storageKeys.hymns, JSON.stringify(hymns));
  SearchEngine.buildIndex(hymns);
}
```

---

## 4. MEDIUM PRIORITY: Optimized List Rendering

**Replace `renderList()` function:**

```javascript
function renderList() {
  if (!filtered.length) {
    listEl.innerHTML = '<div class="list-item no-results">No hymns found</div>';
    return;
  }

  // Build HTML string (avoid repeated DOM operations)
  const html = filtered.map(h => {
    const hymnNumber = h.metadata?.number ? `${h.metadata.number} - ` : '';
    const isActive = currentHymn && currentHymn.id === h.id ? ' active' : '';
    
    // Sanitize to prevent XSS
    const safeTitle = escapeHtml(hymnNumber + h.title);
    const safeAuthor = escapeHtml(h.author || 'Unknown');
    
    return `
      <div class="list-item${isActive}" data-id="${h.id}" role="option" aria-selected="${isActive ? 'true' : 'false'}">
        <div class="title">${safeTitle}</div>
        <div class="meta">${safeAuthor} • ${h.verses.length} verse(s)</div>
      </div>`;
  }).join('');

  listEl.innerHTML = html;
}

// HTML escape utility (XSS prevention)
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```

---

## 5. HIGH PRIORITY: XSS Prevention

**Add utility function to `obs-dock.js`:**

```javascript
/**
 * Prevent XSS by escaping HTML special characters
 * @param {string} text - User input text
 * @returns {string} Safe HTML
 */
function sanitizeContent(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return (text || '').replace(/[&<>"']/g, (char) => map[char]);
}

// Or use native method:
function escapeHtml(unsafe) {
  const div = document.createElement('div');
  div.textContent = unsafe;
  return div.innerHTML;
}
```

**Usage in all rendering functions:**
```javascript
// BEFORE: XSS vulnerability
return `<div class="title">${h.title}</div>`;

// AFTER: Safe
return `<div class="title">${escapeHtml(h.title)}</div>`;
```

---

## 6. MEDIUM PRIORITY: Settings Real-Time Update

**Modify settings change handlers in `attachEvents()`:**

```javascript
document.getElementById('linesPerPage').oninput = (e) => {
  settings.linesPerPage = parseInt(e.target.value, 10);
  
  // Update UI value display
  const sliderValue = e.target.parentElement.querySelector('.slider-value');
  if (sliderValue) sliderValue.textContent = settings.linesPerPage;
  
  saveSettings();
  updatePreview();
  
  // AUTO-UPDATE OVERLAY IF DISPLAYING
  if (isDisplaying && currentHymn) {
    sendCommand('show');
  }
};

// Apply same pattern to all style settings
document.getElementById('fontSize').oninput = (e) => {
  settings.fontSize = parseInt(e.target.value, 10);
  fontSizeValueEl.textContent = settings.fontSize + 'px';
  saveSettings();
  
  if (isDisplaying && currentHymn) {
    sendCommand('show'); // Push updated styles
  }
};

// For all toggle settings
document.getElementById('bold').onchange = (e) => {
  settings.bold = e.target.checked;
  saveSettings();
  
  if (isDisplaying && currentHymn) {
    sendCommand('show');
  }
};
```

---

## 7. MEDIUM PRIORITY: Accessibility Enhancements

**Update HTML in `public/obs-dock/index.html`:**

```html
<!-- Search input with label -->
<label for="search" class="sr-only">Search hymns by title or author</label>
<input id="search" type="text" class="search-input" placeholder="Search hymns"
       aria-label="Search hymns by title or author">

<!-- Icon buttons with labels -->
<button id="btnAdd" class="btn btn-add" aria-label="Add new hymn" title="Add new hymn">+ Add</button>
<button id="btnEdit" class="btn btn-secondary" aria-label="Edit selected hymn" title="Edit selected hymn">✏️ Edit</button>
<button id="btnRemove" class="btn btn-remove" aria-label="Remove selected hymn" title="Remove selected hymn">- Remove</button>

<!-- Status with live region -->
<div role="status" aria-live="polite" aria-atomic="true" id="status" class="status-live">LIVE</div>

<!-- Service list as proper list -->
<ul id="servicesList" class="services-list" role="listbox"></ul>

<!-- Add CSS for screen readers -->
<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
```

---

## 8. MEDIUM PRIORITY: Overlay Style Caching

**Update `overlay.js`:**

```javascript
let lastAppliedSettings = null;

function show(data) {
  const { title, verseNumber, totalVerses, lines, settings } = data;
  const hymnNumber = data.metadata?.number ? `${data.metadata.number} • ` : '';

  // Only apply styles if changed (performance optimization)
  const settingsChanged = !lastAppliedSettings || 
    JSON.stringify(lastAppliedSettings) !== JSON.stringify(settings);

  if (settingsChanged) {
    applyStyles(settings);
    lastAppliedSettings = { ...settings };
  }

  titleBarEl.textContent = `${hymnNumber}${title} • Verse ${verseNumber}/${totalVerses}`;

  const displayText = Array.isArray(lines) ? lines.join('\n') : String(lines);
  contentEl.textContent = displayText;

  overlayEl.classList.remove('hidden', 'fade-out', 'slide-out');
  overlayEl.classList.add('visible');

  if (settings.animation === 'fade') {
    overlayEl.classList.add('fade-in');
  } else if (settings.animation === 'slide') {
    overlayEl.classList.add('slide-in');
  }
  isVisible = true;
}
```

---

## 9. LOW PRIORITY: Status Message Helper

**Add to `obs-dock.js`:**

```javascript
// Better status message management
const StatusManager = (() => {
  let timeout = null;

  return {
    setStatus(message, duration = 3000) {
      statusEl.textContent = message;
      
      // Clear existing timeout
      if (timeout) clearTimeout(timeout);
      
      // Auto-reset after duration
      timeout = setTimeout(() => {
        statusEl.textContent = 'Ready (localStorage)';
      }, duration);
    },

    clearStatus() {
      if (timeout) clearTimeout(timeout);
      statusEl.textContent = 'Ready (localStorage)';
    },

    // Variants
    success(msg, duration) {
      this.setStatus('✓ ' + msg, duration);
    },

    error(msg, duration) {
      this.setStatus('✗ ' + msg, duration || 5000);
    },

    warning(msg, duration) {
      this.setStatus('⚠ ' + msg, duration);
    }
  };
})();

// Usage
StatusManager.success(`Imported ${parsed.length} hymns`);
StatusManager.error('Import failed: invalid format');
StatusManager.warning('Service deleted');
```

---

## 10. CSV Parser Fix - Handle Empty Verses

**Replace in `public/parsers/csvParser.js`:**

```javascript
async function parseCsv(file) {
  // ... existing parsing code ...

  const hymnsMap = new Map();

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);

    if (values.length < headers.length) continue;

    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    const title = row.title || `Hymn ${i}`;

    if (!hymnsMap.has(title)) {
      hymnsMap.set(title, {
        title: title,
        author: row.author || '',
        verses: [],
        chorus: row.chorus || '',
        metadata: {}
      });
    }

    const hymn = hymnsMap.get(title);
    
    // FIX: Only add non-empty verses
    const verseText = (row['verse text'] || row.text || row.verse || '').trim();
    if (verseText) {
      hymn.verses.push(verseText);
    }
    
    if (row.chorus && !hymn.chorus) {
      hymn.chorus = row.chorus;
    }
  }

  // Filter out hymns with no verses
  const validHymns = Array.from(hymnsMap.values()).filter(h => {
    if (h.verses.length === 0) {
      console.warn(`Skipping CSV hymn "${h.title}": no verses found`);
      return false;
    }
    return true;
  });

  return validHymns;
}
```

---

## Integration Checklist

- [ ] Add `validation.js` to `public/` and include in HTML
- [ ] Add `IdGenerator` module to `obs-dock.js`
- [ ] Add `SearchEngine` module to `obs-dock.js`
- [ ] Add `StatusManager` module to `obs-dock.js`
- [ ] Update search event listener with debounce
- [ ] Update `renderList()` with sanitization
- [ ] Update all style setting handlers to auto-update overlay
- [ ] Add accessibility attributes to HTML
- [ ] Fix CSV parser to skip empty verses
- [ ] Add XSS escape function
- [ ] Update overlay.js with style caching
- [ ] Test with 500+ hymns
- [ ] Test with rapid imports
- [ ] Test keyboard navigation
- [ ] Test screen reader (VoiceOver/NVDA)

