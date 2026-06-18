# HymnFlow v2.4.1 — Release Notes

**Release Date:** 2026-06-18

---

## 🎉 What's New in v2.4.1

This release adds a fully integrated Bible lookup workflow to HymnFlow — from service planning through live projection — with multi-translation support, automatic overlay text-fitting, and a complete Quick Scripture panel for real-time verse display.

---

## 📖 Multi-Translation Bible Lookup

HymnFlow now supports importing and switching between multiple Bible translations in a single session.

### How it works

1. Open the **Library** tab → **Bible** section
2. Type a short name (e.g. `KJV`, `NIV`, `ESV`) in the name field — or leave it blank to auto-derive from the filename
3. Click **Import JSON** and select a Bible JSON file
4. Repeat for additional translations

Each translation is stored separately in `localStorage` (`hymnflow-bible-data-{NAME}`). Translations persist across sessions until manually removed.

### Switching translations

- In the **Library** tab: use the **Set active** button next to any loaded translation
- In the **Live** tab: use the compact inline selector next to the scripture reference field — switch mid-service without leaving Live tab

### Status badge

The Bible card header shows the active translation name and how many others are loaded:
- `KJV ✓` — one translation loaded
- `KJV ✓ (+1)` — two loaded, KJV is active

### Removing a translation

Click the **✕** button next to any translation in the Library tab. If that translation was active, the next available one is automatically set as active.

---

## 🔍 Quick Scripture Panel (Live Tab)

A dedicated panel in the Live tab for real-time, ad-hoc verse display — for when the pastor calls a reference during service that wasn't in the service order.

### Lookup

Type a reference in the **Scripture** field and press 🔍 or **Enter**:

```
John 3:16        → single verse
John 3:16-18     → verse range
Ps 23            → entire Psalm 23 (all 6 verses)
Jude 1           → entire book of Jude (25 verses)
1 Cor 13:4-7     → numbered book + range
```

Chapter-only references (no verse number) load all verses of that chapter as individual navigable chunks.

### Display and navigation

After lookup, the verse text fills the text area. Press **Display** to send the first chunk to the overlay. Use **←** / **→** to step through verses one at a time — the same navigation model as hymn verses.

The overlay title bar shows the reference and translation (e.g., `Psalms 23 (KJV)`).

### Clear

**Clear** hides the overlay text slide and resets the panel state.

---

## ⛪ Scripture in Service Orders

Scripture items in a service order now store the **reference only** — no pre-cached verse text.

### Adding a scripture item

In the **Service** editor: click **+ Scripture** → type a reference (`Ps 23`, `John 3:16`, etc.) → click **Add Scripture**.

### Activating during service

Clicking a scripture item in the service list:
1. Switches to the **Live** tab automatically
2. Loads the reference into the Quick Scripture panel
3. Triggers a lookup against the active translation
4. Sends verse 1 (or chunk 1) to the overlay immediately

From there, use ← → to step through the remaining verses.

> **Note:** Bible data must be imported in the Library tab before scripture service items can be displayed.

---

## 📐 Overlay Auto-Fit Text

The overlay now automatically reduces the font size when verse text would overflow the visible area.

- Shrinks in 2px steps from the configured font size
- Minimum floor: 16px (text never becomes unreadable)
- Applies to both hymn verses and scripture / announcement text slides

This prevents long verses or announcements from being clipped at the top of the overlay.

---

## 🔒 Security Fix

`renderBibleList()` now runs all translation names through `escapeHtml()` before inserting them into the DOM, preventing XSS if a crafted translation name is imported.

---

## 🌍 i18n

New translation keys added across all 9 supported languages (en, es, fr, ko, pt, sw, tl, yo, zh):

- `bible.title` / `bible.label` / `bible.description` / `bible.importButton` / `bible.loading` / `bible.notLoaded`
- `quickScripture.title` / `.hint` / `.refPlaceholder` / `.textPlaceholder` / `.lookupButton` / `.displayButton` / `.clearButton` / `.status` / `.statusNoRef`

---

## 📥 Installation

1. Download `hymnflow-v2.4.1-plugin.zip` from the Releases page
2. Extract to a location on your computer (e.g., `C:\HymnFlow\`)
3. In OBS: **View → Docks → Custom Browser Docks**
   - URL: `file:///C:/HymnFlow/obs-dock/index.html`
4. Add Browser Source (1920×1080):
   - URL: `file:///C:/HymnFlow/obs-overlay/index.html`

See [SETUP.md](SETUP.md) for full setup instructions.

### Importing a Bible translation

A KJV JSON file can be generated locally:

```
python scripts/bundle_bible_kjv.py
```

This downloads the public domain KJV text and writes `public/data/bible-kjv.js`. Import it using the **Import JSON** button in the Library tab → Bible section.

Any compatible Bible JSON file (raw array format from thiagobodruk/aruljohn, or HymnFlow format) can be imported the same way.

---

## 📦 Hymn Bundle

The hymn collections remain a **separate download** to keep the plugin lightweight (~150KB). Download from the [hymn-bundle folder](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle) on GitHub.

---

## 🐛 Bug Fixes

- Fixed chapter-only references (`Jude 1`, `Ps 23`) returning nothing — verse number is now optional
- Fixed overlay text clipping when font size produces content taller than the viewport
- Fixed stale "run python script" error message shown to end-users when Bible is not loaded
- Fixed XSS vector in translation name rendering (`escapeHtml` now applied)
- Removed dead `btnItemFormLookup` code (button was always hidden, handler was unreachable)

---

## 📋 Full Changelog

See [CHANGELOG.md](CHANGELOG.md) for complete version history.
