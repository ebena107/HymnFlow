# OBS Forum Post — HymnFlow v2.4.0

**Target:** OBS Studio Forum → Plugins, Scripts and Tools
**Thread title:** HymnFlow — Free Hymn Lower-Third Controller for Live Worship Streams (v2.4.0)

---

## Post Body

---

**HymnFlow** is a free, browser-based OBS plugin for displaying hymn lyrics as animated lower-thirds during live worship services. It runs entirely from local files — no server, no internet connection, no installation required beyond extracting a ZIP.

> **Download v2.4.0:** https://github.com/ebena107/HymnFlow/releases/tag/v2.4.0

---

### How it works

HymnFlow has two parts:

- **Control Dock** — a Custom Browser Dock inside OBS where you search, navigate, and manage hymns and service orders
- **Overlay** — a 1920×1080 Browser Source that displays the animated lower-third text on your stream/recording

Both communicate through `localStorage` storage events, so no network traffic or backend is needed.

---

### What's new in v2.4.0 — Service Scheduling

This release adds a full **service order editor** to the dock, so you can plan your entire worship order in advance and step through it live.

**New item types in a service:**
- **Hymn** — select from your library inline, no tab-switching required
- **Scripture** — reference + verse text displayed as a text slide
- **Announcement** — free-text slide for notices, events, or welcomes
- **Divider** — section separator (e.g. *Offering*, *Sermon*, *Prayer*) with a custom label

**Inline workflow:**
- `+ Hymn` opens a search panel directly in the Service tab
- `+ Scripture / + Announce / + Divider` open a shared form with type-specific fields and placeholders
- Existing items can be edited in-place with an ✎ button
- Unsaved changes are guarded — closing the editor warns before discarding

**Tabbed dock interface** (new in v2.4):
- **Library** — browse and search your hymn collection
- **Service** — build and manage service orders
- **Live** — verse/line navigation (the main display controls)
- **Style** — fonts, colors, background, animation (collapsible)

---

### Core features

- **Keyboard navigation** — arrow keys step through verses and lines; configurable lines-per-slide (1–6)
- **Smart chorus logic** — auto-inserts chorus after each verse; jump-to-chorus button
- **Customizable lower-third** — font family, size, color, bold/italic/shadow/glow, position (bottom/middle/top), background (transparent/solid/gradient), fade or slide animation
- **Import/export** — `.json`, `.txt`, `.csv` hymn files
- **9 interface languages** — English, Spanish, French, Portuguese, Swahili, Tagalog, Yoruba, Mandarin Chinese, Korean
- **No server required** — works from `file://` URLs out of the box

---

### Setup (5 minutes)

**1. Download and extract**
Download `hymnflow-v2.4.0-plugin.zip` from the link above and extract to a permanent location, e.g. `C:\HymnFlow\`.

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
Click **Import** in the Library tab and select a `.json` hymn file. Pre-converted collections are available as a [separate download](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle) (kept separate to keep the plugin under 200KB).

---

### Available hymn collections (separate download)

| File | Contents |
|------|----------|
| `cac_ghb.json` | CAC Gospel Hymn Book — 1,000 hymns (English) |
| `cac_yhb.json` | Iwe Orin CAC — 997 hymns (Yoruba) |
| `umh.json` | United Methodist Hymnal — 966 hymns |
| `nnbh.json` | Nigerian New Baptist Hymnal — 525 hymns |
| `ybh.json` | Yoruba Baptist Hymnal — 535 hymns |
| `fws.json` | The Faith We Sing — 284 hymns |

Download any `.json` files you need from the [hymn-bundle folder](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle) on GitHub.

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

**v2.4.0** — Service scheduling, tabbed dock, fontFamily security allowlist, ARIA accessibility pass
**v2.3.0** — 9-language i18n support, CAC hymn collections, optimized hymn bundle architecture
**v2.2.0** — Smart chorus logic with auto verse→chorus→verse navigation
**v2.1.0** — OBS dock panel, import/export, customizable styling
**v2.0.0** — Initial public release

---

*MIT licensed. Feedback and contributions welcome on GitHub.*

---

## Suggested screenshots to attach

Before posting, capture and attach:
1. The dock showing the **Service tab** with a service order containing mixed item types
2. The dock **Library tab** with hymn search results
3. The **lower-third overlay** displayed on a scene (text visible over video)
4. The **Style tab** (collapsed) showing the font/color controls
