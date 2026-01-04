# 🎵 HymnFlow - OBS Studio Plugin for Worship Display

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Latest Release](https://img.shields.io/github/v/release/yourusername/HymnFlow)](https://github.com/yourusername/HymnFlow/releases)
[![GitHub Issues](https://img.shields.io/github/issues/yourusername/HymnFlow)](https://github.com/yourusername/HymnFlow/issues)

**HymnFlow** is a browser-based OBS Studio plugin for displaying hymns during worship services. No server required—everything runs in your browser!

## ✨ Features at a Glance

- 📋 **Full Hymn Management** - Add, edit, delete, search hymns
- ⌨️ **Keyboard Navigation** - Arrow keys for verse/line control
- 🎨 **Rich Customization** - Fonts, colors, effects, animations
- 📥 **Multi-Format Import** - .txt, .json, .csv support
- 🎯 **Smart Navigation** - Auto-advance between verses
- 👁️ **Real-Time Display** - Instant updates to overlay
- 💾 **Browser Storage** - No server needed, no accounts
- 🚀 **Zero Dependencies** - Pure vanilla JavaScript

## 🚀 Quick Start (2 Minutes)

### Requirements
- OBS Studio v27+
- Any modern web browser
- 5 MB disk space

### Installation

**Step 1:** Download and extract the latest [release](https://github.com/yourusername/HymnFlow/releases)

**Step 2:** Add Custom Dock in OBS
```
View → Docks → Custom Browser Docks
Name: HymnFlow Control
URL: file:///C:/HymnFlow/public/obs-dock/index.html
```

**Step 3:** Add Browser Source for Display
```
Sources → Add → Browser Source
Name: Hymn Lower-Third
URL: file:///C:/HymnFlow/public/obs-overlay/index.html
Width: 1920 | Height: 1080
✅ Shutdown source when not visible
✅ Refresh browser when scene becomes active
```

**Step 4:** Click a hymn and press → to test

👉 [Detailed Setup Guide](SETUP.md)

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **→** | Next verse (auto-displays) |
| **←** | Previous verse (auto-displays) |
| **↓** | Next line window (auto-advances verses) |
| **↑** | Previous line window |
| **Space** | Toggle display on/off |

## 📥 Import Hymns

### TXT Format (Recommended)
```
Title: Amazing Grace
Author: John Newton

Amazing grace! How sweet the sound
That saved a wretch like me!

'Twas grace that taught my heart to fear,
And grace my fears relieved;
```

### JSON Format
```json
[
  {
    "title": "Amazing Grace",
    "author": "John Newton",
    "verses": [
      "Amazing grace! How sweet the sound\nThat saved a wretch like me!",
      "'Twas grace that taught my heart to fear\nAnd grace my fears relieved;"
    ]
  }
]
```

Click **Import** in the dock and select your file.

## 🎨 Customization

Control everything from the dock's **Settings** panel:

- **Font & Size** - 24px to 96px with custom fonts
- **Colors** - Text and background color pickers
- **Effects** - Bold, italic, shadow, glow toggles
- **Background** - Transparent, solid, or gradient
- **Animations** - Fade, slide, or instant
- **Position** - Bottom-third, middle, or top

Changes apply **instantly** to the overlay.

## 📚 Documentation

- [**SETUP.md**](SETUP.md) - Complete setup guide
- [**OBS_DOCK_README.md**](OBS_DOCK_README.md) - Detailed feature documentation
- [**TROUBLESHOOTING.md**](TROUBLESHOOTING.md) - Common issues & solutions
- [**RELEASE.md**](RELEASE.md) - Version info & migration guide
- [Contributing](../.github/CONTRIBUTING.md) - How to contribute

## 🛠️ Development

HymnFlow is built with **vanilla JavaScript** (no frameworks, no build step).

```bash
# Clone
git clone https://github.com/yourusername/HymnFlow.git
cd HymnFlow

# Serve locally
cd public
python -m http.server 8000

# Open in browser
# Dock: http://localhost:8000/obs-dock/
# Overlay: http://localhost:8000/obs-overlay/
```

**Architecture:**
- `public/obs-dock/` - Control panel (vanilla JS)
- `public/obs-overlay/` - Display overlay (vanilla JS)
- `public/data/` - Hymn library data
- `public/parsers/` - File format parsers

No dependencies, no build process.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](.github/CONTRIBUTING.md).

**Quick help:**
- 🐛 Found a bug? [Report it](https://github.com/yourusername/HymnFlow/issues/new?template=bug-report.md)
- 💡 Have an idea? [Suggest it](https://github.com/yourusername/HymnFlow/issues/new?template=feature-request.md)
- ❓ Have questions? [Ask here](https://github.com/yourusername/HymnFlow/issues/new?template=question.md)

## 📄 License

MIT License - Free to use and modify. See [LICENSE](LICENSE) file.

## 🔒 Security

For security issues, please see [SECURITY.md](SECURITY.md).

HymnFlow runs entirely in your browser with **zero external dependencies**:
- No server to hack
- No database to breach
- No API calls
- No analytics
- No ads

## 🙏 Acknowledgments

Built for worship leaders and congregations seeking simple, reliable hymn display.

Special thanks to:
- Contributors and testers
- OBS Studio community
- Everyone who reported issues and suggested improvements

## 📞 Support

- **Documentation**: See [SETUP.md](SETUP.md) and [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Issues**: [GitHub Issues](https://github.com/yourusername/HymnFlow/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/HymnFlow/discussions)
- **Email**: contact@yourdomain.com

## 📊 Project Status

- ✅ **Stable** - v2.0.0 released
- 🎯 **Active** - Regularly maintained
- 🤝 **Community** - Contributions welcome
- 🔄 **Cross-platform** - Windows, macOS, Linux

---

**Made with ❤️ for worship communities everywhere.**

[⬆ Back to top](#-hymnflow---obs-studio-plugin-for-worship-display)
