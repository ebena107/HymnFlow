# 🎵 HymnFlow — OBS Studio Hymn & Scripture Display Plugin

**v2.7.0** · [Changelog](doc/CHANGELOG.md) · [Setup Guide](doc/SETUP.md) · [Full Docs](doc/OBS_DOCK_README.md) · [Releases](https://github.com/ebena107/HymnFlow/releases)

HymnFlow is a browser-based OBS Studio plugin for displaying hymns and scripture during worship services. It runs entirely in the browser — no server, no Node.js, no installation. A custom dock controls the presentation; a browser source overlays text on your stream.

## ✨ Features

- 🗂️ **Tabbed Dock** — Library, Service, Live, and Style tabs keep controls organized
- 📅 **Full Service Planning** — Build and save service orders with Hymns, Scripture, Announcements, and Dividers; drag-and-drop reorder, duplicate services, notes/cues per item
- 📖 **Multi-Translation Bible Lookup** — Plug-and-play: KJV auto-loads on first run; import any public-domain Bible; Quick Scripture panel for live verse lookup (flexible references: `John 3:16`, `Rom 8:28-30`, `Rom 8 28 30`, `Juan 3:16`); persistent via IndexedDB
- 📜 **Scripture Display Styling** — Dedicated serif look for scripture with reference header + translation badge, all customizable: font, italics, header/badge visibility, independent size
- ⌨️ **Keyboard Navigation** — Arrow keys for verse/line navigation; `[` / `]` for service items; configurable global hotkeys via OBS (11 actions incl. Blank, Clear, Chorus, Restore)
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

The `-lite` release bundle ships one default hymnal (nnbh); the `-full` and `-data` bundles include all collections. Additional collections can be downloaded from the [hymn-bundle folder](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle) and imported via Library → Import.

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
| `1`–`9` | Jump straight to that verse |
| `C` | Show the chorus |
| `B` | Blank the screen (keeps your place) |
| `X` | Emergency Clear |
| `Z` | Restore what was on screen before Blank / Clear |
| `?` | Show the shortcut cheat sheet |

On the last verse, the first `→` only arms the advance; a second press moves to the next service item (turn off in Style → Settings).

> Shortcuts work when the dock panel has keyboard focus. For global hotkeys (any window), use the obs-websocket integration above.

## 📖 Bible Lookup

**Works out of the box** — on first launch the dock auto-loads the bundled KJV, so scripture lookup needs no setup.

**Curated translations (included in the `-full` and `-data` release bundles):** six public-domain translations that passed a systematic accuracy audit — clean **KJV 1769**, **Revised Version 1885**, **Literal Standard Version**, **Geneva Bible 1599**, **Douay-Rheims**¹, and **JPS 1917 Tanakh** (OT only). Import via Library → Bible → **Import JSON**.

¹ *Douay-Rheims uses Vulgate Psalm numbering (Psalm N ≈ Hebrew Psalm N+1).*

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
| Scripture Display | Serif/system font, italics, reference header, translation badge, independent size |

The **OBS Connection** and **Scripture Display** sections are collapsible panels — their open/closed state is remembered.

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
├── bundle_bible_kjv.py       # KJV downloader / converter
└── scrape_bible_api.py       # Multi-translation scraper (audited, curated output)

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
