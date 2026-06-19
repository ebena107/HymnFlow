## HymnFlow v2.5.0 — Service Planning Overhaul & Global OBS Hotkeys

### 🎉 What's New

**Service Planning — 10 workflow improvements**
- Deep-copy service editor: editing a live service no longer corrupts navigation
- `→` at last verse auto-advances to the next service item
- Scripture references validated at add time (overridable)
- Deleting a hymn warns which services will be affected
- "Coming next" preview in the service banner
- Live announcement label hint (35-char truncation preview)
- Past items show ✓ and dim so current position is obvious
- Duplicate service with one click — clone last week as a template
- Notes/cues field on every item (internal only; not shown on screen)
- Drag-and-drop reorder in the service editor

**Global OBS Hotkeys**
- New file: `scripts/hymnflow-obs-hotkeys.py` — drop into OBS → Tools → Scripts
- 7 hotkeys registered in OBS Settings → Hotkeys (search "HymnFlow")
- Works via obs-websocket 5.x (built into OBS 28+) — no extra plugin needed
- HymnFlow dock connects to obs-websocket; auto-reconnects on OBS restart
- Pure Python stdlib — no `pip install` required

**Enhanced Keyboard Shortcuts** (dock focus)
- `]` / `PageDown` → Next service item
- `[` / `PageUp` → Previous service item
- All existing shortcuts retained (`→` `←` `↓` `↑` `Space`)

**Persistent Bible Storage**
- Bible translations moved from localStorage (5 MB limit) to IndexedDB
- Survives OBS restarts reliably; auto-migrates from prior formats

**Yoruba Bible Support**
- `scripts/convert_yoruba_bible.py` converts the Yoruba Bible text to HymnFlow JSON
- Handles inline verse format, diacritics, all 66 books

---

### 📥 Installation

1. Download `hymnflow-v2.5.0-plugin.zip` below and extract to a permanent folder (e.g., `C:\HymnFlow\`)
2. In OBS: **View → Docks → Custom Browser Docks**
   - URL: `file:///C:/HymnFlow/obs-dock/index.html`
3. Add Browser Source (1920×1080): `file:///C:/HymnFlow/obs-overlay/index.html`

**Optional — Global Hotkeys:**
1. OBS → Tools → obs-websocket Settings → Enable
2. OBS → Tools → Scripts → `+` → `scripts/hymnflow-obs-hotkeys.py`
3. OBS → Settings → Hotkeys → search "HymnFlow" → bind keys
4. HymnFlow dock → Style tab → OBS Connection → Connect

---

### 📦 Downloading Bible Translations

Bible data is **not bundled** — import free public-domain JSON files:

| Translation | Language | Source |
|---|---|---|
| KJV | English | [thiagobodruk/bible](https://github.com/thiagobodruk/bible/blob/master/json/en_kjv.json) |
| ASV | English | [thiagobodruk/bible](https://github.com/thiagobodruk/bible/blob/master/json/en_asv.json) |
| RVR | Spanish | [thiagobodruk/bible](https://github.com/thiagobodruk/bible/blob/master/json/es_rvr.json) |
| Almeida | Portuguese | [thiagobodruk/bible](https://github.com/thiagobodruk/bible/blob/master/json/pt_aa.json) |
| Segond | French | [thiagobodruk/bible](https://github.com/thiagobodruk/bible/blob/master/json/fr_apee.json) |
| 500+ others | Yoruba, Swahili, Korean… | [eBible.org](https://ebible.org/find/) |

Import: Library tab → Bible section → enter name → **Import JSON**

---

### 📦 Hymn Bundle

Hymn collections are a **separate download** (keeps plugin at ~150 KB). Download from the [hymn-bundle folder](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle).

---

### 📚 Documentation

- [README](https://github.com/ebena107/HymnFlow) — Overview & quick start
- [SETUP.md](https://github.com/ebena107/HymnFlow/blob/master/doc/SETUP.md) — Step-by-step setup guide
- [CHANGELOG.md](https://github.com/ebena107/HymnFlow/blob/master/doc/CHANGELOG.md) — Full version history
- [obs-setup.html](https://github.com/ebena107/HymnFlow/blob/master/public/obs-setup.html) — Interactive setup wizard

### 📄 License

GPL-2.0 — Free to use and modify for your worship services.
