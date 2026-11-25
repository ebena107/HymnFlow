# OBS Forum Post — HymnFlow v2.4.1

**Target:** OBS Studio Forum → Plugins, Scripts and Tools
**Thread title:** HymnFlow — Free Hymn Lower-Third & Bible Verse Controller for Live Worship (v2.4.1)

---

## Post Body

---

**HymnFlow** is a free, browser-based OBS plugin for displaying hymn lyrics and Bible verses as animated lower-thirds during live worship services. It runs entirely from local files — no server, no internet connection, no installation required beyond extracting a ZIP.

> **Download v2.4.1:** https://github.com/ebena107/HymnFlow/releases/tag/v2.4.1

---

### How it works

HymnFlow has two parts:

- **Control Dock** — a Custom Browser Dock inside OBS where you manage hymns, plan service orders, and control live display
- **Overlay** — a 1920×1080 Browser Source that displays animated lower-third text on your stream/recording

Both communicate through `localStorage` storage events — no network traffic or backend needed. Works from `file://` URLs out of the box.

---

### What's new in v2.4.x — Service Scheduling + Bible Lookup

These two releases together bring a complete live worship workflow to HymnFlow.

---

#### 🗂️ Tabbed Dock Interface

The dock is now organized into four dedicated tabs:

- **Library** — search and browse your hymn collection; import files
- **Service** — build and manage service orders
- **Live** — verse/line navigation and display controls
- **Style** — fonts, colors, backgrounds, animation (collapsible)

Active tab is saved across sessions.

---

#### 📋 Service Order Editor

Plan your entire worship order in advance and step through it live.

**Item types you can add to a service:**
- **Hymn** — pick from your library with an inline search panel; no tab-switching
- **Scripture** — store a reference (e.g. `John 3:16`); activating it auto-loads it in Quick Scripture and sends the first verse to the overlay immediately
- **Announcement** — free-text slide for notices, events, or welcomes
- **Divider** — section label (e.g. *Offering*, *Sermon*, *Prayer*)

**Workflow highlights:**
- `+ Hymn` / `+ Scripture` / `+ Announce` / `+ Divider` each open an inline panel — no cross-tab navigation
- Existing items have an ✎ Edit button that pre-populates the form
- Unsaved-changes guard asks before discarding edits
- ↑ / ↓ reorder buttons disable at list boundaries

---

#### 📖 Bible Lookup & Quick Scripture

Import any public domain Bible translation and look up verses live during a service.

**Multi-translation support:**
- Import multiple translations (KJV, NIV, ESV, YLT, etc.) — each stored separately
- Switch between translations mid-service using the inline selector in the Live tab
- Status badge shows which translation is active and how many are loaded (`KJV ✓ (+1)`)

**Quick Scripture panel (Live tab):**
- Type any reference and press 🔍: `John 3:16`, `Ps 23`, `1 Cor 13:4-7`, `Jude 1`
- Chapter-only references (e.g. `Ps 23`, `Jude 1`) load all verses as individual navigable chunks
- Press **Display** to send the first verse to the overlay; step through with ← → — same model as hymn navigation
- Overlay title bar shows reference + translation (e.g. `Psalms 23 (KJV)`)

**Getting a Bible JSON file (free):**

Download a public-domain KJV JSON from either GitHub repository and import it via Library tab → Bible section:
- https://github.com/thiagobodruk/bible — `json/en_kjv.json` (click Raw → Save As)
- https://github.com/aruljohn/Bible-kjv — `kjv.json` (click Raw → Save As)

Or run the included Python script to download and convert automatically:
```
python scripts/bundle_bible_kjv.py
```

---

#### 📐 Overlay Auto-Fit Text

The overlay now automatically shrinks font size (2px steps, min 16px) when verse text would overflow the visible area. Long passages and announcements no longer clip at the top.

---

### Core features

- **Keyboard navigation** — arrow keys step through verses and lines; configurable lines-per-slide (1–6)
- **Smart chorus logic** — auto-inserts chorus after each verse; jump-to-chorus button
- **Customizable lower-third** — font family, size, color, bold/italic/shadow/glow, position (bottom/middle/top), background (transparent/solid/gradient), fade or slide animation
- **Import/export** — `.json`, `.txt`, `.csv` hymn files
- **9 interface languages** — English, Spanish, French, Portuguese, Swahili, Tagalog, Yoruba, Mandarin Chinese, Korean
- **Accessible** — ARIA labels, `aria-pressed`, `aria-live`, focus trapping in modals

---

### Setup (5 minutes)

**1. Download and extract**
Download `hymnflow-v2.4.1-plugin.zip` from the link above and extract to a permanent location, e.g. `C:\HymnFlow\`.

**2. Add the Custom Dock in OBS**
```
View → Docks → Custom Browser Docks
Dock Name: HymnFlow Control
URL: file:///C:/HymnFlow/obs-dock/index.html
```

**3. Add the Browser Source overlay**
```
Add Source → Browser Source
URL:    file:///C:/HymnFlow/obs-overlay/index.html
Width:  1920
Height: 1080
☑ Shutdown source when not visible
☑ Refresh browser when scene becomes active
```

**4. Import your hymns**
Library tab → Hymns section → **Import** → select a `.json` hymn file.

**5. Import a Bible translation (optional)**
Library tab → Bible section → type `KJV` → **Import JSON** → select your downloaded Bible JSON.

Pre-converted hymn collections are a [separate download](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle) (kept separate to keep the plugin under 200KB).

---

### Available hymn collections (separate download)

| File | Contents |
|------|----------|
| `cac_ghb.json` | CAC Gospel Hymn Book — 1,001 hymns (English) |
| `cac_yhb.json` | Iwe Orin CAC — 997 hymns (Yoruba) |
| `ybh.json` | Yoruba Baptist Hymnal — 650 hymns (Yoruba) |
| `nnbh.json` | The Baptist Hymnal (2008) — 325 hymns |
| `umh.json` | United Methodist Hymnal — 296 hymns |
| `fws.json` | The Faith We Sing — 46 hymns |

Download from the [hymn-bundle folder](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle) on GitHub.

---

### System requirements

- OBS Studio v27 or higher (uses Custom Browser Docks and Browser Source)
- Windows, macOS, or Linux

---

### Links

- **GitHub (source + releases):** https://github.com/ebena107/HymnFlow
- **Setup guide:** https://github.com/ebena107/HymnFlow/blob/master/doc/SETUP.md
- **Detailed usage:** https://github.com/ebena107/HymnFlow/blob/master/doc/OBS_DOCK_README.md
- **Changelog:** https://github.com/ebena107/HymnFlow/blob/master/doc/CHANGELOG.md

---

### Changelog highlights

**v2.4.1** — Multi-translation Bible lookup, Quick Scripture panel, scripture service items, overlay auto-fit, XSS fix
**v2.4.0** — Tabbed dock, service order editor, font security allowlist, ARIA accessibility pass
**v2.3.0** — 9-language i18n, CAC hymn collections, optimized hymn bundle architecture
**v2.2.0** — Smart chorus logic with auto verse→chorus→verse navigation
**v2.1.0** — OBS dock panel, import/export, customizable styling

---

*MIT licensed. Feedback and contributions welcome on GitHub.*

---

## Suggested screenshots to attach

Before posting, capture and attach:
1. The dock **Service tab** with a mixed service order (hymn + scripture + divider)
2. The dock **Live tab** showing the Quick Scripture panel with a verse looked up
3. The **lower-third overlay** displayed over a scene (verse text visible)
4. The **Library tab** showing the Bible section with a translation loaded (`KJV ✓`)
