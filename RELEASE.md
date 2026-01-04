# HymnFlow Release Guide

## Release Packages

HymnFlow is distributed as an **OBS Studio Plugin** in multiple formats:

### Package Contents

Each release includes:
- **OBS Dock Control Panel** (`obs-dock/`) - Custom dock for hymn management and control
- **OBS Overlay Display** (`obs-overlay/`) - Lower-third display overlay
- **Built-in Hymn Library** (`data/hymns-data.js`) - Default hymns
- **Import/Export Parsers** (`parsers/`) - Support for TXT, JSON, CSV formats
- **Complete Documentation** - Setup guides and troubleshooting

### Installation Methods

#### Method 1: Direct File URLs (Recommended for OBS)

1. Download the latest release from GitHub
2. Extract to a permanent location (e.g., `C:\HymnFlow`)
3. In OBS:
   - **Custom Dock**: `file:///C:/HymnFlow/public/obs-dock/index.html`
   - **Browser Source**: `file:///C:/HymnFlow/public/obs-overlay/index.html`

#### Method 2: HTTP Server (for Development/Testing)

```bash
cd public
python -m http.server 8000

# Then use in OBS:
# Dock: http://localhost:8000/obs-dock/
# Overlay: http://localhost:8000/obs-overlay/
```

#### Method 3: VS Code Live Server

1. Install Live Server extension
2. Right-click `public/obs-dock/index.html`
3. Select "Open with Live Server"
4. Use the provided localhost URL in OBS

## Version Format

HymnFlow uses semantic versioning: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (e.g., localStorage key changes)
- **MINOR**: New features (e.g., new styling options)
- **PATCH**: Bug fixes and improvements

## Release Artifacts

Each GitHub release includes:

### 1. **hymnflow-v{version}-plugin.zip**
```
HymnFlow/
├── public/
│   ├── obs-dock/
│   │   ├── index.html
│   │   ├── obs-dock.css
│   │   └── obs-dock.js
│   ├── obs-overlay/
│   │   ├── index.html
│   │   ├── overlay.css
│   │   └── overlay.js
│   ├── data/
│   │   └── hymns-data.js
│   └── parsers/
│       ├── txtParser.js
│       ├── csvParser.js
│       └── jsonParser.js
├── README.md
└── SETUP.md
```

### 2. **hymnflow-v{version}-portable.zip**
Includes setup documentation and quick-start files for non-technical users.

### 3. **Source Code**
Full repository with all documentation and development files.

## Upgrading from Previous Versions

### v1.x to v2.x Migration

The migration from `hymnview-*` localStorage keys to `hymnflow-*` keys is automatic:

1. **Old data is preserved**: Existing hymns remain in browser
2. **Keys are migrated**: First load automatically converts old keys
3. **No action needed**: Simply update the plugin URLs in OBS

If you need to manually export your hymns first:
1. In the old dock, click **Export**
2. Save your hymns as `.json`
3. Install new version
4. Click **Import** and load your saved file

## Installation Verification

After installation, verify everything works:

1. **Dock loads**: Custom dock appears in OBS without errors
2. **Hymn list appears**: Default hymns display in the dock
3. **Navigation works**: Arrow keys advance verses
4. **Overlay displays**: Browser source shows hymn content
5. **Customization works**: Font/color changes apply to overlay

## Support & Troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues and solutions.

### Quick Test

```
1. Dock URL: file:///path/to/HymnFlow/public/obs-dock/index.html
2. Click a hymn → Should appear in preview
3. Press → arrow key → Verse should advance
4. Create Browser Source with overlay URL
5. Overlay URL: file:///path/to/HymnFlow/public/obs-overlay/index.html
6. Should see hymn display in OBS preview
```

## Building from Source

To build the plugin from source:

```bash
git clone https://github.com/yourusername/HymnFlow.git
cd HymnFlow
# No build step needed - all files are ready to use
# Just point OBS to the URLs in public/
```

All files are vanilla JavaScript with no build dependencies.
