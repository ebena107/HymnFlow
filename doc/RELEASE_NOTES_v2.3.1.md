# 🎵 HymnFlow v2.3.1 - Global Worship Enhanced

**Release Date:** January 14, 2026  
**Release Type:** Feature + Documentation Release  
**Download:** [hymnflow-v2.3.1-plugin.zip](https://github.com/ebena107/HymnFlow/releases/tag/v2.3.1)

---

## ✨ What's New

HymnFlow v2.3.1 combines the powerful internationalization features of v2.3.0 with enhanced documentation to make setup crystal clear. This release represents a major leap forward in accessibility and usability for worship teams worldwide.

---

## 🌍 Major Features (v2.3.0 + v2.3.1)

### 1️⃣ **Multi-Language Support** (v2.3.0)

The HymnFlow interface now supports **9 languages**, allowing operators to work in their native tongue!

**Supported Languages:**
- 🇬🇧 **English** (Default)
- 🇪🇸 **Español** (Spanish)
- 🇫🇷 **Français** (French)
- 🇵🇹 **Português** (Portuguese)
- 🇹🇿 **Kiswahili** (Swahili)
- 🇵🇭 **Tagalog**
- 🇳🇬 **Yorùbá** (Yoruba)
- 🇨🇳 **中文** (Mandarin Chinese)
- 🇰🇷 **한국어** (Korean)

**How to change language:**
1. Open HymnFlow Dock in OBS
2. Scroll to the **Settings** section
3. Select your language from the **Interface Language** dropdown
4. The UI updates immediately!

---

### 2️⃣ **Official CAC Hymn Collections** (v2.3.0)

Complete, verified hymn books from Christ Apostolic Church:

- **CAC Gospel Hymn Book (English)**: 1,001 hymns - 1.18 MB
- **CAC Yoruba Hymn Book (Iwe Orin CAC)**: 997 hymns - 969 KB

Plus standard collections:
- **Faith We Sing**: 7 hymns - 44 KB
- **Nigerian Baptist Hymnal**: 7 hymns - 352 KB
- **United Methodist Hymnal**: 7 hymns - 337 KB
- **Yoruba Baptist Hymnal**: 6 hymns - 582 KB

**Total: 2,025 hymns across 6 collections!**

---

### 3️⃣ **Optimized "Hymn Bundle" Architecture** (v2.3.0)

To keep the core application small and fast, large hymn collections have been moved into an optional **Hymn Bundle** available as a separate download.

**Benefits:**
- ✅ **Reduced Size**: Core plugin download reduced from ~3MB to **~150KB** (95% smaller!)
- ✅ **Faster Downloads**: Get started quickly, download only the hymns you need
- ✅ **Separate Management**: Update your hymn library without re-downloading the plugin
- ✅ **Community Ready**: Easier to share and contribute new hymn books in JSON format
- ✅ **Individual Downloads**: Each hymn collection available as a separate file

---

### 4️⃣ **Crystal-Clear Documentation** (v2.3.1)

Enhanced documentation to eliminate confusion about hymn file downloads:

- 📖 **Prominent notices** explaining hymn files are a separate download
- 📖 **Step-by-step instructions** for downloading hymn files from GitHub
- 📖 **Multiple download options** (individual files or bulk download)
- 📖 **Updated setup wizard** with clear separation messaging
- 📖 **Comprehensive guides** in README, SETUP, and interactive HTML wizard

---

## 📋 Complete Change Log

### v2.3.1 (January 14, 2026) - Documentation Improvements

**Changed:**
- 📖 Updated `README.md` with explicit hymn bundle download instructions
- 📖 Updated `doc/SETUP.md` with detailed download options (GitHub folder or Releases)
- 📖 Updated `public/obs-setup.html` with prominent notice that hymn files are separate downloads
- 🔢 Bumped version to 2.3.1 in `package.json` and all HTML files
- 📋 Created comprehensive release notes and OBS Project release documentation

**Notes:**
- No functional changes to the application
- Plugin download remains ~150KB (hymn files not included)

---

### v2.3.0 (January 14, 2026) - Internationalization & Optimization

**Added:**
- 🌍 Multi-language support for 9 languages
- ⚙️ Interface Language selector in Settings
- 💾 Persistent language preference (saved in localStorage)
- 🧩 New i18n module for dynamic translation management
- 📂 JSON-based translation files for easy community contribution
- 📚 CAC Gospel Hymn Book (English) - 1,001 hymns
- 📚 CAC Yoruba Hymn Book (Iwe Orin CAC) - 997 hymns
- 📦 Optimized "Hymn Bundle" architecture (separate download)

**Changed:**
- 🎯 Reduced core plugin size from ~3MB to ~150KB
- 📖 Updated setup documentation for external data import

---

## 📥 How to Get Hymn Files

> [!IMPORTANT]
> Hymn files are **NOT included** in the main plugin download to keep it lightweight.

### Option 1: Download Individual Files from GitHub

1. Visit the [hymn-bundle folder](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle) on GitHub
2. Click on the hymn file you want (e.g., `cac_ghb.json`)
3. Click the "Download raw file" button or right-click "Raw" and select "Save link as..."
4. Save to your computer (e.g., `C:\HymnFlow\hymn-bundle\`)

### Option 2: Download from Releases

1. Visit the [Releases page](https://github.com/ebena107/HymnFlow/releases)
2. Download the `hymn-bundle.zip` file (if available)
3. Extract to your preferred location

### Import into HymnFlow

1. Open the HymnFlow Dock in OBS
2. Click the **Import** button in the Hymns section
3. Navigate to where you saved the `.json` file
4. Select the hymn file (e.g., `cac_ghb.json`)
5. Your hymns will be imported and ready to use!

---

## 🌟 Available Hymn Collections

All available as **separate downloads** from the [hymn-bundle folder](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle):

| Collection | Language | Hymns | Size |
|------------|----------|-------|------|
| **CAC Gospel Hymn Book** | English | 1,001 | 1.18 MB |
| **CAC Yoruba Hymn Book** | Yoruba | 997 | 969 KB |
| **Faith We Sing** | English | 7 | 44 KB |
| **Nigerian Baptist Hymnal** | English | 7 | 352 KB |
| **United Methodist Hymnal** | English | 7 | 337 KB |
| **Yoruba Baptist Hymnal** | Yoruba | 6 | 582 KB |

**Total: 2,025 hymns** available for download!

---

## 🔄 Migration from v2.2.x

**No breaking changes!** All existing hymns and styling settings are fully compatible.

### If Upgrading from v2.2.x:
1. Download and extract the new plugin
2. Your existing hymns in localStorage will remain
3. Select your preferred language in Settings
4. Optionally download additional hymn collections

### If Upgrading from v2.3.0:
- No changes required! This is purely a documentation update
- You don't need to update unless you want the latest documentation

---

## 📦 What's Included in the Plugin Download

The `hymnflow-v2.3.1-plugin.zip` (~150KB) contains:

- ✅ **OBS Dock** - Control panel for managing hymns
- ✅ **OBS Overlay** - Lower-third display for streaming
- ✅ **i18n Translations** - 9 language support files
- ✅ **Setup Guide** - Interactive HTML setup wizard
- ✅ **Documentation** - README, SETUP, TROUBLESHOOTING guides
- ✅ **Parsers** - Support for .txt and .json import
- ✅ **Default Data** - Sample hymns to get started

**NOT Included:**
- ❌ **Hymn Collections** - Download separately (see above)

---

## 🎬 Quick Start

### 1. Download Plugin
- Get [hymnflow-v2.3.1-plugin.zip](https://github.com/ebena107/HymnFlow/releases/tag/v2.3.1)
- Extract to `C:\HymnFlow\` (or your preferred location)

### 2. Setup in OBS
- **Add Custom Dock:** View → Docks → Custom Browser Docks
  - Name: `HymnFlow Control`
  - URL: `file:///C:/HymnFlow/obs-dock/index.html`
- **Add Browser Source:** Add Source → Browser Source
  - Name: `Hymn Lower-Third`
  - URL: `file:///C:/HymnFlow/obs-overlay/index.html`
  - Size: 1920x1080

### 3. Download Hymn Files
- Visit [hymn-bundle folder](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle)
- Download the collections you need

### 4. Import and Use
- Click Import in the dock
- Select your downloaded `.json` file
- Start displaying hymns!

---

## 🎨 Core Features

- 🎯 **Zero-Latency** - Pure browser localStorage communication (no server required)
- 🌍 **International** - UI in 9 languages and growing
- 🎨 **Customizable** - Control fonts, colors, outlines, shadows, and animations
- ⌨️ **Keyboard-Driven** - Arrow keys for seamless verse/line navigation
- 🔄 **Smart Chorus** - Automatic chorus display after every verse
- 📅 **Service Scheduling** - Pre-plan your hymn order before services start
- 💾 **Persistent Storage** - Hymns saved in browser localStorage
- 📱 **Responsive** - Works on any screen size
- 📥 **Import/Export** - Support for .txt and .json hymn files

---

## 🙏 Credits

**Internationalization:** Community Contributors & Media Team  
**CAC Hymn Collections:** Christ Apostolic Church  
**Implementation:** HymnFlow Development Team  
**Built by:** Gloryland Baptist Church, Owode-Ede (@gbcowode), Media Team

---

## 🔗 Resources

- **Repository:** [HymnFlow on GitHub](https://github.com/ebena107/HymnFlow)
- **Latest Release:** [v2.3.1](https://github.com/ebena107/HymnFlow/releases/tag/v2.3.1)
- **Documentation:** [Setup Guide](https://github.com/ebena107/HymnFlow/blob/master/doc/SETUP.md)
- **Troubleshooting:** [Common Issues](https://github.com/ebena107/HymnFlow/blob/master/doc/TROUBLESHOOTING.md)
- **Hymn Bundle:** [Download Hymns](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle)
- **Full Changelog:** [CHANGELOG.md](https://github.com/ebena107/HymnFlow/blob/master/doc/CHANGELOG.md)

---

## 🤝 Community

### Help Us Grow
- 🌍 **Translations:** Can you help translate HymnFlow to a new language? Join our GitHub discussions!
- 📚 **Hymn Collections:** Have a hymn book you'd like to contribute? We'd love to include it!
- 🐛 **Report Issues:** Found a bug? [Open an issue](https://github.com/ebena107/HymnFlow/issues)
- 💡 **Suggest Features:** Have an idea? Share it in [Discussions](https://github.com/ebena107/HymnFlow/discussions)

---

## 📄 License

GPL-2.0 License - Same as OBS Studio. Free to use and modify for your worship services!

---

**Empowering worship teams worldwide with seamless hymn display! 🎵🌍✨**
