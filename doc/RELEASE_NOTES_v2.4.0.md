# HymnFlow v2.4.0 — Release Notes

**Release Date:** 2026-06-18

---

## 🎉 What's New in v2.4.0

This release is a major UX overhaul of the dock control panel, focused on making service scheduling a first-class feature with a clean, keyboard-friendly interface.

---

## 🗂️ Tabbed Dock Interface

The dock is now organized into four dedicated tabs to reduce scrolling and surface controls more clearly:

- **Library** — Search and browse hymns; add to current service
- **Service** — Create, manage, and load service orders
- **Live** — Verse/line navigation and display controls (formerly the main view)
- **Style** — Fonts, colors, backgrounds, and animations (collapsible; moved to bottom)

Active tab is persisted across sessions.

---

## 📋 Service Editor — Full Rewrite

The service order editor now supports any type of worship item and provides a complete inline editing workflow.

### New item types

Beyond hymns, you can now add to a service:
- **Scripture** — reference + verse text (sent to text-slide channel)
- **Announcement** — free-text slide (sent to text-slide channel)
- **Divider** — section separator with a custom label (e.g., Offering, Sermon, Prayer)

### Inline panels — no cross-tab navigation

- **+ Hymn** opens an inline search panel directly in the Service tab; no need to switch to Library
- **+ Scripture / + Announce / + Divider** open a shared inline item form with the correct fields, titles, and placeholders per type
- Only one panel is visible at a time; dismissing with Cancel or Escape hides it cleanly

### Inline editing of existing items

Non-hymn items (Scripture, Announcement, Divider) show an **✎ Edit** button. Clicking it re-opens the item form pre-populated with existing content and switches the submit button label to **Save**.

### Unsaved-changes guard

If you close the service editor with unsaved changes, a confirmation dialog asks whether to discard them, preventing accidental data loss.

### Reorder improvements

↑ / ↓ reorder buttons are now disabled at the list boundaries, preventing out-of-bounds errors and giving clear visual feedback.

### Status messages

Live status text is shown when:
- A service is loaded (`Loaded: Name (N item(s))`)
- A hymn is deleted from the library (`Hymn deleted (N service(s) updated)`)
- A divider is activated (`▸ Section label`)

---

## 🔒 Security Fix — Font Allowlist

The overlay now validates the `fontFamily` setting from `localStorage` against an explicit allowlist of 5 known-safe values. Tampered or injected font strings fall back to `Inter, sans-serif` rather than being applied verbatim to CSS. This closes a stored-XSS vector via localStorage manipulation.

---

## ♿ Accessibility Improvements

- All interactive buttons have meaningful `aria-label` attributes
- Service banner prev/next buttons have `aria-label` ("Previous item in service", "Next item in service")
- Toggle buttons use `aria-pressed` (true/false) — hymn picker, add buttons, source filter chips
- Service and hymn lists use `role="list"` / `role="listitem"`
- Active items carry `aria-current="true"`
- Verse info area uses `aria-live="polite" aria-atomic="true"`
- Focus is trapped inside modals using `AbortController`-cleaned keydown listeners

---

## 🌍 i18n Additions

New translation keys added (all 9 languages):
- `navigation.lastVerse` / `navigation.lastChorus` — end-of-verse/chorus indicator
- `services.addButtons.*` — type-specific add button labels
- `services.banner.prevItem` / `services.banner.nextItem` — service navigation
- `services.alerts.itemRequired` — validation message
- `services.status.loaded` / `services.status.hymnDeleted` / `services.status.divider`
- `services.itemForm.*` — form titles, field placeholders, and submit button labels per item type

Subtitle updated in all languages: **"Lower-third controller for OBS HYMN by @gbcowode"**

---

## 🛠️ Release Infrastructure Fixes

- **GitHub Actions**: Release ZIP now correctly includes `public/i18n/`, `public/obs-setup.html`, and `public/validation.js` (previously omitted — would have shipped a broken app)
- **Actions version**: `upload-artifact@v3` → `v4`
- **release.bat / release.sh**: Removed erroneous `combine_translations.py` call that would have wiped all v2.4 translation keys on release
- **release scripts**: Now create an annotated git tag as part of the release process

---

## 📥 Installation

1. Download `hymnflow-v2.4.0-plugin.zip` from the Releases page
2. Extract to a location on your computer (e.g., `C:\HymnFlow\`)
3. In OBS: **View → Docks → Custom Browser Docks**
   - URL: `file:///C:/HymnFlow/obs-dock/index.html`
4. Add Browser Source (1920×1080):
   - URL: `file:///C:/HymnFlow/obs-overlay/index.html`

See [SETUP.md](SETUP.md) for full setup instructions.

---

## 📦 Hymn Bundle

The hymn collections remain a **separate download** to keep the plugin lightweight (~150KB). Download from the [hymn-bundle folder](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle) on GitHub.

---

## 🐛 Bug Fixes

- Fixed crash when opening a service editor for a deleted service (null guard on `editingService`)
- Fixed variable shadowing in `renderHymnPicker` (`filtered` local vs. module-level state)
- Fixed `navigation.lastVerse` / `navigation.lastChorus` returning raw key strings (keys were in `en.json` but missing from the loaded `translations.js`)
- Fixed item form title border rendering as an empty line when no title was set (CSS `:empty` + static fallback text)

---

## 📋 Full Changelog

See [CHANGELOG.md](CHANGELOG.md) for complete version history.
