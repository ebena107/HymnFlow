# HymnFlow Quick Setup Guide — v2.5.0

## ⚡ 5-Minute Setup

### Prerequisites
- OBS Studio v28 or higher (v27 works without global hotkeys)
- Web browser (Chrome, Edge, Firefox)

### Step 1: Locate Your HymnFlow Files

Extract the downloaded release to a permanent location:
```
C:\HymnFlow\
├── public/                  ← Core application files
│   ├── obs-dock/
│   └── obs-overlay/
├── scripts/                 ← Converter & OBS hotkey scripts
│   └── hymnflow-obs-hotkeys.py
└── hymn-bundle/             ← SEPARATE DOWNLOAD (see Step 3)
```

**Note your full path** — you'll need it below. Use forward slashes in URLs: `C:/HymnFlow/`

---

### Step 2: Add Custom Dock to OBS

1. Open **OBS Studio**
2. Go to **View → Docks → Custom Browser Docks**
3. Set:
   - **Dock Name**: `HymnFlow Control`
   - **URL**: `file:///C:/HymnFlow/public/obs-dock/index.html`
4. Click **Apply**

The dock will appear in OBS (may take a moment to load).

---

### Step 3: Add Browser Source for Overlay

1. In your OBS scene, add a new source → **Browser Source**
2. Set:
   - **Name**: `Hymn Lower-Third`
   - **URL**: `file:///C:/HymnFlow/public/obs-overlay/index.html`
   - **Width**: `1920` · **Height**: `1080`
3. Enable:
   - ✅ **Shutdown source when not visible**
   - ✅ **Refresh browser when scene becomes active**
4. Click **OK**

---

### Step 4: Test It!

1. Open the **Library** tab in the dock and click any hymn
2. Switch to the **Live** tab — the hymn preview should update
3. Press `→` to advance to the next verse — the overlay should update in OBS
4. Press `Space` to toggle the overlay on/off

**✅ Core setup complete!**

---

## 🎮 Keyboard Shortcuts

| Key | Action |
|---|---|
| `→` | Next verse |
| `←` | Previous verse |
| `↓` | Next line window (long/multi-line verses) |
| `↑` | Previous line window |
| `Space` | Toggle display on/off |
| `]` or `PageDown` | Next service item |
| `[` or `PageUp` | Previous service item |

> These shortcuts work when the **dock panel has keyboard focus**. For global hotkeys that work from any OBS window, see the next section.

---

## 🎛️ Global OBS Hotkeys (Optional — OBS 28+)

Global hotkeys work even when the dock doesn't have focus — essential when you're watching the output preview or managing scenes.

### Setup

**Step 1: Enable obs-websocket**
1. OBS → **Tools → obs-websocket Settings**
2. Check **Enable WebSocket server**
3. Set a password if desired; note the port (default: `4455`)
4. Click **OK**

**Step 2: Load the hotkey script**
1. OBS → **Tools → Scripts**
2. Click `+` → select `scripts/hymnflow-obs-hotkeys.py`
3. In the script panel: enter your obs-websocket host (`127.0.0.1`), port, and password

**Step 3: Bind keys in OBS**
1. OBS → **Settings → Hotkeys**
2. Search **"HymnFlow"** — 7 actions appear:
   - HymnFlow: Next Verse / Previous Verse
   - HymnFlow: Next Line / Previous Line
   - HymnFlow: Next Service Item / Previous Service Item
   - HymnFlow: Toggle Display
3. Click the field next to each and press your desired key (e.g., `F5`, `F6`)
4. Click **OK**

**Step 4: Connect the dock**
1. HymnFlow dock → **Style** tab → **OBS Connection** section
2. Enter the same host, port, and password
3. Click **Connect** — the badge turns green ●
4. HymnFlow will auto-reconnect on OBS restarts

---

## 📖 Bible Lookup Setup

The Quick Scripture panel lets you look up and display any verse live during a service. Bible data is **not bundled** in the plugin — import a free public-domain JSON file.

### Option A: Direct Download (No Python)

Download a pre-formatted Bible JSON from one of these repositories:

**English:**
- **KJV** — [thiagobodruk/bible → en_kjv.json](https://github.com/thiagobodruk/bible/blob/master/json/en_kjv.json) → click **Raw**, Save As `kjv.json`
- **ASV** — [thiagobodruk/bible → en_asv.json](https://github.com/thiagobodruk/bible/blob/master/json/en_asv.json) → click **Raw**, Save As `asv.json`
- **KJV (alternate)** — [aruljohn/Bible-kjv → kjv.json](https://github.com/aruljohn/Bible-kjv/blob/master/kjv.json)

**Spanish (Reina Valera):**
- [thiagobodruk/bible → es_rvr.json](https://github.com/thiagobodruk/bible/blob/master/json/es_rvr.json) → Save As `rvr.json`

**Portuguese (Almeida):**
- [thiagobodruk/bible → pt_aa.json](https://github.com/thiagobodruk/bible/blob/master/json/pt_aa.json) → Save As `pt_aa.json`

**French (Segond):**
- [thiagobodruk/bible → fr_apee.json](https://github.com/thiagobodruk/bible/blob/master/json/fr_apee.json) → Save As `fr.json`

Then import it:
1. Open HymnFlow Dock → **Library** tab → **Bible** section
2. Type a name (e.g., `KJV`) in the name field
3. Click **Import JSON** → select the downloaded file
4. Status badge shows `KJV ✓` — Bible is ready

### Option B: Convert a Text Bible (Python)

If you have a Bible in plain-text format (downloaded from eBible.org, Crosswire, etc.):

```bash
# Auto-detect format (verse_per_line, pipe, tab, or headed)
python scripts/convert_bible_txt.py "path/to/bible.txt" --name KJV

# Yoruba Bible (specific format)
python scripts/convert_yoruba_bible.py "path/to/yoruba.txt"
```

Output: a `.js` file or JSON file ready to import via the Library tab.

### Option C: KJV Auto-Download (Python)

```bash
python scripts/bundle_bible_kjv.py
# writes public/data/bible-kjv.js
```

### Public Domain Bible Sources

| Source | URL | Notes |
|---|---|---|
| thiagobodruk/bible | https://github.com/thiagobodruk/bible | KJV, ASV, RVR, Almeida, Segond, Tagalog — JSON |
| scrollmapper/bible_databases | https://github.com/scrollmapper/bible_databases | KJV, ASV — JSON + SQLite |
| seven1m/open-bibles | https://github.com/seven1m/open-bibles | WEB, YLT, Darby — OSIS XML |
| eBible.org | https://ebible.org/find/ | 500+ translations; Yoruba, Swahili, Hausa, Korean — plain text / USFM |
| Crosswire Bible Society | https://www.crosswire.org/sword/modules/ | 200+ languages — Sword module format |
| Open.Bible | https://open.bible | Community open-license translations |

**Public-domain translations quick reference:**

| Code | Full Name | Language |
|---|---|---|
| KJV | King James Version (1769) | English |
| ASV | American Standard Version (1901) | English |
| WEB | World English Bible | English |
| YLT | Young's Literal Translation | English |
| DBY | Darby Bible (1890) | English |
| RVR60 | Reina-Valera Revisada 1960 | Spanish |
| AA | Almeida Atualizada | Portuguese |
| LS | Louis Segond 1910 | French |
| BYO | Bibeli Mimo (Yoruba) | Yoruba |

### Using Quick Scripture

1. Switch to the **Live** tab → **Scripture** panel
2. Select your translation from the inline dropdown
3. Type a reference: `John 3:16`, `Ps 23`, `1 Cor 13:4-7`, `Jude 1`
4. Press 🔍 or Enter to look up
5. Press **Display** to send to overlay, then use `←` / `→` to step through verses

---

## 📥 Import Your Own Hymns

### Format 1: TXT File

```
Title: Amazing Grace
Author: John Newton

Amazing grace! How sweet the sound
That saved a wretch like me!

'Twas grace that taught my heart to fear,
And grace my fears relieved;
```

- Each hymn starts with `Title:`
- `Author:` is optional
- Blank lines separate verses

### Format 2: CSV File

```csv
Title,Author,Verse Number,Verse Text,Chorus,Source Abbr,Source,Hymn Number
"Amazing Grace","John Newton",1,"Amazing grace! How sweet the sound...","","CH","Church Hymnal",123
"Amazing Grace","John Newton",2,"'Twas grace that taught my heart to fear...","","CH","Church Hymnal",123
```

### Format 3: JSON File

```json
[
  {
    "title": "Amazing Grace",
    "author": "John Newton",
    "verses": [
      "Amazing grace! How sweet the sound\nThat saved a wretch like me!",
      "'Twas grace that taught my heart to fear\nAnd grace my fears relieved;"
    ]
  }
]
```

**To import:**
1. Library tab → **Import**
2. Select your file (`.json`, `.txt`, or `.csv`)
3. Hymns appear instantly

---

## 📅 Service Planning

1. **Service tab** → `+ New Service` → give it a name
2. Add items: `+ Hymn`, `+ Scripture`, `+ Announcement`, `+ Divider`
3. Drag items to reorder; add optional internal notes per item
4. Click **Save**, then **Load** to run the service
5. The service banner at the top shows the current item and "Next:" preview
6. Press `]` or the banner `⟶` button to advance to the next item
7. At the last verse of a hymn, `→` auto-advances to the next service item

---

## 🎨 Customize the Display

Open the **Style** tab:

| Setting | Options |
|---|---|
| Font family | Inter, Segoe UI, Roboto, Georgia, Montserrat |
| Font size | 24 – 96 px slider (auto-fit for overflow) |
| Effects | Bold, italic, shadow, glow, outline (color + width) |
| Background | Transparent, solid, or gradient |
| Animation | Fade, slide, or none |
| Position | Bottom, middle, or top |

Changes apply instantly to the overlay.

---

## ❓ Troubleshooting

**Dock doesn't appear:**
- URL must use forward slashes: `file:///C:/HymnFlow/…` not `C:\HymnFlow\…`
- Restart OBS after adding the dock

**Overlay doesn't update:**
- Both dock and overlay must come from the same origin (same `file://` folder or same HTTP server)
- Right-click Browser Source → **Refresh**

**Bible lost after OBS restart:**
- v2.5 uses IndexedDB for persistent storage — should survive restarts
- If migrating from v2.4.x, re-import your Bible once; it will migrate automatically

**Global hotkeys not working:**
- Confirm obs-websocket is enabled: OBS → Tools → obs-websocket Settings
- Confirm the script loaded: OBS → Tools → Scripts
- Check the green ● badge in the dock's OBS Connection panel
- Keys must be bound in OBS Settings → Hotkeys (search "HymnFlow")

**Hymns won't import:**
- Use .txt, .csv, or .json only
- TXT: verses must be separated by blank lines
- JSON: `verses` must be an array of strings

---

## 🆘 Need More Help?

- [Full documentation](OBS_DOCK_README.md)
- [Troubleshooting guide](TROUBLESHOOTING.md)
- [GitHub Issues](https://github.com/ebena107/HymnFlow/issues)
- [Interactive setup wizard](../public/obs-setup.html)
