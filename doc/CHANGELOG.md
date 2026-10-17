## [2.9.0] - 2026-10-17

### Solo-operator workflow & data safety

### Added
- ⌨️ **One-key live control** — `B` blank, `C` chorus, `X` Emergency Clear, `Z` restore, `1`–`9` jump to verse, `?` cheat sheet; four new OBS global hotkeys (Blank, Emergency Clear, Show Chorus, Restore Last Slide — existing bindings are untouched)
- ↩ **Restore after Blank / Clear** — toast and button bring back the hymn position and scripture page that were on screen
- 🛡️ **End-of-item guard** — on the last verse the first Next arms the advance, the second moves to the next service item (setting: Style → Settings)
- 🔢 **Verse chips** under the verse info for direct jumps; 🔌 **hotkey status chip**; "screen goes dark" markers on dividers; Auto-display scripture toggle on the Live tab
- 🛡️ **Data safety** — unreadable stored data is quarantined instead of overwritten; a snapshot of hymns/services/settings is taken each time the dock opens; Undo for deleting a hymn or service; Style → Data & Backup exports/restores a full backup file or an automatic snapshot (OBS password never exported; a restore keeps a "before last restore" copy)

### Changed
- Native `alert()` / `confirm()` replaced by in-dock toasts and a keyboard-accessible confirm dialog

---

## [2.8.0] - 2026-07-05

### Live-Operation Reliability, Service Workflow Overhaul & Schedule Files

**Focus**: The controls can no longer misrepresent what's on the projector, the service editor renders as designed (a CSS bug had every inline panel permanently open), schedules travel as plain text files, and the dock talks back — hints, warnings, and connection alerts at the moments an operator needs them.

### Added

#### Service schedules as text files
- 📄 **Export any service as a `.txt` schedule** (per-service ⋯ menu → Export .txt) — human-readable, hand-editable format with item numbers, `Notes:` cue lines, and multi-line announcements
- 📥 **Import schedules** (Service tab → Import) — forgiving parser: untyped lines resolve as hymn (by number/title against your library) → scripture reference → announcement; unknown hymns become labelled placeholders with a warning summary; round-trip is lossless
- 💾 **Save where you choose** — exports (service schedules and the hymn-library JSON) open a native Save As dialog where the browser supports it, so you pick the folder; elsewhere they fall back to the Downloads folder and the status bar says so explicitly

#### Service editor
- 🎛️ **Cue notes on hymns** — the ✎ button now works on hymn items ("verses 1, 2, 4 only")
- 💾 **Draft autosave** — every edit snapshots to sessionStorage; a dock reload (OBS scene change, crash, F5) restores the editor exactly where you were
- 🟡 **Unsaved-changes indicator** on the Save button
- ⌨️ **Keyboard flow** — Escape closes the innermost layer first (item form → picker → editor); hymn picker gets ↑/↓/Enter navigation and a result-cap notice; Enter in the name field saves
- 🗂️ **Decluttered service rows** — Load / Edit / ⋯ (Duplicate, Export .txt, Delete); editor opens above the list; new services prefill a dated name

#### Live operation
- ⬛ **Blank Screen button** beside Emergency Clear — takes the output down without losing your place
- 📖 **Auto-display planned scripture** (opt-in, Scripture Display panel) — rehearsed services skip the confidence-preview click
- 🔔 **OBS hotkey connection alerts** — drops announced once with retry count; reconnection confirmed
- 💡 **Operator hints** — "Display is OFF" when selecting a hymn with the switch down; "Chorus next" and "shrinks to fit" in the verse info; status bar pulses on every message
- 1️⃣ **Lines per display** can now go down to 1; Text Slide panel is collapsible (moved to the Live tab)

### Fixed

- 🚨 **Display toggle could sit ON over an empty screen** — with nothing selected it now snaps back OFF and says why
- 🚨 **Overlay hide→show race** — a hide followed within 600ms by the next push blanked the fresh content (stale timer); any show now cancels the pending hide. With animation "none", hide is instant
- 🧱 **Service editor inline panels never hid** — `.item-inline-panel`'s `display:flex` overrode the `hidden` attribute, so the Add Hymn picker and Add Item form were both permanently visible; a `[hidden]` counter-rule restores the intended flow
- 🧹 **Dividers now clear the screen** — advancing to "— SERMON —" hides both overlay channels instead of leaving the last verse up
- 🌍 **i18n fallback** — `getTranslation` now always falls back to English, fixing raw keys leaking into the UI and the console warning flood
- 🔎 **Single-digit hymn search** — typing "5" finds hymn 5 exactly instead of nothing

### Technical
- Highlight regex built once per render; FONT_ALLOWLIST sync documented in both files; obs-websocket password storage documented in SECURITY.md

---

## [2.7.0] - 2026-07-03

### Scripture Lookup Reliability, Display Customization & Curated Translations

**Focus**: Quick Scripture search works every time (not just the first), operators can restyle the scripture overlay without touching code, the Style tab declutters into collapsible panels, and the full/data bundles gain six accuracy-audited public-domain translations.

### Added

#### Scripture Display customization (Style tab)
- 🎨 **New collapsible "Scripture Display" panel** — scripture projection is now operator-configurable:
  - **Scripture font** — Classic Serif (default), Georgia, Times New Roman, Inter, Segoe UI, Roboto, Montserrat, or *Same as lyrics*
  - **Italic text** toggle (default on — the classic prose look)
  - **Show reference** toggle — hides the entire 📖 reference header when off
  - **Translation badge** toggle — hides just the KJV/NIV-style badge
  - **Custom size** — optional 24–96px slider that overrides the lyric font size for scripture only
- ⚡ **Live re-push** — changing any scripture style while a verse is on screen re-sends it immediately; the dock preview mirrors the same rendering
- 🔒 All new fields are additive to the v2 overlay payload: older overlays ignore them, and absent settings render exactly the classic serif-italic look

#### Style tab declutter
- 📁 **Collapsible panels** — OBS Connection (and the new Scripture Display) fold into single header rows using native `<details>`; the connection status dot stays visible while collapsed, and open/closed state persists across sessions

#### Curated Bible translations (full/data bundles)
- 📚 **Six accuracy-audited public-domain translations** now ship in `-full` and `-data` bundles, generated by the new `scripts/scrape_bible_api.py`:
  - **KJV 1769** (`bible-en-kjv.js`) — 31,102/31,102 verses; 5,844 inline marginal notes stripped (strip proven safe: genuine KJV text contains no digits; output matches the Cambridge Paragraph text on ~15k cross-checked prose verses); pilcrows removed
  - **Revised Version 1885** (`bible-en-rv.js`) — 5 upstream Selah-truncated verses (Ps 55:19, 57:3, Hab 3:3/3:9/3:13) patched from verified RV text
  - **Literal Standard Version** (`bible-en-lsv.js`) — verified against the published LSV
  - **Geneva Bible 1599** (`bible-en-gnv.js`) — original spelling, authentic 1599 versification
  - **Douay-Rheims** (`bible-en-dra.js`) — verified faithful; note: Vulgate Psalm numbering (Psalm N ≈ Hebrew Psalm N+1)
  - **JPS 1917 Tanakh** (`bible-en-ojps.js`) — Old Testament only
- 🔬 **17 additional scraped translations rejected** for upstream defects (mid-verse footnote contamination, poetry-line truncation) — documented in the audit; the scraper retains verified per-verse patches and cleanup rules so regeneration is reproducible

### Fixed

- 🔎 **Quick Scripture lookup no longer goes dead after the first search** — the successful-lookup write-back put `John 3:16 (KJV)` in the search box, which the parser couldn't re-parse; the parser now tolerates the translation suffix and the box gets the bare reference back
- ➖ **Space-separated verse ranges parse** — `Romans 8:28 30`, `Romans 8 28 30`, and `John 3 16 18` now resolve as ranges; the parser was restructured into book + numeric-tail matching (also fixes compact forms like `1Cor 13 4 7`)
- 🕐 **Stale style settings in overlay pushes** — the settings-snapshot cache was only invalidated inside the 300ms debounced save, so any push within that window sent outdated styles; the cache now invalidates synchronously

---

## [2.6.0] - 2026-06-30

### Scripture Projection Overhaul & Overlay Reliability

**Focus**: Scripture gets its own visual identity (serif prose + reference/translation badge), the overlay survives OBS source reloads, long passages auto-paginate, the dock preview becomes true WYSIWYG, and the reference parser learns Spanish/French/Portuguese.

### Added

#### Scripture Presentation
- 📖 **Distinct scripture overlay** — scripture now renders with an italic serif body (Georgia/Times, system fonts so it works offline) and a gold reference header with a styled **translation badge** (e.g. `ROMANS 8:28 · KJV`), set apart from centered hymn lyrics
- 🎯 **WYSIWYG dock preview** — the Live-tab preview now mirrors the live overlay look (font, color, weight, background, scaled) instead of plain text, and renders scripture with the same reference header + badge
- 👁️ **Confidence preview on lookup** — looking up a reference (including activating a planned scripture item) shows a faithful styled preview *before* you push it live
- 📄 **Scripture auto-pagination** — over-long passages split into readable, fit-sized slides at word boundaries (budget scales with font size) instead of shrinking text toward illegibility; operator blank-line splits are still honored first

#### First-run experience
- 🚀 **Plug-and-play KJV** — on first launch with an empty library, the dock auto-seeds the bundled KJV into IndexedDB so scripture lookup works out of the box, no manual import. Offline-safe (loads via dynamic `<script>` injection since `file://` blocks `fetch()`) and lazy (the ~4.5 MB file loads only on that first run; subsequent loads restore from IndexedDB). A deliberately-emptied library stays empty.

#### Internationalization
- 🌍 **Localized reference parsing** — operators can type references in Spanish, French, and Portuguese (`Juan 3:16`, `Jean 3:16`, `João 3:16`, `1 Corintios 13:4`, `Éphésiens 2:8`); accents are stripped automatically and English always remains available as a fallback. Extending to more languages is a one-array addition.
- 🔤 **Times New Roman** added as an offline serif font option alongside Georgia

### Fixed

- 🛟 **Overlay no longer blanks on reload** — when OBS refreshes the browser source (scene change, cache clear, GPU recovery), the overlay now replays the last live slide from storage on load instead of going blank until the next manual push
- 🚫 **Empty title bar hidden** — announcements and blank slides no longer render a floating styled strip when there's no reference/title

### Packaging
- 📦 **Three release artifacts** — the release scripts now build:
  - `hymnflow-vX-lite.zip` — plugin + default KJV (`bible-kjv.js`) + default hymnal (`nnbh.json`); ~1.6 MB
  - `hymnflow-vX-full.zip` — plugin + all Bibles + all hymn collections
  - `hymnflow-vX-data.zip` — importable Bibles + hymn collections only, to drop into an existing install's `data/` folder
- 🧹 **Dropped the always-on `bible-kjv.js` `<script>`** — the dock used to load a 4.5 MB `window.HymnFlowBible` global on every open that the lookup engine never consumed. KJV is now loaded only once, on first run, to seed IndexedDB (see *Plug-and-play KJV* above), so normal dock startup no longer pays that cost

### Technical
- 🧱 **Versioned overlay payload (`v: 2`)** with additive scripture fields (`scriptureMode`, `reference`, `translation`); older overlays ignore them and newer overlays gracefully fall back to plain-text rendering for pre-v2 payloads
- ♻️ **Single text-slide writer** (`sendOverlayTextSlide`) — scripture, announcements, and plain text slides now share one writer; announcements/plain text are explicitly flagged non-scripture

---

## [2.5.0] - 2026-06-19

### Service Planning Overhaul & Global OBS Hotkeys

**Focus**: Complete service workflow rewrite, native OBS global hotkeys via obs-websocket, enhanced keyboard shortcuts, and persistent Bible storage via IndexedDB.

### Added

#### Service Planning
- 🔄 **Deep-copy service editing** — editor now works on an isolated copy; saving reconciles the active index by value-match so live navigation is never corrupted
- ⏭️ **Auto-advance to next service item** — pressing `→` at the last verse of a hymn in a running service automatically loads the next item
- ✅ **Scripture validation at add time** — warns if a reference doesn't parse against the loaded Bible (overridable)
- ⚠️ **Hymn deletion warning** — confirm dialog lists every service that uses the hymn before deleting
- 🏷️ **"Coming next" banner** — service banner shows the type + title of the next item in real time
- 📢 **Announcement label preview** — live `"List label: …"` hint as you type so the 35-char truncation is never a surprise
- ☑️ **Past-item checkmarks** — played items dim and show ✓ so current position is obvious in long service lists
- 📋 **Duplicate service** — one-click Dup button clones a service as a starting template for next week
- 📝 **Notes / cues field** — all non-hymn items gain an optional internal notes input; shown italicised in the editor, not on screen
- ↕️ **Drag-and-drop reorder** — service editor items are draggable; no more repeated ↑/↓ clicks

#### Global OBS Hotkeys
- 🎛️ **`scripts/hymnflow-obs-hotkeys.py`** — OBS Python Script that registers 7 hotkeys natively in OBS (appear in Settings → Hotkeys)
- 🔌 **obs-websocket client** — HymnFlow dock connects to obs-websocket 5.x; auth via Web Crypto SHA-256; auto-reconnects every 5 s
- 🟢 **OBS Connection panel** — host/port/password inputs + live status badge (grey/orange/green/red) in Style tab
- Hotkeys: Next Verse, Prev Verse, Next Line, Prev Line, Next Service Item, Prev Service Item, Toggle Display

#### Keyboard Shortcuts
- `]` / `PageDown` → Next Service Item
- `[` / `PageUp` → Previous Service Item
- (existing `↓`/`↑` retained for line-window navigation)

#### Bible
- 💾 **IndexedDB storage** — Bible translations moved from localStorage (5 MB limit) to IndexedDB (no practical limit); auto-migrates from two prior localStorage formats
- 🌍 **Yoruba Bible support** — `scripts/convert_yoruba_bible.py` converts the Yoruba Bible text file to HymnFlow JSON; handles inline verse format, diacritics, and all 66 books
- 📖 **Scripture reference parser hardened** — new abbreviations (`is`, `rm`, `dn`, `lm`, `sg`, `rv`); multi-word book names ("Song of Solomon 1:1"); compact numbered books ("1Cor 3:16"); space-as-colon shorthand ("Jn 3 16"); single-chapter book auto-remap ("Jude 24" → Jude 1:24)

### Fixed

- Reordering items while a service is live no longer corrupts `currentServiceItemIndex`
- `editingService` was a direct reference (not a copy) — mutations to the editor immediately affected the live service; now uses deep copy

### Scripts
- `scripts/hymnflow-obs-hotkeys.py` — new OBS hotkey bridge script (pure Python stdlib, no pip required)
- `scripts/convert_yoruba_bible.py` — new Yoruba-specific Bible converter
- `scripts/convert_bible_txt.py` — generic Bible converter; auto-detects 4 plain-text formats

---

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

