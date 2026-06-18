# HymnFlow Quick Setup Guide

## ⚡ 5-Minute Setup

### Prerequisites
- OBS Studio v27 or higher
- Web browser (Chrome, Edge, Firefox)

### Step 1: Locate Your HymnFlow Files

Extract the downloaded release to a permanent location:
```
C:\HymnFlow\              ← Recommended location
├── public/                ← Core application files (from plugin download)
│   ├── obs-dock/
│   └── obs-overlay/
└── hymn-bundle/          ← SEPARATE DOWNLOAD (not included in plugin)
    ├── cac_ghb.json      ← Download these individually from GitHub
    ├── cac_yhb.json
    └── [other hymns]
```

> [!IMPORTANT]
> The `hymn-bundle/` files are **NOT included** in the main plugin download.
> You must download hymn files separately from the [GitHub repository](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle).

**Note your full path** - you'll need it below.

### Step 2: Add Custom Dock to OBS

1. Open **OBS Studio**
2. Go to **View → Docks → Custom Browser Docks**
3. In the dialog:
   - **Dock Name**: `HymnFlow Control`
   - **URL**: `file:///C:/HymnFlow/public/obs-dock/index.html`
     - (Replace `C:\HymnFlow` with your actual path)
     - Use forward slashes `/` not backslashes `\`
     - Use three slashes: `file:///`
4. Click **Apply**

The dock will appear in OBS (may take a moment to load).

### Step 3: Add Browser Source for Overlay

1. In your OBS scene, add a new source
2. Select **Browser Source**
3. In the properties:
   - **Name**: `Hymn Lower-Third`
   - **URL**: `file:///C:/HymnFlow/public/obs-overlay/index.html`
   - **Width**: `1920`
   - **Height**: `1080`
4. Check these options:
   - ✅ **Shutdown source when not visible**
   - ✅ **Refresh browser when scene becomes active**
5. Click **OK**

### Step 4: Test It!

1. Open the **Library** tab in the dock and click any hymn
2. Switch to the **Live** tab — you should see the hymn preview update
3. Press → to advance to the next verse — the overlay should update in OBS
4. Press Space (or click **Display**) to toggle the overlay on/off

**✅ Setup complete!** You're ready to stream.

## 🎮 Basic Controls

| Action | How |
|--------|-----|
| **Next Verse** | Press → (right arrow) |
| **Previous Verse** | Press ← (left arrow) |
| **Toggle Display** | Press Space or click Display button |

## 📖 Bible Lookup Setup

The Quick Scripture panel lets you look up and display any verse live during a service. Bible data is **not bundled** in the plugin — import any compatible public domain JSON file.

### Option A: Download Direct (No Python Required)

Download a pre-formatted KJV JSON file from either public-domain repository:

- **[thiagobodruk/bible](https://github.com/thiagobodruk/bible/blob/master/json/en_kjv.json)** — click **Raw**, then Save As → `kjv.json`
- **[aruljohn/Bible-kjv](https://github.com/aruljohn/Bible-kjv/blob/master/kjv.json)** — click **Raw**, then Save As → `kjv.json`

Then import it into HymnFlow:

1. Open the **Library** tab → **Bible** section
2. Type `KJV` in the name field
3. Click **Import JSON** and select the file you downloaded
4. The status badge changes to `KJV ✓` — Bible is ready

### Option B: Generate Locally (Python)

If you have Python 3 installed, this script downloads and converts KJV automatically:

```
python scripts/bundle_bible_kjv.py
```

It writes `public/data/bible-kjv.js`. Import that file via the Library tab → Bible section (name it `KJV`).

### Using Quick Scripture

Once a translation is loaded, switch to the **Live** tab and use the **Scripture** panel:

- Type a reference: `John 3:16`, `Ps 23`, `1 Cor 13:4-7`, `Jude 1`
- Press 🔍 (or Enter) to look up
- Press **Display** to send the first verse to the overlay
- Use **←** / **→** to step through verses
- Chapter-only references (e.g., `Ps 23`) load all verses as individual navigable chunks

### Multiple Translations

Each translation is stored separately. To load an additional translation, repeat the import with a different name (e.g., `NIV`, `ESV`). Switch between them using the inline selector in the Live tab.

## 📥 Import Your Own Hymns

### Format 1: TXT File

Create a text file with this format:

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
- Multiple verses supported

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

### Import Process

> [!IMPORTANT]
> To reduce the initial download size, official hymn collections (CAC English/Yoruba, etc.) are provided as a **separate download** and are **NOT included** in the main plugin package.

**Step 1: Download Hymn Files**

Choose one of these options:

**Option A: Download Individual Files from GitHub**
1. Visit the [hymn-bundle folder](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle) on GitHub
2. Click on the hymn file you want (e.g., `cac_ghb.json`)
3. Click the "Download raw file" button or right-click "Raw" and select "Save link as..."
4. Save to your computer (e.g., `C:\HymnFlow\hymn-bundle\`)

**Option B: Download from Releases**
1. Visit the [Releases page](https://github.com/ebena107/HymnFlow/releases)
2. Download the `hymn-bundle.zip` file (if available)
3. Extract to your preferred location

**Step 2: Import into HymnFlow**
1. Open the HymnFlow dock in OBS
2. Go to the **Library** tab → **Hymns** section
3. Click **Import** and select your hymn file (`.json`, `.txt`, or `.csv`)
4. Hymns are added to your library instantly
5. ✅ Done! Click any hymn to select it, then switch to **Live** to display it

## 🎨 Customize the Display

Open the **Style** tab in the dock:

- **Font Size**: Drag slider (24px - 96px)
- **Font Family**: Choose from pre-loaded fonts
- **Text Color**: Click color picker
- **Background**: Transparent, solid, or gradient
- **Effects**: Toggle bold, italic, shadow, glow
- **Animation**: Fade, slide, or none
- **Position**: Bottom, middle, or top third

Changes apply instantly to the overlay!

## ❓ Troubleshooting

### Dock doesn't appear
- Check the URL uses forward slashes: `file:///C:/...` not `C:\`
- Make sure file path is correct
- Restart OBS

### Overlay doesn't show
- Verify Browser Source URL is correct
- Check browser source is in an active scene
- Try refreshing the browser source (right-click → Refresh)

### Hymns won't import
- Check file format (TXT, CSV, or JSON only)
- Ensure verses are separated by blank lines
- Check for special characters in text

### Bible lookup returns nothing
- Make sure a translation is imported: **Library** tab → **Bible** section
- Check the reference format: `John 3:16`, `Ps 23`, `1 Cor 13:4-7`
- Chapter-only: `Ps 23` (no verse number) loads the whole chapter

### Text won't display
- Check font size isn't too small
- Verify text color contrasts with background
- Try changing to "Transparent" background

## 🆘 Need More Help?

See [OBS_DOCK_README.md](OBS_DOCK_README.md) for detailed usage.

Or visit: https://github.com/ebena107/HymnFlow/issues

## 🚀 Next Steps

- [Customize colors and fonts](OBS_DOCK_README.md#customization)
- [Import official hymn bundle](https://github.com/ebena107/HymnFlow/tree/master/hymn-bundle)
- [Learn all keyboard shortcuts](OBS_DOCK_README.md)
