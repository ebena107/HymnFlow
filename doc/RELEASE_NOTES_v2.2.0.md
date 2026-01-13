# 🎵 HymnFlow v2.2.0 - Chorus Display Release

**Release Date:** January 8, 2026  
**Release Type:** Feature Release  
**Download:** [hymnflow-v2.2.0-plugin.zip](https://github.com/ebena107/HymnFlow/releases/tag/v2.2.0)

---

## ✨ What's New

HymnFlow v2.2.0 introduces a highly requested feature: **Automatic Chorus Display**. This update transforms the navigation experience, ensuring that hymns with choruses are displayed correctly and efficiently during live worship services.

---

## 🎯 Major Features

### 1️⃣ **Automatic Chorus Sequencing** (NEW)

HymnFlow now understands the natural flow of a hymn. When a hymn has a chorus, the system automatically inserts it into the navigation sequence after every verse.

**Features:**

- ✅ **Smart Sequencing:** Navigating "Next" now follows the logical order: `Verse 1` → `Chorus` → `Verse 2` → `Chorus` ...
- ✅ **Dynamic Labeling:** The OBS Overlay now displays a clear "**Chorus**" label instead of a verse number when the chorus is active.
- ✅ **Seamless Reversion:** "Previous" navigation correctly steps back through the sequence, allowing you to return to the preceding verse or chorus perfectly.
- ✅ **Boundary Awareness:** Line-by-line navigation (Up/Down arrows) automatically transitions between verses and choruses without manual intervention.

**Why?** In many worship traditions, the chorus is sung after every verse. Previously, users had to manualy navigate back to the chorus or add it manually multiple times. Now, it's automatic.

---

### 2️⃣ **Functional "Jump to Chorus"** (ENHANCED)

The "**Jump to Chorus**" button has been fully implemented.

**Features:**

- ✅ Instant transition to the chorus from any verse.
- ✅ Auto-updates both the preview and the live OBS overlay.
- ✅ Smart state management: The system knows you are now in the "Chorus" state for subsequent navigation.

---

## 📋 Complete Change Log

### Added

- 🔄 Automatic chorus insertion in navigation flow.
- 🏷️ "Chorus" label in OBS Overlay title bar.
- ⏭️ Smart line-boundary transitions between verses and choruses.

### Enhanced

- ⚡ "Jump to Chorus" button implementation.
- 🧠 State management for tracking verse/chorus status.

---

## 🔄 Migration from v2.1.x

**No breaking changes!** All existing hymns and settings are fully compatible.

---

## 🎬 Quick Start

1. **Select a Hymn** with a chorus from your library.
2. **Navigate** using the Right Arrow (Next Verse).
3. **Observe** that the Chorus appears automatically after Verse 1.
4. **Use "Jump to Chorus"** whenever you need to skip directly to the refrain.

---

## 🙏 Credits

**Feature Request:** Community Feedback  
**Implementation:** HymnFlow Development Team  

---

**Enjoy the improved worship experience with HymnFlow! 🎵✨**
