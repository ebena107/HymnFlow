## [2.4.1] - 2026-06-18

### Bible Lookup & Scripture Workflow Improvements

**Focus**: Bundled KJV Bible lookup, Quick Scripture panel, auto-fit overlay text, and service-integrated scripture navigation.

### Added

- 📖 **Multi-translation Bible support** — import any Bible JSON file (KJV, NIV, ESV, etc.) via Library tab; each translation stored separately in localStorage under `hymnflow-bible-data-{NAME}`; active translation persisted in `hymnflow-bible-active`
- 🔄 **Translation switcher** — Library tab shows all loaded translations with Set Active / Remove buttons; Quick Scripture panel has a compact inline select to switch mid-service
- 🔍 **Quick Scripture panel** (Live tab) — type any reference (`Ps 23`, `John 3:16`, `Jude 1:1-5`), press 🔍 to look up, step through verses with ← → chunk navigation
- 📑 **Chapter-only lookup** — `Jude 1`, `Ps 23`, `Gen 1` load all verses of the chapter as individual navigable chunks
- 🗂️ **Bible section card** in Library tab — status badge shows active translation + count; name input auto-derives from filename when blank
- ⛪ **Scripture service items** — reference-only; activating a scripture item auto-switches to Live tab and loads it into Quick Scripture for chunk navigation
- 🔗 **Scripture reference in overlay title bar** — reference string + translation name shows above verse text on the overlay
- 📐 **Auto-fit text** — overlay shrinks font size automatically (2px steps, min 16px) when content would overflow viewport; applies to both hymns and scripture
- 🌍 **i18n** — `bible.*` and `quickScripture.*` keys added to all 9 languages (en, es, fr, ko, pt, sw, tl, yo, zh)
- `scripts/bundle_bible_kjv.py` — Python generator for offline KJV bundle creation (optional; any Bible JSON importable via the Import button)

### Changed

- Scripture service items now store reference only (no text); text is fetched live from Bible data on activation
- `+ Scripture` service item form simplified to reference-only input
- Activating a scripture service item navigates to Live tab instead of firing directly to overlay

### Fixed

- Chapter-only references (`Jude 1`, `Ps 23`) now resolve correctly — previously required explicit verse number
- "Bible not loaded" status message now directs users to Import button instead of Python script

---

## [2.4.0] - 2026-06-18

### 🎨 Major UX Overhaul — Tabbed Dock & Full Service Scheduling

**Focus**: Tabbed dock interface, complete service editor rewrite with inline panels, fontFamily security allowlist, and ARIA accessibility pass.

### Added

- 🗂️ **Tabbed dock** — Library, Service, Live, Style tabs; active tab persisted in settings
- 📋 **Service item types** — Scripture, Announcement, and Divider items alongside hymns
- 🔍 **Inline hymn picker** — search panel opens inside Service tab (`+ Hymn`), no cross-tab navigation
- ✏️ **Inline item form** — shared form panel for Scripture/Announce/Divider; correct titles, placeholders, and submit labels per type
- ✎ **Inline editing** — non-hymn items have an Edit button; form pre-populates with existing content
- 💾 **Unsaved-changes guard** — `confirm()` dialog when closing service editor with pending changes
- 🔒 **Font allowlist** — `safeFont()` in overlay.js validates `fontFamily` against 5 known-safe values; closes localStorage CSS-injection vector
- ♿ **ARIA completeness** — `aria-label`, `aria-pressed`, `aria-current`, `role="list/listitem"`, `aria-live` across all panels
- 🌍 **i18n keys** — `lastVerse`, `lastChorus`, service `addButtons`, `banner`, `alerts`, `status`, `itemForm` keys (all 9 languages)

### Changed

- ↑↓ Reorder buttons disabled at list bounds
- Subtitle updated to "Lower-third controller for OBS HYMN by @gbcowode"
- Style tab collapsible; language selector moved to bottom of Style tab
- GitHub Actions release now includes `public/i18n/`, `obs-setup.html`, `validation.js` (previously missing)
- `actions/upload-artifact@v3` → `v4`
- Release scripts no longer call `combine_translations.py` (would have wiped v2.4 keys)
- Release scripts now create annotated git tag

### Fixed

- Crash opening service editor for a deleted service (`null` guard on `editingService`)
- Variable shadowing in `renderHymnPicker` (`filtered` local vs. module-level state)
- `navigation.lastVerse`/`navigation.lastChorus` returning raw key strings (missing from `translations.js`)
- Item form title div rendering an empty border line when no content was set

---

## [2.3.1] - 2026-01-14

### 📝 Documentation Clarification Release

**Focus**: Improved documentation to clarify that hymn collections are a separate download.

### Changed

- 📖 Updated `README.md` with explicit hymn bundle download instructions
- 📖 Updated `doc/SETUP.md` with detailed download options (GitHub folder or Releases)
- 📖 Updated `public/obs-setup.html` with prominent notice that hymn files are separate downloads
- 🔢 Bumped version to 2.3.1 in `package.json` and all HTML files
- 📋 Created `RELEASE_NOTES_v2.3.1.md` documenting the changes

### Notes

- No functional changes to the application
- Plugin download remains ~150KB (hymn files not included)
- All hymn files available at: https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle

---

## [2.3.0] - 2026-01-14

### 🌍 Internationalization (i18n) & Optimized Data

**Major Features**: HymnFlow now supports 9 languages for the user interface and features an optimized "Hymn Bundle" architecture.

### Added

- 🌍 Multi-language support for 9 languages: English, Spanish, French, Portuguese, Swahili, Tagalog, Yoruba, Mandarin Chinese, and Korean.
- ⚙️ Interface Language selector in Settings.
- 💾 Persistent language preference (saved in localStorage).
- 🧩 New i18n module for dynamic label switching without page reloads.
- 📚 **CAC Hymn Collections**: Complete conversion of Christ Apostolic Church (CAC) hymns:
  - Gospel Hymn Book (English): 1000 hymns.
  - Iwe Orin CAC (Yoruba): 997 hymns.
- 📦 **Hymn Bundle**: Moved large JSON collections out of the core plugin to reduce download size (from ~3MB to ~150KB).

### Changed

- Updated `SETUP.md` and `obs-setup.html` with external data import instructions.
- Optimized `parse_cac_hymns.py` with robust preamble/verse disambiguation for high-quality titles.

---

## [2.2.0] - 2026-01-08

### 🔄 Automatic Chorus Logic

**Major Feature**: Hymns with choruses now follow a smart navigation sequence (Verse -> Chorus -> Next Verse).

### Added

- 🔄 Smart navigation sequence: automatically inserts chorus after every verse.
- 🏷️ Dynamic "Chorus" label in OBS Overlay title bar.
- ⏭️ Automatic line-boundary transitions between verses and choruses.
- ⚡ Fully functional "Jump to Chorus" navigation in dock.

---

## [2.1.0] - 2026-01-05

### ✨ Interface & Styling Enhancements

### Added

- 🎨 Text outline (stroke) styling with customizable color and width.
- ✏️ Built-in hymn editor modal for quick corrections.
- 🎯 Service/Program scheduling system to pre-organize hymn orders.

### Changed

- Compact UI for style controls with single-line color indicators.
- Improved form validation for hymn editing and adding.

---

### 🎯 Major Streamlining Release

**BREAKING CHANGES**: Removed server version, simplified to browser-only OBS dock/overlay approach.

### Added

- 👁️ Visual feedback for Display toggle button (icons, colors, pulsing animation)
- 📱 Responsive design for vertical/narrow displays
- 🎯 Smart verse navigation (auto-advance between verses at line boundaries)
- 🔄 Real-time auto-update on all navigation actions
- ⌨️ Enhanced keyboard shortcuts with seamless navigation

### Changed

- Combined Show/Hide into single Display toggle button
- Streamlined project to OBS dock/overlay only (removed server version)
- Updated all documentation for simplified architecture
- Improved button styling with state indicators
- Enhanced UX with clear visual feedback

### Removed

- Server version (Node.js/Express/WebSocket)
- Old control/display files
- Migration documentation
- Node.js dependencies
- All server-related code and documentation

### Technical Details

**Project Structure (Simplified)**:

```text
public/
├── obs-dock/         # Control panel
├── obs-overlay/      # Display overlay
├── data/             # Default hymns
├── parsers/          # File parsers
└── obs-setup.html    # Setup wizard
```

**Communication**: Pure browser localStorage events (no server required)

**Deployment**: Works with `file://` protocol or any static file server

---

## [1.0.0] - Initial Release

- Two-version architecture (server + client-side)
- WebSocket-based real-time communication
- Basic hymn management and display

