# 🎵 HymnFlow v2.3.1 - Global Worship Enhanced

**HymnFlow** continues to evolve as the premier browser-based hymn display solution for OBS Studio. Version 2.3.1 builds on the internationalization foundation of v2.3.0 with improved documentation and user experience enhancements.

---

## 🔥 **What's New Since v2.2.0?**

### **v2.3.1 - Documentation & User Experience** (Current Release)

#### **📖 Crystal-Clear Setup Instructions**
We heard your feedback! The setup process is now clearer than ever:
- **Prominent notices** explaining that hymn files are a separate download
- **Step-by-step download instructions** with multiple options (GitHub folder or Releases page)
- **Updated documentation** across README, Setup Guide, and interactive setup wizard

#### **🎯 Why This Matters**
The v2.3.0 release separated large hymn collections (~3MB) from the core plugin (~150KB) for faster downloads. However, some users were confused about where to get hymn files. Version 2.3.1 makes this crystal clear with enhanced documentation throughout.

---

### **v2.3.0 - Internationalization & Optimization**

#### **1. Support for 9 Global Languages** 🌍
HymnFlow now speaks your language! The entire user interface is available in:
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
2. Scroll to Settings section
3. Select your language from the dropdown
4. UI updates instantly!

#### **2. Official CAC Hymn Collections** 📚
Complete, verified hymn books from Christ Apostolic Church:
- **CAC Gospel Hymn Book** (English) - 1,001 hymns
- **CAC Yoruba Hymn Book** (Iwe Orin CAC) - 997 hymns
- Plus standard collections: FWS, NNBH, UMH, YBH

**Download separately from:** [GitHub Hymn Bundle](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle)

#### **3. Optimized Architecture** ⚡
- **Core plugin:** ~150KB (lightning-fast download)
- **Hymn files:** Separate download (choose what you need)
- **No bloat:** Only download the hymn books you'll actually use

---

## 🎨 **About HymnFlow**

HymnFlow is the most streamlined way to display hymns in OBS Studio:

### **Core Features**
- 🎯 **Zero-Latency:** Pure browser localStorage communication (no server required)
- 🌍 **International:** UI in 9 languages and growing
- 🎨 **Customizable:** Control fonts, colors, outlines, shadows, and animations
- ⌨️ **Keyboard-Driven:** Arrow keys for seamless verse/line navigation
- 🔄 **Smart Chorus:** Automatic chorus display after every verse (v2.2.0+)
- 📅 **Service Scheduling:** Pre-plan your hymn order before services start
- 💾 **Persistent Storage:** Hymns saved in browser localStorage
- 📱 **Responsive:** Works on any screen size

### **What Makes HymnFlow Special?**
1. **No Server Required** - Works with `file://` protocol or any static server
2. **Real-Time Updates** - Overlay updates automatically as you navigate
3. **Visual Feedback** - Clear indicators for display state (hidden/visible)
4. **Smart Navigation** - Auto-advance between verses at line boundaries
5. **Import/Export** - Support for .txt and .json hymn files

---

## 📥 **Download & Setup**

### **Quick Start (3 Steps)**

1. **Download Plugin**
   - Get [hymnflow-v2.3.1-plugin.zip](https://github.com/ebena107/HymnFlow/releases/tag/v2.3.1) (~150KB)
   - Extract to `C:\HymnFlow\` (or your preferred location)

2. **Download Hymn Files** (Separate Download)
   - Visit [hymn-bundle folder](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle)
   - Download individual `.json` files you need
   - Or download `hymn-bundle.zip` from Releases (if available)

3. **Setup in OBS**
   - **Add Custom Dock:** View → Docks → Custom Browser Docks
     - Name: `HymnFlow Control`
     - URL: `file:///C:/HymnFlow/obs-dock/index.html`
   - **Add Browser Source:** Add Source → Browser Source
     - Name: `Hymn Lower-Third`
     - URL: `file:///C:/HymnFlow/obs-overlay/index.html`
     - Size: 1920x1080

4. **Import Hymns**
   - Click Import in the dock
   - Select your downloaded `.json` file
   - Start displaying!

---

## 📋 **Complete Changelog (v2.2.0 → v2.3.1)**

### v2.3.1 (January 14, 2026)
**Documentation Improvements**
- 📖 Enhanced README with explicit hymn bundle download instructions
- 📖 Updated SETUP guide with detailed download options
- 📖 Added prominent notices in setup wizard
- 🔢 Version bump to 2.3.1

### v2.3.0 (January 14, 2026)
**Internationalization & Optimization**
- 🌍 Multi-language support (9 languages)
- ⚙️ Interface language selector in Settings
- 💾 Persistent language preference
- 📚 CAC hymn collections (1,001 + 997 hymns)
- 📦 Optimized "Hymn Bundle" architecture
- 🎯 Reduced core plugin size to ~150KB

### v2.2.0 (January 8, 2026)
**Automatic Chorus Display**
- 🔄 Smart chorus sequencing (Verse → Chorus → Verse)
- 🏷️ Dynamic "Chorus" label in overlay
- ⏭️ Automatic transitions between verses and choruses
- ⚡ Functional "Jump to Chorus" button

---

## 🌟 **Available Hymn Collections**

All available as separate downloads:

| Collection | Hymns | Size | Language |
|------------|-------|------|----------|
| CAC Gospel Hymn Book | 1,001 | 1.18 MB | English |
| CAC Yoruba Hymn Book | 997 | 969 KB | Yoruba |
| Faith We Sing | 7 | 44 KB | English |
| Nigerian Baptist Hymnal | 7 | 352 KB | English |
| United Methodist Hymnal | 7 | 337 KB | English |
| Yoruba Baptist Hymnal | 6 | 582 KB | Yoruba |

**Download from:** https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle

---

## 🔗 **Resources**

- **Repository:** [HymnFlow on GitHub](https://github.com/ebena107/HymnFlow)
- **Latest Release:** [v2.3.1](https://github.com/ebena107/HymnFlow/releases/tag/v2.3.1)
- **Documentation:** [Setup Guide](https://github.com/ebena107/HymnFlow/blob/master/doc/SETUP.md)
- **Troubleshooting:** [Common Issues](https://github.com/ebena107/HymnFlow/blob/master/doc/TROUBLESHOOTING.md)
- **Hymn Bundle:** [Download Hymns](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle)

---

## 🤝 **Community**

### **Help Us Grow**
- 🌍 **Translations:** Can you help translate HymnFlow to a new language? Join our GitHub discussions!
- 📚 **Hymn Collections:** Have a hymn book you'd like to contribute? We'd love to include it!
- 🐛 **Report Issues:** Found a bug? [Open an issue](https://github.com/ebena107/HymnFlow/issues)
- 💡 **Suggest Features:** Have an idea? Share it in [Discussions](https://github.com/ebena107/HymnFlow/discussions)

### **Share on OBS Forums**
Help other worship teams discover HymnFlow:
- [OBS Project Forums](https://obsproject.com/forum/)
- [Resources & Plugins](https://obsproject.com/forum/resources/)

---

## 📄 **License**

GPL-2.0 License - Same as OBS Studio. Free to use and modify for your worship services!

---

## 🙏 **Acknowledgments**

Built with love for worship teams everywhere by the **Gloryland Baptist Church, Owode-Ede (@gbcowode), Media Team**.

*Empowering worship teams worldwide with seamless hymn display! 🎵🌍✨*

---

**Ready to transform your worship services? Download HymnFlow v2.3.1 today!**
