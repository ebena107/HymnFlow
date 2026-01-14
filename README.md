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
- 🌍 **Multi-Language Support** - Interface in 9 languages (EN, ES, FR, PT, SW, TL, YO, ZH, KO)
- 📦 **Hymn Bundle** - Optional high-quality collections (including CAC GHB/YHB) available as **separate download** for small base size

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

#### Step 3: Download Hymn Bundle (Separate Download)

> [!IMPORTANT]
> The hymn collections are **NOT included** in the main plugin download to keep it lightweight (~150KB).
> You must download hymn files separately.

**Option 1: Download from GitHub Repository**
- Visit the [hymn-bundle folder](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle) on GitHub
- Download individual `.json` files you need (e.g., `cac_ghb.json`, `cac_yhb.json`)
- Save them to a location on your computer (e.g., `C:\HymnFlow\hymn-bundle\`)

**Option 2: Download from Releases**
- Visit the [Releases page](https://github.com/ebena107/HymnFlow/releases)
- Download the `hymn-bundle.zip` file (if available)
- Extract to your preferred location

#### Step 4: Import Your Hymns

- Click **Import** button in the dock
- Select your downloaded `.json` hymn file
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

## 🌍 Internationalization (i18n)

HymnFlow supports multiple languages for the user interface:

### Supported Languages

- 🇬🇧 **English** (en) - Default
- 🇪🇸 **Spanish** (es - Español)
- 🇫🇷 **French** (fr - Français)
- 🇵🇹 **Portuguese** (pt - Português)
- 🇹🇿 **Swahili** (sw - Kiswahili)
- 🇵🇭 **Tagalog** (tl)
- 🇳🇬 **Yoruba** (yo - Yorùbá)
- 🇨🇳 **Mandarin Chinese** (zh - 中文)
- 🇰🇷 **Korean** (ko - 한국어)

### Official Hymn Collections (Separate Download)

> [!NOTE]
> Hymn collections are **not included** in the main plugin package to keep the download size small.

The **Hymn Bundle** is available as a separate download, featuring:
- **CAC GHB**: Christ Apostolic Church Gospel Hymn Book (English) - 1,001 hymns
- **CAC YHB**: Iwe Orin CAC (Yoruba) - 997 hymns
- **Standard Library**: FWS, NNBH, UMH, YBH collections

**How to get hymn files:**
1. Download from the [hymn-bundle folder](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle) on GitHub
2. Or download from [Releases](https://github.com/ebena107/HymnFlow/releases) (if hymn-bundle.zip is available)
3. Import the `.json` files using the Import button in the HymnFlow dock

### Changing Language

1. Open the **OBS Dock** control panel
2. Scroll to the **Settings** section
3. Select your preferred language from the **Interface Language** dropdown
4. The UI will update immediately with all labels, buttons, and tooltips in your selected language

### Language Persistence

Your language preference is automatically saved in browser `localStorage` and will be remembered across sessions.

### Adding New Languages

To add a new language:

1. Create a new translation file in `public/i18n/` (e.g., `de.json` for German)
2. Copy the structure from `public/i18n/en.json` and translate all strings
3. Add the language code and name to `AVAILABLE_LANGUAGES` in `public/i18n/i18n.js`
4. Add a new `<option>` in the language selector in `public/obs-dock/index.html`

Translation files follow a nested JSON structure:

```json
{
  "app": {
    "title": "HymnFlow Dock",
    "subtitle": "Controller description"
  },
  "hymns": {
    "title": "Hymns",
    "buttons": {
      "add": "+ Add",
      "edit": "✏️ Edit"
    }
  }
}
```

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
├── i18n/               # Internationalization files
│   ├── i18n.js         # i18n module
│   ├── en.json         # English translations
│   ├── es.json         # Spanish translations
│   ├── fr.json         # French translations
│   ├── pt.json         # Portuguese translations
│   ├── sw.json         # Swahili translations
│   ├── tl.json         # Tagalog translations
│   ├── yo.json         # Yoruba translations
│   ├── zh.json         # Mandarin Chinese translations
│   └── ko.json         # Korean translations
├── parsers/            # Client-side file parsers
│   ├── txtParser.js
│   ├── csvParser.js
│   └── jsonParser.js
├── hymn-bundle/        # External hymn data (Separate download)
│   ├── cac_ghb.json
│   ├── cac_yhb.json
│   └── ...
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

### Ways to Contribute

1. **Report Issues**: Found a bug? [Open an issue](https://github.com/ebena107/HymnFlow/issues)
2. **Suggest Features**: Have an idea? Share it in [Discussions](https://github.com/ebena107/HymnFlow/discussions)
3. **Submit Pull Requests**: Code improvements welcome!
4. **Share on OBS Forums**: Help others discover HymnFlow on the [OBS Project Forums](https://obsproject.com/forum/)

### Sharing on OBS Forums

If you find HymnFlow useful, consider sharing it on the OBS community:

- **OBS Forums**: [https://obsproject.com/forum/](https://obsproject.com/forum/)
- **Relevant Sections**:
  - [Resources & Plugins](https://obsproject.com/forum/resources/) - Share as a resource
  - [General Discussion](https://obsproject.com/forum/list/general-discussion.4/) - Discuss use cases
  - [Live Streaming/Recording](https://obsproject.com/forum/list/live-streaming-recording.6/) - Share streaming tips

When sharing, mention:
- Browser-based plugin (no installation required)
- Works with OBS Custom Docks and Browser Sources
- Supports 9 languages
- Perfect for worship services and live streaming

Your feedback and contributions help improve HymnFlow for worship teams worldwide!

## 📄 License

GPL-2.0 License - Same as OBS Studio. Free to use and modify for your worship services!

## 🙏 Acknowledgments

Built with love for worship teams everywhere. By the **Gloryland Baptist Church, Owode-Ede ```@gbcowode```, Media Team**. May your services be blessed! ✨

---

**Ready for live streaming! 🎵🎬**
