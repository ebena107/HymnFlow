# 🎵 HymnFlow v2.3.1 - Documentation Clarification Release

**Release Date:** January 14, 2026  
**Release Type:** Patch Release  
**Download:** [hymnflow-v2.3.1-plugin.zip](https://github.com/ebena107/HymnFlow/releases/tag/v2.3.1)

---

## 📋 What's New

HymnFlow v2.3.1 is a documentation-focused release that clarifies the **Hymn Bundle** download process. No functional changes were made to the application.

---

## 📝 Changes

### Documentation Improvements

**Clarified Hymn Bundle Separation**
- Updated all documentation to clearly state that hymn collections are **NOT included** in the main plugin download
- Added explicit download instructions for obtaining hymn files from GitHub
- Provided two download options:
  - Individual file download from the [hymn-bundle folder](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle)
  - Bulk download from Releases page (when available)

**Updated Files:**
- `README.md` - Enhanced Quick Start section with separate hymn bundle download step
- `doc/SETUP.md` - Added detailed download instructions with multiple options
- `public/obs-setup.html` - Updated to clarify download cards are separate downloads
- Version bumped to 2.3.1 in `package.json` and all HTML files

---

## 🎯 Why This Update?

The v2.3.0 release successfully separated the large hymn collections (~3MB) from the core plugin (~150KB) to improve download speeds. However, some users were confused about where to get the hymn files. This release makes the download process crystal clear.

---

## 📦 What's Included in the Plugin Download?

The `hymnflow-v2.3.1-plugin.zip` contains:
- ✅ OBS Dock control panel
- ✅ OBS Overlay display
- ✅ i18n translations (9 languages)
- ✅ Setup guide and documentation
- ❌ **NOT included:** Hymn data files (separate download)

---

## 📥 How to Get Hymn Files

**Option 1: Download Individual Files**
1. Visit [hymn-bundle folder](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle) on GitHub
2. Click on the hymn file you want (e.g., `cac_ghb.json`)
3. Download the raw file
4. Import into HymnFlow using the Import button

**Option 2: Download from Releases**
1. Visit the [Releases page](https://github.com/ebena107/HymnFlow/releases)
2. Download `hymn-bundle.zip` (if available)
3. Extract and import files

---

## 🔄 Migration from v2.3.0

No changes required! This is purely a documentation update. If you already have v2.3.0 working, you don't need to update unless you want the latest documentation.

---

## 🌍 Available Hymn Collections

- **CAC Gospel Hymn Book** (English) - 1,001 hymns - 1.18 MB
- **CAC Yoruba Hymn Book** (Yoruba) - 997 hymns - 969 KB
- **Faith We Sing** - 7 hymns - 44 KB
- **Nigerian Baptist Hymnal** - 7 hymns - 352 KB
- **United Methodist Hymnal** - 7 hymns - 337 KB
- **Yoruba Baptist Hymnal** - 6 hymns - 582 KB

All available at: https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle

---

**Making HymnFlow easier to use for worship teams worldwide! 🎵✨**
