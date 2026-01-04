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

### Hymn Data Structure

```javascript
{
  id: "hymn_${Date.now()}_${random}",  // Unique ID
  title: string,
  author: string,
  verses: string[],              // Array of verse text (\n for line breaks)
  chorus: string,                // Optional
  metadata: { category, key, tempo },
  createdAt: ISO8601 timestamp
}
```

### localStorage Keys

- `hymnflow-hymns`: Array of all hymn objects
- `hymnflow-lowerthird-command`: Current command from dock to overlay (with timestamp)
- `hymnflow-dock-settings`: OBS dock customization settings (font, color, animation, position)

**Note:** Legacy keys `hymnview-*` and `hymnViewSettings` may exist from older versions but are no longer used.

### Message Protocol

Commands written to `hymnflow-lowerthird-command`:
- `show`: Display hymn with verses/lines (auto-sent on navigation)
  - Includes: `hymnId`, `title`, `author`, `verseNumber`, `totalVerses`, `lines[]`, `settings`, `timestamp`
- `hide`: Hide overlay
  - Includes: `timestamp` (and optionally `settings` for animation)

**Auto-update behavior:** Navigation functions (`selectHymn`, `nextVerse`, `prevVerse`, `nextLineWindow`, `prevLineWindow`) automatically call `sendCommand('show')`, providing seamless real-time updates without manual button presses.

### File Parsers (Client-Side)

Three parsers in `public/parsers/`: `txtParser.js`, `csvParser.js`, `jsonParser.js`. Each exports async function accepting a File object and returning an array of hymn objects.

**TXT format**:
- `Title:` starts a new hymn
- `Author:` is optional
- Empty lines separate verses
- `Chorus:` marks optional chorus text
- Example: See [public/parsers/txtParser.js](public/parsers/txtParser.js) for full implementation

**JSON format**: Array of hymn objects matching the hymn schema (see [public/data/hymns-data.js](public/data/hymns-data.js) for examples)

**Adding a new parser**: 
1. Create file in `public/parsers/` (e.g., `xmlParser.js`)
2. Export async `parseXml(file)` function that returns array of hymn objects
3. Add handler to `handleImport()` switch statement in [public/obs-dock/obs-dock.js](public/obs-dock/obs-dock.js#L252-L270)
4. Update file input accept attribute if needed

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
# Option 1: Python simple server
cd public
python -m http.server 8000
# Open http://localhost:8000/obs-dock/ and http://localhost:8000/obs-overlay/

# Option 2: VS Code Live Server
# Right-click public/obs-dock/index.html → "Open with Live Server"

# Option 3: Direct file access (OBS Custom Dock)
# Use file:///C:/HymnFlow/public/obs-dock/index.html
```

### Testing in OBS

- Browser Source URL: `file:///C:/HymnFlow/public/obs-overlay/index.html` OR `http://localhost:8000/obs-overlay/`
- Custom Dock URL: `file:///C:/HymnFlow/public/obs-dock/index.html` OR `http://localhost:8000/obs-dock/`

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

### Adding New Features

1. **New command type**: Add to dock's `sendCommand()`, handle in overlay's storage event listener
2. **New hymn field**: Update hymn schema in `hymns-data.js`, parsers, and UI
3. **New file format**: Create parser in `public/parsers/`, add to `handleImport()` in obs-dock.js
4. **Data export/import**: Use localStorage get/set with JSON stringify/parse
5. **New styling option**: Add to settings object, update UI in dock, apply in overlay

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
- **Hymn IDs immutable**: Changing IDs breaks references
- **Verse line breaks**: Use `\n` in verse strings for multiline text
- **No validation**: Parsers don't validate required fields - add try/catch if extending
