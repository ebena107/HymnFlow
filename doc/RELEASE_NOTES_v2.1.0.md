# 🎵 HymnFlow v2.1.0 - Major Enhancement Release

**Release Date:** January 5, 2026  
**Release Type:** Feature Release  
**Download:** [hymnflow-v2.1.0-plugin.zip](https://github.com/ebena107/HymnFlow/releases/tag/v2.1.0)

---

## ✨ What's New

HymnFlow v2.1.0 brings three significant enhancements to the dock interface, making it more powerful for professional worship leaders and A/V operators. All features requested by **Michael Fasina** community feedback.

---

## 🎯 Major Features

### 1️⃣ **Text Outline Styling** (NEW)

Add crisp text outlines (strokes) for better readability over complex backgrounds.

**Features:**

- ✅ Toggle outline on/off with checkbox
- ✅ Customizable outline color picker
- ✅ Adjustable outline width (1-5px)
- ✅ Real-time preview
- ✅ Settings persist across sessions

**Why?** When displaying hymns over video, images, or live camera feeds, text outlines provide critical contrast for readability. Shadow and glow effects work well, but outlines give the sharpest, most professional appearance.

**How to Use:**

1. Open Styles section in dock
2. Check "Outline" checkbox
3. Select outline color with color picker
4. Adjust width with slider (1-5px recommended)
5. Settings apply immediately to overlay

**Technical:** Uses `-webkit-text-stroke` for broad browser compatibility (Chrome, Edge, Firefox).

---

### 2️⃣ **Hymn Editing** (NEW)

Edit hymns directly in the dock to fix typos and make corrections without re-importing.

**Features:**

- ✅ Edit button in Hymns section (next to + Add, - Remove)
- ✅ Modal form with all hymn fields:
  - Hymn Number (optional metadata)
  - Title (required)
  - Author
  - Verses (textarea with blank-line separation)
  - Chorus (optional)
- ✅ Full validation (title and verses required)
- ✅ Preserves hymn ID (references maintained)
- ✅ Immediate UI refresh

**Why?** Typos happen. Previously, users had to:

- Delete and re-import (losing metadata)
- Manually edit localStorage JSON (error-prone)
- Live with the error

Now: One click → Edit → Save → Done!

**How to Use:**

1. Select hymn from list
2. Click "✏️ Edit" button
3. Make corrections in modal
4. Click "Save Changes"
5. Hymn updates in list and preview

**Technical:** Modal form with client-side validation, updates hymn object while preserving ID.

---

### 3️⃣ **Service/Program Scheduling** (NEW)

Pre-organize hymns for services, programs, and events. Perfect for:

- Sunday morning/evening services
- Bible study sessions
- Special events (Easter, Christmas, weddings, funerals)
- Multi-language services

**Features:**

- ✅ Create named services ("Sunday Morning - Jan 5", "New Year Service", etc.)
- ✅ Add hymns to services in sequence
- ✅ Reorder hymns with up/down buttons
- ✅ Load service to display only those hymns
- ✅ Navigate through service hymns with Previous/Next verse buttons
- ✅ All services saved to localStorage
- ✅ Delete services anytime

**Workflow:**

```text
1. Click "+ New" in Services section
2. Enter service name (e.g., "Sunday Morning")
3. Click "+ Add Hymn" to add hymns in order
4. Reorder with ↑↓ buttons if needed
5. Click "Save Service"
6. Later: Click "Load" to activate service
7. Navigate through hymns normally
```

**Why?** Worship services follow planned hymn orders. Scheduling:

- Reduces search time during live service
- Prevents accidentally selecting wrong hymn
- Works offline with no internet
- Allows planning before service starts

**Technical:** Services stored as arrays of hymn IDs in localStorage (key: `hymnflow-services`). Reordering is instant, no re-importing needed.

---

## 📋 Complete Change Log

### Added

- 🎨 Text outline styling with color and width control
- ✏️ Full hymn editor with modal form
- 🎯 Service/program scheduling system
- 📌 Service load/save functionality
- ↕️ Hymn reordering in services

### Enhanced

- Improved Styles section layout
- Better form validation
- Enhanced modal UI for editing
- Slim single-line color indicators in style controls (more compact UI)

### Fixed

- Style setting changes (including outline color/width) now update the live overlay instantly when a hymn is displayed

---

## 🔄 Migration from v2.0.x

**No breaking changes!** All existing data is compatible:

- ✅ Hymns migrate automatically
- ✅ Settings persist as-is
- ✅ No re-import needed
- ✅ Just upgrade and use

---

## 📊 Feature Comparison

| Feature | v2.0.0 | v2.0.1 | v2.1.0 |
|---------|--------|--------|--------|
| Hymn Management | ✅ | ✅ | ✅ |
| Quick Edit | ❌ | ❌ | ✅ |
| Text Outline Styling | ❌ | ❌ | ✅ |
| Service Scheduling | ❌ | ❌ | ✅ |
| Customizable Styling | ✅ | ✅ | ✅ |
| Keyboard Navigation | ✅ | ✅ | ✅ |
| Import/Export | ✅ | ✅ | ✅ |

---

## 🎬 Quick Start

### For v2.0.x Users

1. **Backup** (optional): Export hymns from dock
2. **Replace files** in your HymnFlow folder with v2.1.0 files
3. **Reload** custom dock in OBS (no reconfiguration needed)
4. **No data loss** - everything stays the same

### Trying New Features

#### Text Outline

- Open OBS Dock → Styles section
- Check "Outline" checkbox
- Pick outline color
- Set width to 2-3px for best results

#### Hymn Editing

- Select hymn from list
- Click "✏️ Edit" button
- Fix typos in modal
- Click "Save Changes"

#### Service Scheduling

- Click "+ New" in Services section
- Name your service
- Click "+ Add Hymn" to add hymns in order
- Save and load during service

---

## 🔍 Technical Details

### New Settings Keys (localStorage)

- `hymnflow-dock-settings.outline` (boolean)
- `hymnflow-dock-settings.outlineColor` (hex color)
- `hymnflow-dock-settings.outlineWidth` (number 1-5)
- `hymnflow-services` (array of service objects)

### Service Data Structure

```javascript
{
  id: "srv_${timestamp}",
  name: "Service Name",
  hymns: ["hymn_id_1", "hymn_id_2", "hymn_id_3"]
}
```

### Browser Compatibility

- ✅ Chrome/Chromium (OBS uses Chromium)
- ✅ Edge
- ✅ Firefox
- ⚠️ Safari (limited `-webkit-text-stroke` support)

---

## 🐛 Known Issues / Limitations

- None reported in beta testing
- Modal styling optimized for dock width (420px max)
- Service names limited to ~50 characters for display
- Maximum ~1000 services before localStorage limits

---

## 🆘 Support & Feedback

**Having issues?**

- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Report bugs: [GitHub Issues](https://github.com/ebena107/HymnFlow/issues/new?template=bug-report.md)
- Request features: [GitHub Issues](https://github.com/ebena107/HymnFlow/issues/new?template=feature-request.md)

**Like what you see?**

- Share feedback in [Discussions](https://github.com/ebena107/HymnFlow/discussions)
- Contribute improvements via [Pull Requests](https://github.com/ebena107/HymnFlow/pulls)

---

## 🙏 Credits

**Feature Requests by:** Michael Fasina  
**Implementation:** HymnFlow Development Team (**Gloryland Baptist Church, Owode-Ede, Nigeria**)
**Community Feedback:** Global worship leaders and A/V operators

---

## 📝 Version History

| Version | Date | Focus |
|---------|------|-------|
| v2.1.0 | Jan 5, 2026 | Editing, Outline, Scheduling |
| v2.0.1 | Jan 5, 2026 | Vertical Dock, Hymn Numbers |
| v2.0.0 | Jan 4, 2026 | Initial Stable Release |
| v1.0.0 | (archived) | Server-based version |

---

## 🔗 Resources

- **Setup Guide:** [SETUP.md](SETUP.md)
- **Troubleshooting:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Full Documentation:** [docs/](doc/)
- **Repository:** [github.com/ebena107/HymnFlow](https://github.com/ebena107/HymnFlow)

---

## 📄 License

HymnFlow v2.1.0 is released under the [GPL-2.0 License](LICENSE) - Same as OBS Studio.  
Free to use in churches, ministries, and commercial settings.

---

**Enjoy the enhanced HymnFlow experience! 🎵✨**

*Questions? Ideas? Let's build the best hymn display tool together!*
