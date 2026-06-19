# HymnFlow v2.5.0 Release Notes

**Release date:** 2026-06-19

## Summary

v2.5.0 is a major workflow release focused on two things: a complete service planning overhaul (10 fixes and features addressing every pain point a church media specialist faces on a live Sunday) and native OBS hotkey integration so the operator can control the presentation from any OBS window without clicking the dock.

---

## Service Planning — 10 Workflow Improvements

### Fixes (critical for live operation)

**1. Reordering while live no longer corrupts navigation**
The editor was mutating the live service directly (it held a reference, not a copy). Any change in the editor — reorder, delete, rename — immediately broke `currentServiceItemIndex`. Fixed with a deep copy on editor open and value-match reconciliation on save.

**2. Auto-advance to next service item after last verse**
Pressing `→` at the last verse of a hymn in a running service now automatically loads the next service item. No more manually clicking the banner arrow.

**3. Scripture references validated at add time**
Previously, a typo in a scripture reference (`"John 3:166"`) would silently create a broken service item that only failed at display time. Now validated on add against the loaded Bible, with a user-overridable confirm.

**4. Hymn deletion warns which services are affected**
Deleting a hymn previously silently removed it from all services. The confirm dialog now names every affected service so nothing is lost unexpectedly.

### New features (planning & live awareness)

**5. "Coming next" banner**
The service banner (visible when a service is loaded) now shows the type and title of the next item in real time — "Next: 📖 John 3:16". No more looking down the list to remember what comes after.

**6. Announcement label truncation preview**
Announcement text is truncated to 35 characters for display in the service list. The add/edit form now shows a live `List label: "..."` preview as you type so the cut-off is never a surprise.

**7. Past-item checkmarks**
Items before the current position dim to ~50% opacity and show a green ✓ in place of the number. The current position is immediately obvious in a 20-item service list.

**8. Duplicate service**
A **Dup** button on every service card clones it as a new service with "(Copy)" appended. The standard workflow is now: duplicate last week → update hymn titles → done.

**9. Notes / cues field on service items**
Every scripture, announcement, and divider item gains an optional internal notes field — for lighting cues, timing notes, or reminders. Notes appear italicised below the title in the editor list. They are never shown on the overlay.

**10. Drag-and-drop reorder**
Service editor items are now `draggable="true"`. Grab any item and drop it where it belongs. A visual drop-target line appears on hover. No more clicking ↑ twelve times.

---

## Global OBS Hotkeys

### Why this matters

When a media specialist is managing a live stream — watching the output preview, switching scenes, monitoring audio — they cannot always click the HymnFlow dock to give it keyboard focus. Global OBS hotkeys work from any window.

### Architecture

```
OBS global hotkey press
    ↓
OBS Python Script  (hymnflow-obs-hotkeys.py)
    ↓  BroadcastCustomEvent (obs-websocket 5.x)
HymnFlow browser dock  (ws://localhost:4455)
    ↓
dispatchHotkeyAction('next_verse') → nextVerse()
```

### Setup (one time)
1. OBS → Tools → obs-websocket Settings → Enable
2. OBS → Tools → Scripts → `+` → `scripts/hymnflow-obs-hotkeys.py`
3. OBS → Settings → Hotkeys → search "HymnFlow" → bind keys
4. HymnFlow dock → Style tab → OBS Connection → Connect

### Hotkeys registered

| OBS Hotkey Name | Action |
|---|---|
| HymnFlow: Next Verse | `nextVerse()` |
| HymnFlow: Previous Verse | `prevVerse()` |
| HymnFlow: Next Line | `nextLineWindow()` |
| HymnFlow: Previous Line | `prevLineWindow()` |
| HymnFlow: Next Service Item | `nextServiceItem()` |
| HymnFlow: Previous Service Item | `prevServiceItem()` |
| HymnFlow: Toggle Display | `toggleDisplay()` |

### Technical notes

- **Python script**: pure stdlib only (socket, hashlib, base64, json, struct, os) — no `pip install` required
- **WebSocket**: minimal client implements obs-websocket 5.x protocol including SHA-256 PBKDF2-style auth
- **Thread safety**: hotkey callbacks fire network code on a daemon thread so OBS's main loop is never blocked
- **Browser client**: uses Web Crypto API for SHA-256; subscribes to `eventSubscriptions: 1` (General events, which includes CustomEvent)
- **Auto-reconnect**: dock reconnects every 5 s on unexpected disconnect; state badge turns orange while connecting

---

## Enhanced Keyboard Shortcuts

Two new in-dock shortcuts:
- `]` or `PageDown` → Next service item
- `[` or `PageUp` → Previous service item

All existing shortcuts unchanged: `→` `←` `↓` `↑` `Space`.

---

## Persistent Bible Storage (IndexedDB)

### Problem

localStorage has a ~5 MB quota. One large Bible translation (e.g., KJV ≈ 4.5 MB uncompressed) would exceed it; two translations simultaneously was impossible. Worse, the storage error was silent — the Bible loaded for the session but was lost on OBS restart.

### Solution

Bible translations are now stored in IndexedDB (`HymnFlowBibles` database, `translations` object store). IndexedDB has no practical size limit in OBS's Chromium Embedded Framework.

**Migration**: On first load, the app checks for the two old localStorage formats (pre-v2.4.1 single key, v2.4.1 multi-key) and migrates them automatically to IndexedDB.

---

## Bible Conversion Scripts

### `scripts/convert_yoruba_bible.py`

Converts the Yoruba Bible text file (Bibeli Mimo) to HymnFlow JSON. Handles:
- Inline verse format (multiple verses per line separated by punctuation)
- Yoruba diacritics and special characters (ẹ, ọ, ṣ)
- Full 66-book coverage with Yoruba → standard 3-letter code mapping
- Result: 31,025 verses across 66 books (74 genuine versification gaps, 0.24%)

### `scripts/convert_bible_txt.py`

Generic converter for plain-text Bibles downloaded from eBible.org, Crosswire, etc. Auto-detects 4 formats:
- `verse_per_line` — `GEN 1:1 In the beginning…`
- `pipe` — `GEN|1|1|In the beginning…`
- `tab` — `GEN\t1\t1\tIn the beginning…`
- `headed` — chapter headers + verse lines

---

## Files Changed

| File | Change |
|---|---|
| `public/obs-dock/obs-dock.js` | Service fixes, obs-websocket client, keyboard shortcuts |
| `public/obs-dock/index.html` | OBS Connection panel, service banner element, notes field |
| `public/obs-dock/obs-dock.css` | Connection badge, past-item styles, drag styles, notes styles |
| `public/data/bible-lookup.js` | IndexedDB storage, migration from localStorage |
| `scripts/hymnflow-obs-hotkeys.py` | New — OBS global hotkey bridge script |
| `scripts/convert_yoruba_bible.py` | New — Yoruba Bible converter |
| `scripts/convert_bible_txt.py` | New — Generic Bible text converter |
| `public/obs-setup.html` | Full update for v2.5.0 features + Bible sources directory |
| `doc/SETUP.md` | Updated with hotkey setup, Bible sources, service planning |
| `README.md` | Updated with all new features |
| `doc/CHANGELOG.md` | Added v2.5.0 entry |
| `package.json` | Version 2.4.1 → 2.5.0 |
