# HymnFlow Quick Setup Guide

## ⚡ 5-Minute Setup

### Prerequisites
- OBS Studio v28 or higher (v27 works without global hotkeys)
- Web browser (Chrome, Edge, Firefox)

### Step 1: Locate Your HymnFlow Files

Extract the downloaded release to a permanent location:
```
C:\HymnFlow\
├── obs-setup.html           ← open this: shows the exact URLs for your computer
├── obs-dock/                ← the control dock
├── obs-overlay/             ← the on-screen overlay
├── scripts/                 ← OBS hotkey script & converters
│   └── hymnflow-obs-hotkeys.py
└── (hymn files: import your own — just drop them on the dock)
```

> If you are working from a source checkout instead of a release zip, the app folders are inside `public/` (for example `public/obs-dock/index.html`).

**Note your full path** — you'll need it below. Use forward slashes in URLs: `C:/HymnFlow/`

---

### Step 2: Add Custom Dock to OBS

1. Open **OBS Studio**
2. Go to **Docks → Custom Browser Docks…** (OBS 28–29: *View → Docks → Custom Browser Docks…*)
3. Set:
   - **Dock Name**: `HymnFlow Control`
   - **URL**: `file:///C:/HymnFlow/obs-dock/index.html`
4. Click **Apply**

The dock will appear in OBS (may take a moment to load).

---

### Step 3: Add Browser Source for Overlay

1. In your OBS scene, add a new source → **Browser Source**
2. Set:
   - **Name**: `Hymn Lower-Third`
   - **URL**: `file:///C:/HymnFlow/obs-overlay/index.html`
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
| `1`–`9` | Jump straight to that verse |
| `C` | Show the chorus |
| `B` | Blank the screen (keeps your place) |
| `X` | Emergency Clear |
| `Z` | Restore what was on screen before Blank / Clear |
| `?` | Show the shortcut cheat sheet |

On the last verse, the first `→` only arms the advance; a second press moves to the next service item (turn off in Style → Settings).

> These shortcuts work when the **dock panel has keyboard focus**. For global hotkeys that work from any OBS window, see the next section.

---

## 🎛️ Global OBS Hotkeys (Optional — OBS 28+)

Global hotkeys work even when the dock doesn't have focus — essential when you're watching the output preview or managing scenes.

### Setup

**Step 1: Enable obs-websocket**
1. OBS → **Tools → WebSocket Server Settings** (older OBS: *obs-websocket Settings*)
2. Check **Enable WebSocket server**
3. Set a password if desired; note the port (default: `4455`)
4. Click **OK**

**Step 2: Load the hotkey script**
1. OBS → **Tools → Scripts**
2. Click `+` → select `scripts/hymnflow-obs-hotkeys.py`
3. In the script panel: enter your obs-websocket host (`127.0.0.1`), port, and password

**Step 3: Bind keys in OBS**
1. OBS → **Settings → Hotkeys**
2. Search **"HymnFlow"** — 11 actions appear:
   - HymnFlow: Next Verse / Previous Verse
   - HymnFlow: Next Line / Previous Line
   - HymnFlow: Next Service Item / Previous Service Item
   - HymnFlow: Toggle Display
   - HymnFlow: Blank Screen / Emergency Clear
   - HymnFlow: Show Chorus / Restore Last Slide
3. Click the field next to each and press your desired key (e.g., `F5`, `F6`)
4. Click **OK**

**Step 4: Connect the dock**
1. HymnFlow dock → **Style** tab → **OBS Connection** section
2. Enter the same host, port, and password
3. Click **Connect** — the badge turns green ●
4. HymnFlow will auto-reconnect on OBS restarts

---

## 📖 Bible Lookup Setup

The Quick Scripture panel looks up and shows any verse live during a service. The KJV loads automatically the first time you open the dock. To add other translations, **download the file and drop it onto the Bible card** (Library tab): HymnFlow unzips it, converts it and names it for you. No scripts, unzipping or typing a name needed.

**Where to get translations:** open **Library → Bible → Get another translation**, pick a language, and it lists recommended sources with their licenses and exact steps. Some direct downloads:

- **ASV (English, public domain)** — [en_asv.json](https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_asv.json): save the file, then drop it.
**Spanish and English (NTBT / BTNT — BibliaTodo, modern translations from the original languages):**
- Download [NTBT-json.zip](https://downloads.bibliatodo.org/texto/NTBT-json.zip) and drop it onto the Bible card in the dock (Library tab) — no unzipping, converting or naming needed.
- English BTNT and Portuguese NTB-BR come from the same publisher: [BTNT-json.zip](https://downloads.bibliatodo.org/en/texto/BTNT-json.zip), [NTB-BR-json.zip](https://downloads.bibliatodo.org/pt/texto/NTB-BR-json.zip) (drop them the same way).
- Free to use and distribute under the [BibliaTodo license](https://www.bibliatodo.org/en/license); keep the Scripture wording unchanged and credit it once where your church lists credits (no need beside every verse on the overlay), e.g. *Santa Biblia, Nueva Traducción BibliaTodo (NTBT). Publicada por BibliaTodo Bible Society. Uso, reproducción y distribución autorizados gratuitamente conforme a la Licencia NTBT.* Link “BibliaTodo Bible Society” to <https://www.bibliatodo.org/es/ntbt/> (English BTNT: <https://www.bibliatodo.org/en/btnt/>) and keep a link to the license (version 1.9). Not bundled with HymnFlow.


**Yoruba, Swahili, Korean and hundreds more:** download the USFM `.zip` from [eBible.org](https://ebible.org/find/) and drop it onto the Bible card. A zip with one file per book is fine, and so are loose USFM files — drop all the books **together** and they become one Bible.

**Copyright:** Reina-Valera 1960, Almeida Atualizada and many modern translations are copyrighted. Get the publisher's permission before using them in a service or livestream. See [CONTENT_LICENSING.md](CONTENT_LICENSING.md).

**What you can drop:** a `.zip` (JSON or USFM inside), a `.json` Bible (HymnFlow, BibliaTodo or array-of-books format), or USFM files (`.usfm` / `.sfm`). Type a name in the name box first if you want a specific one; otherwise it is chosen for you.

### Advanced: convert a plain-text Bible (Python)

If you have a Bible in plain-text format (downloaded from eBible.org, Crosswire, etc.):

```bash
# Auto-detect format (verse_per_line, pipe, tab, or headed)
python scripts/convert_bible_txt.py "path/to/bible.txt" --name KJV

# Yoruba Bible (specific format)
python scripts/convert_yoruba_bible.py "path/to/yoruba.txt"
```

Output: a `.js` file or JSON file ready to import via the Library tab.

### Advanced: KJV auto-download (Python)

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

**Translations quick reference** — only the first group is public domain. Others are listed for convenience; copyright status varies, so confirm you have permission before using them in a service or livestream.

| Code | Full Name | Language |
|---|---|---|
| KJV | King James Version (1769) | English |
| ASV | American Standard Version (1901) | English |
| WEB | World English Bible | English |
| YLT | Young's Literal Translation | English |
| DBY | Darby Bible (1890) | English |
| RVR60 | Reina-Valera Revisada 1960 | Spanish — **copyrighted, permission required** |
| AA | Almeida Atualizada | Portuguese — **copyrighted, verify permission** |
| LS | Louis Segond 1910 | French |
| BYO | Bibeli Mimo (Yoruba) | Yoruba — **verify license of your source text** |

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
- Confirm obs-websocket is enabled: OBS → Tools → WebSocket Server Settings (older OBS: obs-websocket Settings)
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
