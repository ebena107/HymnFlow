# HymnFlow OBS Dock Plugin

**Full-featured OBS custom dock for displaying hymn lower-thirds during live streaming.**

## 🎯 Features

### Core Features

- ✅ Add, edit, delete, and search hymns within the dock
- ✅ Import/export hymns in .txt, .csv, and .json formats
- ✅ Keyboard shortcuts for next/prev verse and lines
- ✅ Adjustable lines per display (1-6 lines at once)
- ✅ Select specific verses and line ranges to display

### Customization Options

- ✅ Font family selection (Inter, Segoe UI, Roboto, Georgia, Montserrat)
- ✅ Font size slider (24px - 96px)
- ✅ Text effects: bold, italic, shadow, glow
- ✅ Text color picker
- ✅ Background options: transparent, solid color, gradient
- ✅ Animation effects: fade, slide, or none
- ✅ Position: bottom-third, middle, or top

### Lower-Third Overlay Features

- ✅ Smooth fade in/out or slide animations
- ✅ Responsive positioning
- ✅ Display hymn title, author, verse number
- ✅ Real-time updates from dock
- ✅ Transparent background for OBS chroma key

## 📦 Installation

### Quick Setup

1. **Locate the Files**

   ```
   public/obs-dock/       ← Control dock
   public/obs-overlay/    ← Lower-third overlay
   ```

2. **Add Custom Dock to OBS**
   - Open OBS Studio
   - Go to **View → Docks → Custom Browser Docks**
   - Dock Name: `HymnFlow Control`
   - URL: `file:///C:/HymnFlow/public/obs-dock/index.html`
     - Or use: `http://localhost:8000/obs-dock/` if running a web server
   - Click **Apply**

3. **Add Browser Source for Overlay**
   - In OBS, add a new **Browser Source**
   - Name: `Hymn Lower-Third`
   - URL: `file:///C:/HymnFlow/public/obs-overlay/index.html`
     - Or use: `http://localhost:8000/obs-overlay/`
   - Width: `1920`
   - Height: `1080`
   - Check ✅ **Shutdown source when not visible**
   - Check ✅ **Refresh browser when scene becomes active**
   - Click **OK**

4. **Done!** The dock will appear in OBS, and the overlay is ready.

## 🚀 Usage

### Adding Hymns

**Method 1: Manual Entry**

1. Click **+ Add Hymn** in the dock
2. Enter title, author, and verses
3. Separate verses with blank lines
4. Click OK

**Method 2: Import File**

1. Click **Import** button
2. Select a `.txt`, `.csv`, or `.json` file
3. Hymns will be added to your library

**TXT Format Example:**

```txt
Title: Amazing Grace
Author: John Newton

Amazing grace! How sweet the sound
That saved a wretch like me!

'Twas grace that taught my heart to fear,
And grace my fears relieved;
```

**CSV Format Example:**

```csv
Title,Author,Verse Number,Verse Text,Chorus,Source Abbr,Source,Hymn Number
"Amazing Grace","John Newton",1,"Amazing grace! How sweet the sound...","","CH","Church Hymnal",123
"Amazing Grace","John Newton",2,"'Twas grace that taught my heart to fear...","","CH","Church Hymnal",123
```

**JSON Format Example:**

```json
[
  {
    "title": "Amazing Grace",
    "author": "John Newton",
    "verses": [
      "Amazing grace! How sweet the sound\nThat saved a wretch like me!",
      "'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;"
    ]
  }
]
```

### Controlling Display

**Real-Time Auto-Update** ✨

The overlay now updates **automatically** as you navigate! No need to press Display repeatedly.

1. **Select a Hymn**: Click a hymn from the list → First verse displays immediately
2. **Navigate Verses**: Click **⟵ Prev Verse** / **Next Verse ⟶** → Overlay updates instantly
3. **Navigate Lines**: Click **⬆ Prev Lines** / **⬇ Next Lines** → Overlay updates instantly
4. **Toggle Display**: Click **👁️ Display** button or press **Spacebar**
5. **Visual Feedback**:
   - **Display** (purple, 👁️ eye icon) = Overlay is hidden
   - **Hide** (red, 🚫 icon, pulsing glow) = Overlay is visible

**Workflow:** Simply click through verses/lines - the overlay follows along in real-time!

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` (Right Arrow) | Next verse (auto-updates overlay) |
| `←` (Left Arrow) | Previous verse (auto-updates overlay) |
| `↓` (Down Arrow) | Next line window (auto-updates overlay, advances to next verse at end) |
| `↑` (Up Arrow) | Previous line window (auto-updates overlay, retreats to previous verse at start) |
| `Space` | Toggle display (show/hide overlay) |

**Note:** Arrow keys automatically update the overlay. Line navigation (↓/↑) **seamlessly advances between verses** when reaching boundaries!

### Adjusting Lines Per Display

Use the **Lines per display** slider (1-6) to control how many lines show at once. This lets you:

- Show 2 lines for short verses
- Show 4-6 lines for longer verses
- Navigate through long verses in chunks

### Styling the Overlay

All settings in the **Styles** panel apply in real-time:

1. **Font Settings**
   - Choose font family
   - Adjust size with slider
   - Toggle bold, italic, shadow, glow

2. **Colors**
   - Text color picker
   - Background type (transparent, solid, gradient)
   - Background color A (or primary color)
   - Background color B (for gradients)

3. **Animation & Position**
   - Fade: Smooth opacity transition
   - Slide: Slides up from bottom
   - None: Instant show/hide
   - Position: Bottom-third (default), Middle, or Top

### Exporting Hymns

1. Click **Export** button
2. Save `hymnflow-export.json`
3. Share or backup your hymn library

## 🎬 Workflow Example

### During Live Stream

1. **Before Service**
   - Import your hymn library
   - Test overlay appearance with different hymns
   - Adjust font size, colors, and positioning to match branding

2. **During Service**
   - Dock stays open in OBS
   - Select hymn from list - **first verse appears automatically**
   - Use arrow keys to navigate - **overlay updates in real-time**
   - Watch the **Display button** for status:
     - 👁️ Purple = Hidden (ready to show)
     - 🚫 Red pulsing = Visible (showing on stream)
   - Press **Display/Hide** button (or spacebar) to toggle when hymn is complete
   - Select next hymn - **automatically displays first verse**

3. **Quick Tips**
   - Preview window shows exactly what's on overlay
   - Navigation is instant - no Show button needed between verses
   - Use spacebar for quick hide/show toggle
   - Adjust "Lines per display" for long verses

## 🏗️ Technical Details

### Architecture

```
OBS Dock (Control)          OBS Overlay (Display)
      ↓                              ↓
localStorage.setItem()    ← → storage event listener
      ↓                              ↓
  'HymnFlow-lowerthird-command'
```

**Communication**: Uses browser `storage` events for real-time sync between dock and overlay.

### Data Storage

- **Hymns**: `localStorage['HymnFlow-hymns']`
- **Settings**: `localStorage['HymnFlow-dock-settings']`
- **Commands**: `localStorage['HymnFlow-lowerthird-command']`

### Files Structure

```
public/
├── obs-dock/
│   ├── index.html          ← Dock UI
│   ├── obs-dock.css        ← Dock styles
│   └── obs-dock.js         ← Dock controller
├── obs-overlay/
│   ├── index.html          ← Overlay display
│   ├── overlay.css         ← Overlay styles
│   └── overlay.js          ← Overlay listener
├── data/
│   └── hymns-data.js       ← Default hymns
├── parsers/
   ├── txtParser.js        ← TXT parser
   ├── csvParser.js        ← CSV parser
   └── jsonParser.js       ← JSON parser
```

## 🔧 Troubleshooting

### Overlay not updating

**Problem**: Clicking Show doesn't update overlay

**Solutions**:

- Ensure both dock and overlay are from **same origin** (same file:// directory or same http:// port)
- Check browser console (F12) for errors
- Refresh both dock and overlay browser sources

### localStorage quota exceeded

**Problem**: Can't save more hymns

**Solutions**:

- Export hymns to JSON file (backup)
- Clear old hymns you don't need
- localStorage limit is ~5-10MB (supports thousands of hymns)

### Overlay appears behind other sources

**Problem**: Overlay not visible

**Solutions**:

- Move browser source higher in OBS source list
- Check overlay opacity in browser source properties
- Verify overlay URL is correct

### Styles not applying

**Problem**: Font/colors don't change

**Solutions**:

- Click **Show** after changing styles
- Refresh overlay browser source
- Check if background type matches your selection

## 🎨 Customization Examples

### Example 1: Traditional Look

- Font: Georgia
- Size: 52px
- Bold: Yes
- Shadow: Yes
- Background: Solid black
- Animation: Fade

### Example 2: Modern Minimal

- Font: Inter
- Size: 48px
- Glow: Yes
- Background: Transparent
- Animation: Slide
- Position: Bottom

### Example 3: High Contrast

- Font: Montserrat
- Size: 60px
- Bold: Yes
- Text Color: #FFEB3B (yellow)
- Background: Gradient (black to dark blue)
- Shadow: Yes

## 📝 Best Practices

1. **Test Before Going Live**
   - Run through entire hymn before streaming
   - Check readability on different backgrounds
   - Verify timing of show/hide

2. **Organization**
   - Use descriptive hymn titles
   - Include author for proper attribution
   - Export backup regularly

3. **Performance**
   - Keep hymn library under 1000 songs for best performance
   - Use transparent background if overlaying on video
   - Disable effects if streaming on slow connection

4. **Accessibility**
   - Use high contrast colors (white on black, yellow on dark blue)
   - Font size 48px+ for readability
   - Test on different screen sizes

## 🔗 Integration with Main HymnFlow

This OBS dock plugin **shares the same localStorage** as the main HymnFlow control panel:

- Hymns added in main control appear in dock
- Settings are separate (dock has its own preferences)
- Can use both simultaneously

## 📄 License

MIT License - Free to use and modify

## 🤝 Support

For issues or questions:

1. Check [MIGRATION.md](../../MIGRATION.md) for setup help
2. Review [CLIENT_README.md](../../CLIENT_README.md) for general usage
3. Open browser console (F12) to debug localStorage issues

---

**Enjoy seamless hymn display in OBS! 🎵**
