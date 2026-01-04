# HymnFlow Quick Setup Guide

## ⚡ 5-Minute Setup

### Prerequisites
- OBS Studio v27 or higher
- Web browser (Chrome, Edge, Firefox)

### Step 1: Locate Your HymnFlow Files

Extract the downloaded release to a permanent location:
```
C:\HymnFlow\              ← Recommended location
├── public/
│   ├── obs-dock/
│   └── obs-overlay/
└── [other files]
```

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

1. Click a hymn in the dock
2. You should see the preview update
3. The overlay should appear in your OBS preview
4. Try pressing → to advance to the next verse
5. The display should update automatically

**✅ Setup complete!** You're ready to stream.

## 🎮 Basic Controls

| Action | How |
|--------|-----|
| **Next Verse** | Press → (right arrow) |
| **Previous Verse** | Press ← (left arrow) |
| **Next Line** | Press ↓ (down arrow) |
| **Previous Line** | Press ↑ (up arrow) |
| **Toggle Display** | Press Space or click Display button |

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

### Format 2: JSON File

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

1. Click **Import** in the dock
2. Select your `.txt` or `.json` file
3. Hymns are added to your library
4. ✅ Done! Click any hymn to display it

## 🎨 Customize the Display

In the dock's **Settings** panel:

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
- Check file format (TXT or JSON only)
- Ensure verses are separated by blank lines
- Check for special characters in text

### Text won't display
- Check font size isn't too small
- Verify text color contrasts with background
- Try changing to "Transparent" background

## 🆘 Need More Help?

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed solutions.

Or visit: https://github.com/yourusername/HymnFlow/issues

## 🚀 Next Steps

- [Customize colors and fonts](OBS_DOCK_README.md#customization)
- [Import sample hymn files](public/data/)
- [Learn all keyboard shortcuts](README.md#keyboard-shortcuts)
