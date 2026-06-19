# 🎵 HymnFlow — OBS Studio Hymn & Scripture Display Plugin

**v2.5.0** · [Changelog](doc/CHANGELOG.md) · [Setup Guide](doc/SETUP.md) · [Full Docs](doc/OBS_DOCK_README.md)

HymnFlow is a browser-based OBS Studio plugin for displaying hymns and scripture during worship services. It runs entirely in the browser — no server, no Node.js, no installation. A custom dock controls the presentation; a browser source overlays text on your stream.

## ✨ Features

- 🗂️ **Tabbed Dock** — Library, Service, Live, and Style tabs keep controls organized
- 📅 **Full Service Planning** — Build and save service orders with Hymns, Scripture, Announcements, and Dividers; drag-and-drop reorder, duplicate services, notes/cues per item
- 📖 **Multi-Translation Bible Lookup** — Import any public-domain Bible (KJV, ASV, RVR, Almeida…); Quick Scripture panel for live verse lookup; persistent via IndexedDB
- ⌨️ **Keyboard Navigation** — Arrow keys for verse/line navigation; `[` / `]` for service items; configurable global hotkeys via OBS
- 🎛️ **Global OBS Hotkeys** — Control HymnFlow from any OBS window via obs-websocket + included Python script; hotkeys registered natively in OBS Settings → Hotkeys
- 🎨 **Customizable Styling** — Fonts, colors, text effects, backgrounds, animations, position
- 📥 **Import / Export** — Support for .txt, .csv, and .json hymn files; built-in Bible text converter script
- 🔄 **Auto-Advance** — Last verse auto-advances to next service item; line navigation wraps between verses
- 💾 **Persistent Storage** — Hymns in localStorage; Bible translations in IndexedDB (no size limit)
- 🌍 **9 UI Languages** — EN, ES, FR, PT, SW, TL, YO, ZH, KO

## 🚀 Quick Start

### Prerequisites

- OBS Studio v28 or higher (v27 works without global hotkeys)
- Web browser

### Step 1: Add Custom Dock in OBS

```text
View → Docks → Custom Browser Docks
Dock Name : HymnFlow Control
URL       : file:///C:/HymnFlow/public/obs-dock/index.html
```

### Step 2: Add Browser Source in OBS

```text
Add Source → Browser Source
Name   : Hymn Lower-Third
URL    : file:///C:/HymnFlow/public/obs-overlay/index.html
Width  : 1920   Height : 1080
✅ Shutdown source when not visible
✅ Refresh browser when scene becomes active
```

### Step 3: Import Hymns

Hymn collections are **not included** in the main download (keeps it at ~150 KB). Download from the [hymn-bundle folder](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle) and import via Library → Import.

### Step 4 (Optional): Enable Global Hotkeys

1. OBS → **Tools → obs-websocket Settings** → Enable WebSocket server
2. OBS → **Tools → Scripts** → `+` → select `scripts/hymnflow-obs-hotkeys.py`
3. OBS → **Settings → Hotkeys** → search "HymnFlow" → bind your keys
4. HymnFlow dock → **Style** tab → **OBS Connection** → Connect

See [obs-setup.html](public/obs-setup.html) for the full interactive guide.

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `→` | Next verse |
| `←` | Previous verse |
| `↓` | Next line window (long verses) |
| `↑` | Previous line window |
| `Space` | Toggle display on/off |
| `]` or `PageDown` | Next service item |
| `[` or `PageUp` | Previous service item |

> Shortcuts work when the dock panel has keyboard focus. For global hotkeys (any window), use the obs-websocket integration above.

## 📖 Bible Lookup

Bible data is not bundled — import a free public-domain JSON file.

**Quick-start (KJV):**
1. Download: [thiagobodruk/bible → en_kjv.json](https://github.com/thiagobodruk/bible/blob/master/json/en_kjv.json) (click Raw → Save As)
2. Library tab → Bible section → name `KJV` → **Import JSON**

**Other translations available at:**

| Repository | Translations | Languages |
|---|---|---|
| [thiagobodruk/bible](https://github.com/thiagobodruk/bible) | KJV, ASV, RVR, Almeida, Segond, Tagalog | EN, ES, PT, FR, TL |
| [scrollmapper/bible_databases](https://github.com/scrollmapper/bible_databases) | KJV, ASV | EN |
| [seven1m/open-bibles](https://github.com/seven1m/open-bibles) | WEB, YLT, Darby, and others | EN |
| [eBible.org](https://ebible.org/find/) | 500+ translations | Yoruba, Swahili, Hausa, Korean, and many more |

**Converting plain-text Bibles:**
```bash
python scripts/convert_bible_txt.py "path/to/bible.txt" --name KJV
python scripts/convert_yoruba_bible.py "path/to/yoruba.txt"  # Yoruba-specific
```

## 📅 Service Planning

1. **Service tab** → `+ New Service` → name it (e.g., "Sunday Morning 22 Jun")
2. Add items: `+ Hymn`, `+ Scripture`, `+ Announcement`, `+ Divider`
3. Drag-and-drop to reorder; add internal notes/cues per item
4. Click **Load** to run the service — a banner shows current + coming-next item
5. Press `]` or the banner arrows to advance; the last verse of a hymn auto-advances

## 🎨 Customization

Style tab controls:

| Option | Range |
|---|---|
| Font family | Inter, Segoe UI, Roboto, Georgia, Montserrat |
| Font size | 24 – 96 px (auto-fit for overflow) |
| Effects | Bold, italic, shadow, glow, outline + color/width |
| Background | Transparent, solid, or gradient |
| Animation | Fade, slide, or none |
| Position | Bottom-third, middle, or top |

## 🌍 Internationalization

9 UI languages: English · Spanish · French · Portuguese · Swahili · Tagalog · Yoruba · Mandarin · Korean

Change in: Style tab → Settings → Interface Language dropdown.

## 📁 Project Structure

```text
public/
├── obs-dock/           # Control panel (OBS custom dock)
├── obs-overlay/        # Lower-third overlay (OBS browser source)
├── data/               # Bible bundles (generated)
├── i18n/               # 9-language UI translations
├── parsers/            # File parsers (txt, csv, json)
└── obs-setup.html      # Interactive setup wizard

scripts/
├── hymnflow-obs-hotkeys.py   # OBS Script — global hotkey bridge
├── convert_bible_txt.py      # Generic Bible text → HymnFlow JSON converter
├── convert_yoruba_bible.py   # Yoruba Bible converter
└── bundle_bible_kjv.py       # KJV downloader / converter

hymn-bundle/            # SEPARATE DOWNLOAD — hymn collection JSON files
```

## 🔧 How It Works

```
Control Dock  ──localStorage event──▶  Overlay display
Control Dock  ──WebSocket (obs-ws)──▶  OBS Python Script  ──hotkey▶  HymnFlow
```

Hymn and service data → `localStorage`. Bible translations → `IndexedDB`. Real-time overlay communication → `localStorage storage` events. Global hotkeys → obs-websocket custom events.

## 📚 Documentation

| File | Contents |
|---|---|
| [public/obs-setup.html](public/obs-setup.html) | Interactive setup wizard with download links |
| [doc/SETUP.md](doc/SETUP.md) | 5-minute quick-start guide |
| [doc/OBS_DOCK_README.md](doc/OBS_DOCK_README.md) | Complete user guide |
| [doc/CHANGELOG.md](doc/CHANGELOG.md) | Full version history |
| [doc/TROUBLESHOOTING.md](doc/TROUBLESHOOTING.md) | Common issues & solutions |

## 🤝 Contributing

Vanilla JavaScript project, no build step required.

1. **Report bugs**: [Open an issue](https://github.com/ebena107/HymnFlow/issues)
2. **Suggest features**: [Discussions](https://github.com/ebena107/HymnFlow/discussions)
3. **Share on OBS Forums**: [Resources & Plugins](https://obsproject.com/forum/resources/)

## 📄 License

GPL-2.0 — Same as OBS Studio. Free to use and modify.

## 🙏 Acknowledgments

Built with love for worship teams everywhere. By the **Gloryland Baptist Church, Owode-Ede** `@gbcowode` Media Team. May your services be blessed!

---
**Ready for live streaming! 🎵🎬**
