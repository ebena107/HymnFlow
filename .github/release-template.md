## HymnFlow v2.4.0 — Release Notes

### 🎉 What's New

Major UX overhaul of the dock control panel with full service scheduling support.

**Tabbed Dock Interface**
- Four tabs: Library, Service, Live, Style — reduces scrolling and organizes controls clearly
- Active tab persisted across sessions

**Service Editor Rewrite**
- Add any worship item type: Hymn, Scripture, Announcement, or Divider
- Inline hymn picker opens within the Service tab — no cross-tab navigation
- Inline item form with correct titles, placeholders, and submit labels per type
- Edit existing items inline with pre-populated fields
- Unsaved-changes guard prevents accidental data loss on close
- ↑/↓ reorder buttons disabled at list bounds

**Security**
- Font family allowlist in overlay.js — tampered `fontFamily` values in localStorage fall back to safe default, closing a CSS injection vector

**Accessibility**
- `aria-label` on all interactive buttons
- `aria-pressed` on toggle buttons and source filter chips
- `role="list/listitem"` on service and hymn lists
- `aria-current` on active items
- `aria-live` on verse info area

**i18n**
- New keys: `lastVerse`, `lastChorus`, service add buttons, banner labels, item form titles/placeholders/buttons
- Subtitle updated in all 9 languages: "Lower-third controller for OBS HYMN by @gbcowode"

**Bug Fixes**
- Fixed crash opening service editor for a deleted service
- Fixed variable shadowing in hymn picker rendering
- Fixed `lastVerse`/`lastChorus` returning raw key strings
- Fixed item form title rendering an empty border line

### 📥 Installation

1. Download `hymnflow-v2.4.0-plugin.zip` below
2. Extract to a folder (e.g., `C:\HymnFlow\`)
3. In OBS: **View → Docks → Custom Browser Docks**
   - URL: `file:///C:/HymnFlow/obs-dock/index.html`
4. Add Browser Source (1920×1080): `file:///C:/HymnFlow/obs-overlay/index.html`

See [SETUP.md](https://github.com/ebena107/HymnFlow/blob/master/doc/SETUP.md) for full instructions.

### 📦 Hymn Bundle

Hymn collections are a **separate download** (keeps plugin at ~150KB). Download from the [hymn-bundle folder](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle).

### 📚 Documentation

- [README](https://github.com/ebena107/HymnFlow) — Overview
- [SETUP.md](https://github.com/ebena107/HymnFlow/blob/master/doc/SETUP.md) — Quick start
- [OBS_DOCK_README.md](https://github.com/ebena107/HymnFlow/blob/master/doc/OBS_DOCK_README.md) — Detailed usage
- [TROUBLESHOOTING.md](https://github.com/ebena107/HymnFlow/blob/master/doc/TROUBLESHOOTING.md) — Common issues
- [CHANGELOG.md](https://github.com/ebena107/HymnFlow/blob/master/doc/CHANGELOG.md) — Full version history

### 📄 License

MIT — Free to use and modify
