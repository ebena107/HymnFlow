## HymnFlow v2.4.1 — Bible Lookup & Multi-Translation Support

### 🎉 What's New

**Multi-Translation Bible Lookup**
- Import any Bible JSON file (KJV, NIV, ESV, etc.) via Library tab → Bible section
- Each translation stored separately in localStorage — switch between them anytime
- Translation selector in both Library tab (Set active / Remove) and Live tab inline select
- Status badge shows active translation name and count of loaded translations

**Quick Scripture Panel (Live Tab)**
- Type any reference — `Ps 23`, `John 3:16-18`, `Jude 1`, `1 Cor 13:4-7`
- Chapter-only references load all verses as individual navigable chunks
- Press Display, then step through verses with ← → (same model as hymn navigation)
- Overlay title bar shows reference + translation name (e.g., `Psalms 23 (KJV)`)

**Scripture in Service Orders**
- `+ Scripture` stores reference only — no pre-cached text
- Activating a scripture item auto-switches to Live tab, loads the reference into Quick Scripture, and sends verse 1 to overlay immediately

**Overlay Auto-Fit Text**
- Overlay shrinks font size (2px steps, min 16px) when content would overflow the viewport
- Applies to hymn verses, scripture, and announcements

**Security**
- XSS fix: translation names escaped via `escapeHtml()` before DOM insertion

**Bug Fixes**
- Chapter-only references (`Jude 1`, `Ps 23`) now resolve correctly
- Overlay text no longer clips when verse text exceeds configured font size
- Stale "run python script" error message replaced with user-facing guidance
- Removed always-hidden dead button (`btnItemFormLookup`)

**i18n**
- `bible.*` and `quickScripture.*` keys added to all 9 languages (en, es, fr, ko, pt, sw, tl, yo, zh)

### 📥 Installation

1. Download `hymnflow-v2.4.1-plugin.zip` below
2. Extract to a folder (e.g., `C:\HymnFlow\`)
3. In OBS: **View → Docks → Custom Browser Docks**
   - URL: `file:///C:/HymnFlow/obs-dock/index.html`
4. Add Browser Source (1920×1080): `file:///C:/HymnFlow/obs-overlay/index.html`

To import a Bible translation: Library tab → Bible → enter name (e.g. `KJV`) → **Import JSON**

See [SETUP.md](https://github.com/ebena107/HymnFlow/blob/master/doc/SETUP.md) for full instructions.

### 📦 Hymn Bundle

Hymn collections are a **separate download** (keeps plugin at ~150KB). Download from the [hymn-bundle folder](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle).

### 📚 Documentation

- [README](https://github.com/ebena107/HymnFlow) — Overview
- [SETUP.md](https://github.com/ebena107/HymnFlow/blob/master/doc/SETUP.md) — Quick start
- [OBS_DOCK_README.md](https://github.com/ebena107/HymnFlow/blob/master/doc/OBS_DOCK_README.md) — Detailed usage
- [CHANGELOG.md](https://github.com/ebena107/HymnFlow/blob/master/doc/CHANGELOG.md) — Full version history
- [RELEASE_NOTES_v2.4.1.md](https://github.com/ebena107/HymnFlow/blob/master/doc/RELEASE_NOTES_v2.4.1.md) — Detailed release notes

### 📄 License

MIT — Free to use and modify
