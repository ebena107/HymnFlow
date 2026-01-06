# 🎵 HymnFlow - OBS Studio Hymn Display Plugin

**HymnFlow** is a browser-based OBS Studio plugin for displaying hymns during worship services. Features a custom dock control panel and lower-third overlay display.

## ✨ Features

- 📋 **Full Hymn Management** - Add, edit, delete, search hymns
- ⌨️ **Keyboard-Driven Navigation** - Arrow keys for verse/line navigation
- 🎨 **Customizable Styling** - Fonts, colors, effects, backgrounds, animations
- 📥 **Import/Export** - Support for .txt and .json hymn files
- 🎯 **Smart Navigation** - Auto-advance between verses at line boundaries
- 👁️ **Visual Feedback** - Toggle button with color/icon state indicators
- 📱 **Responsive Design** - Works on any screen size including vertical displays
- 🔄 **Real-Time Updates** - Overlay updates automatically as you navigate
- 💾 **Persistent Storage** - Hymns saved in browser localStorage

## 🚀 Quick Start

### Prerequisites

- OBS Studio (v27 or higher)
- Web browser (Chrome, Edge, Firefox)

### Setup (No Server Required!)

#### Step 1: Add Custom Dock in OBS

```text
View → Docks → Custom Browser Docks
Dock Name: HymnFlow Control
URL: file:///C:/HymnFlow/public/obs-dock/index.html
```

#### Step 2: Add Browser Source in OBS

```text
Add Source → Browser Source
Name: Hymn Lower-Third
URL: file:///C:/HymnFlow/public/obs-overlay/index.html
Width: 1920
Height: 1080
✅ Shutdown source when not visible
✅ Refresh browser when scene becomes active
```

#### Step 3: Import Your Hymns

- Click **Import** button in the dock
- Select your .txt or .json hymn file
- Start displaying hymns!

### Alternative: Python HTTP Server

If you prefer URLs instead of file:// paths:

```bash
cd C:\HymnFlow\public
python -m http.server 8000

# Then use:
# Dock: http://localhost:8000/obs-dock/
# Overlay: http://localhost:8000/obs-overlay/
```

## 📖 Usage

### Keyboard Shortcuts

| Key | Action |
| --- | ------ |
| `→` | Next verse (auto-updates overlay) |
| `←` | Previous verse (auto-updates overlay) |
| `↓` | Next line window (auto-advances to next verse at end) |
| `↑` | Previous line window (auto-retreats to previous verse at start) |
| `Space` | Toggle display (show/hide overlay) |

### Display Button States

- **👁️ Display** (purple) = Overlay is hidden
- **🚫 Hide** (red, pulsing) = Overlay is visible on stream

### Importing Hymns

#### TXT Format

```text
Title: Amazing Grace
Author: John Newton

Amazing grace! How sweet the sound
That saved a wretch like me!

'Twas grace that taught my heart to fear,
And grace my fears relieved;
```

#### JSON Format

```json
[
  {
    "title": "Amazing Grace",
    "author": "John Newton",
    "verses": [
      "Amazing grace! How sweet the sound\nThat saved a wretch like me!",
      "'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;"
    ]
  }
]
```

## 🎨 Customization

All styling options available in the dock:

- **Fonts**: 5 pre-loaded fonts (Inter, Segoe UI, Roboto, Georgia, Montserrat)
- **Size**: 24px - 96px
- **Effects**: Bold, italic, shadow, glow
- **Colors**: Full color pickers for text and backgrounds
- **Backgrounds**: Transparent, solid, or gradient
- **Animations**: Fade, slide, or none
- **Position**: Bottom-third, middle, or top

## 📁 Project Structure

```text
public/
├── obs-dock/           # Control panel (OBS custom dock)
│   ├── index.html
│   ├── obs-dock.css
│   └── obs-dock.js
├── obs-overlay/        # Lower-third display (OBS browser source)
│   ├── index.html
│   ├── overlay.css
│   └── overlay.js
├── data/
│   └── hymns-data.js   # Default hymns library
├── parsers/            # Client-side file parsers
│   ├── txtParser.js
│   ├── csvParser.js
│   └── jsonParser.js
└── obs-setup.html      # Interactive setup wizard
```

## 📚 Documentation

- **[doc/OBS_DOCK_README.md](doc/OBS_DOCK_README.md)** - Complete user guide with all features
- **[doc/OBS_IMPLEMENTATION.md](doc/OBS_IMPLEMENTATION.md)** - Technical implementation details
- **[doc/TROUBLESHOOTING.md](doc/TROUBLESHOOTING.md)** - Common issues and solutions
- **[public/obs-setup.html](public/obs-setup.html)** - Interactive setup wizard

## 🔧 How It Works

HymnFlow uses browser `localStorage` and `storage` events for real-time communication:

1. **Control Dock** writes commands to `localStorage`
2. **Storage events** fire automatically in other windows
3. **Overlay** listens for storage events and updates display

No server, no WebSocket, just pure browser APIs! Perfect for portable deployment.

## 🎯 Use Cases

- Church worship services
- Live streaming events
- Karaoke displays
- Presentations with text overlays
- Multi-scene hymn displays

## 🤝 Contributing

Issues and pull requests welcome! This is a simple, vanilla JavaScript project with no build step.

## 📄 License

GPL-2.0 License - Same as OBS Studio. Free to use and modify for your worship services!

## 🙏 Acknowledgments

Built with love for worship teams everywhere. By the **Gloryland Baptist Church, Owode-Ede ```@gbcowode```, Media Team**. May your services be blessed! ✨

---

**Ready for live streaming! 🎵🎬**
