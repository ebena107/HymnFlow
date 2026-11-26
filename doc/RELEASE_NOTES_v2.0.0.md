# 🎵 HymnFlow v2.0.0 - Initial Stable Release

**Release Date:** January 4, 2026  
**Release Type:** Major Release - Stable  
**Download:** [hymnflow-v2.0.0-plugin.zip](https://github.com/ebena107/HymnFlow/releases/tag/v2.0.0)

---

## 🎉 What's New

HymnFlow v2.0.0 is the first stable release of a browser-based OBS Studio plugin for displaying hymns during worship services. This release focuses on simplicity, reliability, and ease of use.

### ✨ Key Features

#### 🎛️ **OBS Custom Dock Control Panel**
- Complete hymn library management (add, remove, search, import, export)
- Real-time preview of current hymn and verse
- Navigation controls (previous/next verse, line-by-line navigation)
- Keyboard shortcuts for fast operation during live services
- Visual display toggle with state indicators

#### 📺 **OBS Browser Source Overlay**
- Lower-third display perfect for worship presentations
- Smooth animations (fade, slide, or none)
- Customizable positioning (bottom, middle, top)
- Automatic updates as you navigate in the dock

#### 🎨 **Powerful Styling Options**
- Font family selection (Inter, Segoe UI, Roboto, Georgia, Montserrat)
- Font size control (24px - 96px)
- Text effects: Bold, Italic, Shadow, Glow
- Text color picker
- Background types: Transparent, Solid, Gradient
- Custom background colors with gradient support

#### 📥 **Import/Export System**
- **TXT format:** Simple text-based format for easy hymn entry
- **JSON format:** Structured data with full metadata support
- **Export:** Backup your entire hymn library as JSON
- Default hymns included (English samples)

#### 🔄 **Smart Navigation**
- Auto-advance between verses when reaching line boundaries
- Configurable lines per display (2-6 lines)
- Jump to chorus functionality
- Emergency clear button for instant hide

#### 💾 **Browser-Based Storage**
- All data stored in browser localStorage (~5-10MB capacity)
- No server required - works offline
- Persistent across browser sessions
- Can handle thousands of hymns

---

## 🏗️ Architecture

### Pure Client-Side Design

HymnFlow uses an innovative **localStorage + storage events** architecture:

```
OBS Custom Dock (Control) ←→ localStorage ←→ OBS Browser Source (Display)
```

**Benefits:**
- ✅ No server installation or configuration
- ✅ No network dependencies
- ✅ Works with `file://` protocol (direct file access)
- ✅ Zero latency communication
- ✅ Simple deployment and updates

### File Structure

```
hymnflow-v2.0.0/
├── obs-dock/           # Control panel HTML/CSS/JS
│   ├── index.html
│   ├── obs-dock.css
│   └── obs-dock.js
├── obs-overlay/        # Display overlay HTML/CSS/JS
│   ├── index.html
│   ├── overlay.css
│   └── overlay.js
├── data/               # Default hymn library
│   ├── hymns-data.js
│   └── hymns.json
├── parsers/            # Import format parsers
│   ├── txtParser.js
│   ├── csvParser.js
│   └── jsonParser.js
└── Documentation files (README, SETUP, etc.)
```

**Total Size:** ~150-200 KB

---

## 🚀 Getting Started

### Quick Setup (5 Minutes)

1. **Download & Extract**
   - Download `hymnflow-v2.0.0-plugin.zip`
   - Extract to `C:\HymnFlow\` (or any location)

2. **Add Custom Dock in OBS**
   ```
   View → Docks → Custom Browser Docks
   Dock Name: HymnFlow Control
   URL: file:///C:/HymnFlow/public/obs-dock/index.html
   ```

3. **Add Browser Source**
   ```
   Add Source → Browser Source
   Name: Hymn Lower-Third
   URL: file:///C:/HymnFlow/public/obs-overlay/index.html
   Width: 1920, Height: 1080
   ```

4. **Import Your Hymns**
   - Click **Import** in the dock
   - Select your .txt or .json file
   - Start displaying!

**Detailed Instructions:** See [SETUP.md](SETUP.md)

---

## 📋 System Requirements

### Minimum Requirements
- **OBS Studio:** v27.0 or higher (v29+ recommended)
- **Operating System:** Windows 10/11, macOS 10.15+, Linux (Ubuntu 20.04+)
- **Browser Engine:** Chromium-based (OBS uses CEF - Chromium Embedded Framework)
- **Disk Space:** ~1 MB for plugin files
- **localStorage:** ~5-10 MB available (standard browser allocation)

### Recommended
- **OBS Studio:** v29.1+ (latest stable)
- **Display Resolution:** 1920x1080 or higher
- **RAM:** 8 GB+ (for smooth OBS operation)

---

## 🎯 Use Cases

### Perfect For:
- ✝️ Church worship services (Sunday services, prayer meetings, special events)
- 🎤 Small to medium congregations
- 📺 Live streaming worship (YouTube, Facebook, Vimeo)
- 🎶 Multi-language worship (import different hymn collections)
- 🏫 Bible study groups with hymn singing

### Tested Scenarios:
- ✅ Sunday morning services with 20+ hymns
- ✅ Live streaming with OBS Studio
- ✅ Multiple services with different hymn sets
- ✅ Quick hymn changes during live worship
- ✅ Keyboard-only operation for A/V operators

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` Right Arrow | Next verse |
| `←` Left Arrow | Previous verse |
| `↓` Down Arrow | Next line window |
| `↑` Up Arrow | Previous line window |
| `Space` | Toggle display (show/hide) |

---

## 📦 What's Included

### Core Files
- `obs-dock/` - Control panel (3 files)
- `obs-overlay/` - Display overlay (3 files)
- `parsers/` - Import parsers (3 files)
- `data/` - Default hymns (2 files)

### Documentation
- `README.md` - Project overview and features
- `SETUP.md` - 5-minute setup guide
- `TROUBLESHOOTING.md` - Common issues and solutions
- `SECURITY.md` - Security policy
- `LICENSE` - MIT License

### Development Files
- `.github/` - GitHub templates and workflows
- `scripts/` - Release automation scripts
- `doc/` - Developer documentation

---

## 🔒 Security & Privacy

- ✅ **No data collection** - Everything stays on your computer
- ✅ **No network calls** - Works completely offline
- ✅ **No tracking** - No analytics or telemetry
- ✅ **No external dependencies** - Pure vanilla JavaScript
- ✅ **Open source** - Full code transparency (MIT License)

**Data Storage:** All hymns and settings stored in browser localStorage (OBS's internal Chromium instance). Data never leaves your computer.

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](../.github/CONTRIBUTING.md) for guidelines.

**Ways to Contribute:**
- 🐛 Report bugs via [GitHub Issues](https://github.com/ebena107/HymnFlow/issues)
- 💡 Suggest features
- 📝 Improve documentation
- 🌍 Add translations or multi-language hymn collections
- 🎨 Design improvements
- 💻 Code contributions (PRs welcome!)

---

## 📜 License

HymnFlow is released under the [license](../LICENSE).

**Commercial Use Allowed** - Free to use in churches, ministries, and commercial settings.

---

## 🙏 Acknowledgments

- Built for the global worship community
- Inspired by the need for simple, reliable hymn display solutions
- Designed with A/V operators and worship leaders in mind

---

## 🔗 Resources

- **Documentation:** [SETUP.md](SETUP.md) | [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Support:** [GitHub Issues](https://github.com/ebena107/HymnFlow/issues)
- **Repository:** [github.com/ebena107/HymnFlow](https://github.com/ebena107/HymnFlow)

---

## 📝 Release Notes

### What's Included in v2.0.0

✅ Complete OBS Studio integration (custom dock + browser source)  
✅ Hymn management (add, delete, search, import, export)  
✅ Real-time navigation with keyboard shortcuts  
✅ Customizable styling and animations  
✅ Smart line-by-line navigation with auto-verse advancement  
✅ Visual display toggle with state indicators  
✅ Responsive design for various screen sizes  
✅ Comprehensive documentation  
✅ Default English hymn samples included  

### Known Limitations

- localStorage limited to ~5-10 MB (thousands of hymns)
- OBS dock and overlay must be from same origin (same folder structure)
- Browser-specific localStorage (separate OBS profile = separate storage)

### Planned for Future Releases

See [GitHub Issues](https://github.com/ebena107/HymnFlow/issues) for planned features and enhancements.

---

## 🆘 Support

**Having issues?** Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) first.

**Need help?** Open an issue: [GitHub Issues](https://github.com/ebena107/HymnFlow/issues/new/choose)

---

**Happy Worshiping! 🎵✨**

---

*HymnFlow v2.0.0 - Browser-based OBS hymn display plugin*  
*Released: January 4, 2026*  
*License: MIT*
