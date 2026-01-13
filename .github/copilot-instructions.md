# HymnFlow Copilot Instructions

## Project Overview

HymnFlow is a **browser-based OBS Studio plugin** for displaying hymns during worship services. No backend server required - everything runs in the browser.

### Architecture

- **OBS Dock** (`public/obs-dock/`): Control panel for managing hymns, navigation, and styling (vanilla JS)
- **OBS Overlay** (`public/obs-overlay/`): Lower-third display for OBS browser source (vanilla JS)
- **Communication**: localStorage + storage events (cross-window messaging)
- **Data Storage**: Browser localStorage (~5-10MB capacity)
- **Zero dependencies**: Pure vanilla JavaScript, no build step, no npm packages

## Architecture

### Browser-Based Design

Two independent browser windows communicate via localStorage storage events:

```text
┌─────────────────────┐         ┌──────────────────────┐
│   OBS Dock          │         │   OBS Overlay        │
│   (Control)         │         │   (Display)          │
└──────────┬──────────┘         └──────────┬───────────┘
           │                               │
           │    localStorage.setItem()     │
           └──────────────┬────────────────┘
                          │
              'hymnflow-lowerthird-command'
                          │
           ┌──────────────┴────────────────┐
           │                               │
    storage event fires          overlay listens
           │                               │
    (dock writes data)          (overlay reads & displays)
```

**Critical insight:** `storage` events only fire in OTHER windows/tabs from the same origin, not the window that wrote the data. This is a feature, not a bug - perfect for control → display pattern with no polling needed.

## Key Conventions

### Data Structures

**Hymn Object:**
```javascript
{
  id: "hymn_${Date.now()}_${random}",  // Unique ID - never change once set
  title: string,
  author: string,
  verses: string[],              // Array of verse text (\n for line breaks)
  chorus: string,                // Optional
  metadata: { 
    number: number,              // Optional: Hymn number (e.g., 123) - searchable, displayed in UI
    category: string,            // Reserved: Category (e.g., "Gospel", "Praise", "Worship") - stored in data files
    key: string,                 // Reserved: Musical key (e.g., "G", "Bb") - in data files
    tempo: string                // Reserved: Tempo marking (e.g., "Moderate") - in data files
  },
  createdAt: ISO8601 timestamp
}
```

**Notes on metadata:**
- `number` is the only actively used field - it's displayed in hymn lists and searchable
- `category`, `key`, `tempo` are stored in default data files but not displayed or edited in UI (reserved for future use)
- New metadata fields can be added without breaking existing functionality - they'll be preserved but unused

**Service Object (Setlist):**
```javascript
{
  id: "service_${Date.now()}_${random}",
  name: string,                  // Service name (e.g., "Sunday Morning")
  hymns: string[],               // Ordered array of hymn IDs
  createdAt: ISO8601 timestamp
}
```

### localStorage Keys

- `hymnflow-hymns`: Array of all hymn objects
- `hymnflow-lowerthird-command`: Current command from dock to overlay (with timestamp)
- `hymnflow-dock-settings`: OBS dock customization settings (font, color, animation, position)  
  _(stored in code as `storageKeys.prefs`)_
- `hymnflow-services`: Array of service objects (setlists) with ordered hymn IDs

**Note:** Legacy keys `hymnview-*` and `hymnViewSettings` may exist from older versions but are no longer used.

**Implementation pattern in code:**
```javascript
// Always use storageKeys object in obs-dock.js
const storageKeys = {
  hymns: 'hymnflow-hymns',
  cmd: 'hymnflow-lowerthird-command',
  prefs: 'hymnflow-dock-settings',
  services: 'hymnflow-services'
};
```

### Message Protocol

Commands written to `hymnflow-lowerthird-command`:
- `show`: Display hymn with verses/lines (auto-sent on navigation)
  - Includes: `hymnId`, `title`, `author`, `verseNumber`, `totalVerses`, `lines[]`, `settings`, `timestamp`
- `hide`: Hide overlay
  - Includes: `timestamp` (and optionally `settings` for animation)

**Auto-update behavior:** Navigation functions (`selectHymn`, `nextVerse`, `prevVerse`, `nextLineWindow`, `prevLineWindow`) automatically call `sendCommand('show')`, providing seamless real-time updates without manual button presses.

### File Parsers (Client-Side)

Three parsers in `public/parsers/`: `txtParser.js`, `csvParser.js`, `jsonParser.js`. Each exports async function accepting a File object and returning an array of hymn objects. All parsed hymns go through `HymnValidator.validateHymn()` before import.

**TXT format**:
- `Title:` starts a new hymn
- `Author:` is optional
- Empty lines separate verses
- `Chorus:` marks optional chorus text
- Example: See [../public/parsers/txtParser.js](../public/parsers/txtParser.js) for full implementation

**CSV format**:
- Expected columns: `Title`, `Author`, `Verse Number`, `Verse Text`, `Chorus`, `Hymn Number`, `Source Abbr`, `Source`
- Multiple rows with same title are combined into one hymn with multiple verses
- Quote fields containing commas: `"Title","Author",1,"Verse\nwith\nlines",""`
- Validates Title/Name column exists; skips malformed rows with warnings
- See [../public/parsers/csvParser.js](../public/parsers/csvParser.js) for implementation

**JSON format**: Array of hymn objects matching the hymn schema (see [../public/data/hymns-data.js](../public/data/hymns-data.js) and [../public/data/hymns.json](../public/data/hymns.json) for examples)

**Adding a new parser**: 
1. Create file in `public/parsers/` (e.g., `xmlParser.js`)
2. Export async `parseXml(file)` function that returns array of hymn objects
3. Add handler to `handleImport()` switch statement in [../public/obs-dock/obs-dock.js](../public/obs-dock/obs-dock.js)
4. Update file input accept attribute in [../public/obs-dock/index.html](../public/obs-dock/index.html) if needed

### Data Validation

All hymn imports, edits, and service operations validate against schema using `HymnValidator` module in [../public/validation.js](../public/validation.js):

**Core validators:**
- `validateHymn(hymn)` - Returns `{valid, errors[]}`, checks: id format, required title, verses (non-empty), optional metadata
- `validateService(service, allHymns)` - Validates service/setlist structure and hymn references
- `sanitizeHymn(hymn)` - Removes invalid fields, cleans whitespace, ensures schema compliance

**Usage in dock:**
```javascript
const { valid, errors } = HymnValidator.validateHymn(hymnObject);
if (!valid) {
  alert('Hymn validation failed:\n' + errors.join('\n'));
  return;
}
```

**Critical:** Validators prevent corrupted data from entering localStorage. Always call before `saveHymns()` or `saveServices()`.

### Client-Side Data Operations
All data operations use localStorage - no backend server needed:

```javascript
// Load hymns
const hymns = JSON.parse(localStorage.getItem('hymnflow-hymns') || '[]');

// Save hymns
localStorage.setItem('hymnflow-hymns', JSON.stringify(hymns));

// Send command to display
localStorage.setItem('hymnflow-lowerthird-command', JSON.stringify({
  type: 'show',
  hymnId: hymn.id,
  title: hymn.title,
  lines: [...],
  settings: {...},
  timestamp: Date.now()  // Important: forces storage event
}));

// OBS dock navigation (auto-updates overlay)
function nextVerse() {
  currentVerse++;
  updatePreview();
  sendCommand('show');  // Auto-send to overlay
}

// Smart line navigation (auto-advances between verses)
function nextLineWindow() {
  const lines = currentHymn.verses[currentVerse].split('\n');
  if (currentLineOffset + linesPerPage < lines.length) {
    currentLineOffset += linesPerPage;
  } else if (currentVerse < currentHymn.verses.length - 1) {
    // At end of verse, advance to next verse automatically
    currentVerse++;
    currentLineOffset = 0;
  }
  updatePreview();
  sendCommand('show');
}
```

**Critical:** Always include `timestamp` in commands to force storage event even if data is identical.

## Development Workflow

### Running HymnFlow

```bash
# Option 1: Python simple server (recommended)
cd public
python -m http.server 8000
# Open http://localhost:8000/obs-dock/ and http://localhost:8000/obs-overlay/

# Option 2: npm script (uses Python internally)
npm run serve

# Option 3: VS Code Live Server
# Right-click public/obs-dock/index.html → "Open with Live Server"

# Option 4: Direct file:// access (OBS Custom Dock)
# Use file:///C:/HymnFlow/public/obs-dock/index.html
```

**Note:** file:// protocol works for both OBS Custom Dock and Browser Source. No web server required for basic functionality, but http:// may provide better debugging tools.

**Import/Export Formats:**
- Import from: `.txt`, `.csv`, or `.json` files
- Export to: `.json` format (filename: `hymnflow-export.json`)
- CSV parser auto-combines rows by title into multi-verse hymns
- Import validates all data and shows summary of accepted/rejected entries

### Bulk Hymnal Processing

Three hymnal collections included: NNBH (Baptist), UMH (Methodist), FWS (Faith We Sing):
- Hymn text files in `hymn texts/` directory (organized by collection)
- Transformed JSON data in `public/data/`: `nnbh.json`, `umh.json`, `fws.json`, `ybh.json`

**Scripts in `scripts/`:**
- `transform-all-hymnals.js` - Converts all hymnal text files to HymnFlow JSON format (requires Node.js)
- `validate-hymnals.js` - Validates transformed data integrity
- `transform-ybh.js` - Specialized processor for Yoruba Hymn Book

**Processing workflow:**
```bash
# Install Node.js if needed, then:
node scripts/transform-all-hymnals.js
# Outputs: public/data/{nnbh,umh,fws}.json

# Validate results:
node scripts/validate-hymnals.js
```

**Output files:** Each transformed hymnal is a JSON array of hymn objects with metadata (number, category, key, tempo).

### Testing in OBS

- Browser Source URL: `file:///C:/HymnFlow/public/obs-overlay/index.html` OR `http://localhost:8000/obs-overlay/`
- Custom Dock URL: `file:///C:/HymnFlow/public/obs-dock/index.html` OR `http://localhost:8000/obs-dock/`

**Testing workflow:**
1. Add OBS Custom Dock (View → Docks → Custom Browser Docks) with dock URL
2. Add Browser Source in a scene with overlay URL (1920x1080, transparent background)
3. Open dock, select a hymn - overlay should update automatically via localStorage events
4. Use arrow keys to navigate - verify overlay updates in real-time
5. Check browser console (F12) in both windows for debugging

### File Structure

```text
public/
├── data/
│   └── hymns-data.js       # Embedded default hymns
├── parsers/                # Client-side file parsers
│   ├── txtParser.js
│   ├── csvParser.js
│   └── jsonParser.js
├── obs-dock/               # OBS custom dock control (vanilla JS)
│   ├── index.html
│   ├── obs-dock.css
│   └── obs-dock.js
└── obs-overlay/            # OBS lower-third overlay (vanilla JS)
    ├── index.html
    ├── overlay.css
    └── overlay.js
```

**All frontend code is vanilla JavaScript** - no frameworks, no build step.

### Release Workflow

```bash
# Windows
scripts\release.bat

# Unix/Mac/Linux
bash scripts/release.sh

# Manual steps (if scripts don't work):
# 1. Update version in package.json
# 2. Create hymnflow-vX.Y.Z/ directory
# 3. Copy: obs-dock/, obs-overlay/, data/, parsers/, README.md, SETUP.md, TROUBLESHOOTING.md, SECURITY.md
# 4. Create ZIP: hymnflow-vX.Y.Z-plugin.zip
# 5. Git tag: git tag vX.Y.Z && git push --tags
# 6. Create GitHub release with ZIP attachment
```

**Versioning:** Follows semantic versioning (major.minor.patch). Version is single source of truth in `package.json`.

**Release artifacts:** `hymnflow-vX.Y.Z/` directory and `hymnflow-vX.Y.Z-plugin.zip` are committed to the repo for easy access (unconventional but intentional).

**What the script does:**
1. Reads version from package.json
2. Creates `hymnflow-vX.Y.Z/` directory structure
3. Copies source files from `public/` to release directory
4. Creates ZIP archive using PowerShell's Compress-Archive
5. Prompts for git tag creation and push

### Adding New Features

1. **New command type**: Add to dock's `sendCommand()`, handle in overlay's storage event listener
2. **New hymn field**: Update hymn schema in `hymns-data.js`, parsers, and UI
3. **New file format**: Create parser in `public/parsers/`, add to `handleImport()` in obs-dock.js
4. **Data export/import**: Use localStorage get/set with JSON stringify/parse
5. **New styling option**: Add to settings object, update UI in dock, apply in overlay
6. **Service (setlist) feature**: Services are stored separately in `hymnflow-services` key, contain ordered hymn IDs

### Services (Setlists) Workflow

Services allow users to create ordered playlists of hymns for a worship service. Full CRUD operations available:

```javascript
// Service data structure
{
  id: "service_${Date.now()}_${random}",
  name: string,                  // e.g., "Sunday Morning Service"
  hymns: string[]               // Array of hymn IDs in order
}

// Key functions in obs-dock.js
loadServices()           // Load all services from localStorage
saveServices()           // Persist services to localStorage
selectService(id)        // Load service and track as "current"
selectHymnFromService()  // Select individual hymn from service (preserves service context)
openServiceEditor()      // Open editor modal to create/edit service
saveService()            // Save edited service (validates name and hymns required)
deleteService(id)        // Remove service after confirmation
moveServiceHymn(idx, dir) // Reorder hymns within service (up/down)
```

**UI Flow:**
1. Click "+ New" → `openServiceEditor()` → Editor modal opens
2. Enter service name → Click "+ Add Hymn" to add currently selected hymn → Hymns appear as numbered list
3. Use ↑/↓ buttons to reorder hymns within service
4. Click "Save Service" → Service stored in localStorage → Appears in Services list
5. Click service in list → `selectService()` → Service marked "active" and hymns shown
6. Click hymn in service → `selectHymnFromService()` → Hymn displays, service remains context

**Critical Implementation Details:**
- Services store hymn references: lookup by ID from main hymns array when rendering
- If a hymn is deleted, it's silently skipped when loading service (orphaned reference)
- IDs are immutable: changing a hymn's ID breaks all service references
- Service structure is minimal (just IDs + metadata) to conserve localStorage space
- Services are independent from current hymn selection - can switch between normal and service contexts
- When rendering service hymns, fetch full hymn object by ID from the main hymns array

### Styling

- Overlay uses inline styles for OBS compatibility
- Settings stored in localStorage and applied dynamically
- All styling controlled from dock interface
- Responsive design for vertical displays

## Project-Specific Gotchas

- **Storage events don't fire in same window**: Dock writes to localStorage, overlay receives storage event. This is by design and perfect for the architecture.
- **localStorage limit**: ~5-10MB (sufficient for thousands of hymns)
- **Same origin required**: Both windows must be from same domain/port or same file:// directory
- **Timestamp in commands**: Always include `timestamp: Date.now()` to force storage event trigger even if data is identical
- **Hymn IDs immutable**: Changing IDs breaks references in services (setlists)
- **Verse line breaks**: Use `\n` in verse strings for multiline text
- **No validation**: Parsers don't validate required fields - add try/catch if extending
- **Default hymns**: `public/data/hymns-data.js` defines `DEFAULT_HYMNS` array loaded on first run if localStorage is empty
- **Release artifacts committed**: Version directories and ZIPs are intentionally committed to repo (not .gitignored) for easy distribution

## Key Files & Their Roles

| File | Purpose | Key Functions |
|------|---------|---------------|
| [../public/obs-dock/obs-dock.js](../public/obs-dock/obs-dock.js) | Control panel logic | `sendCommand()`, `selectHymn()`, `nextVerse()`, `nextLineWindow()`, `loadServices()` |
| [../public/obs-overlay/overlay.js](../public/obs-overlay/overlay.js) | Display overlay logic | `show()`, `hide()`, `applyStyles()`, storage event listener |
| [../public/validation.js](../public/validation.js) | Data validation module | `HymnValidator.validateHymn()`, `validateService()`, `sanitizeHymn()` |
| [../public/parsers](../public/parsers) | File format parsers | `parseTxt()`, `parseCsv()`, `parseJson()` - all async, accept File object |
| [../public/data/hymns-data.js](../public/data/hymns-data.js) | Default hymn library | `DEFAULT_HYMNS` array (embedded in HTML via script tag) |
| [../public/obs-setup.html](../public/obs-setup.html) | Interactive setup guide | Step-by-step OBS configuration instructions |
| [../scripts/release.bat](../scripts/release.bat) | Windows release script | Packages plugin for distribution |
| [../scripts/release.sh](../scripts/release.sh) | Unix/Mac release script | Packages plugin for distribution |
| [../scripts/transform-all-hymnals.js](../scripts/transform-all-hymnals.js) | Hymnal bulk processor | Converts text hymnal files to HymnFlow JSON format |
