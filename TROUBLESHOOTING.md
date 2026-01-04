# Overlay Troubleshooting Guide

## Recent Updates

### ✅ Auto-Update Feature (FIXED)

The overlay now automatically updates when you:

- Select a hymn (first verse displays immediately)
- Click next/prev verse buttons
- Click next/prev lines buttons (**seamlessly advances between verses!**)
- Use arrow keys for navigation

**Smart Navigation:** When using line navigation (↓/↑), the system automatically advances to the next verse when reaching the end of the current verse, or retreats to the previous verse when at the beginning. No manual verse switching needed!

### ✅ Color Issue (FIXED)

Added default styling to ensure verses are always visible:

- White text on dark semi-transparent background
- Default font size 48px
- Minimum height for visibility

---

## Issue: Overlay only shows hymn title, not verse text

### Quick Fixes Applied

1. **Added default styling** to ensure content is visible
   - `.content` now has white text (#ffffff) on dark background (rgba(0,0,0,0.8))
   - Default font size 48px
   - Minimum height to ensure visibility

2. **Added debugging logs** to track data flow
   - Dock logs what it's sending
   - Overlay logs what it receives
   - Content logs what's being set

### How to Debug

1. **Open Browser Console (F12)** on both dock and overlay windows

2. **In Dock Console**, you should see:

   ```
   [Dock] Sending command: { title: "...", lines: [...], ... }
   [Dock] Command stored in localStorage
   ```

3. **In Overlay Console**, you should see:

   ```
   [Overlay] Storage event received: show { ... }
   [Overlay] Show command received: { title: "...", lines: [...] }
   [Overlay] Content set to: [verse text here]
   ```

### Common Issues & Solutions

#### Issue 1: Storage event not firing

**Symptoms**: Overlay console shows nothing when clicking Show
**Cause**: Dock and overlay not from same origin
**Solution**:

- Both must use same protocol (both file:// or both http://)
- Both must be from same directory/domain

#### Issue 2: Content is invisible

**Symptoms**: Overlay appears but text is invisible
**Cause**: Text color matches background
**Solution**:

- Check "Background type" setting in dock
- If transparent, ensure text color is visible
- Updated CSS now provides default dark background

#### Issue 3: Empty lines array

**Symptoms**: Console shows `lines: []`
**Cause**: Verse text not properly split
**Solution**:

- Check that hymn verses contain text
- Verify lines are separated by `\n` characters

### Testing Steps

1. **Test in Same Browser Tab First**
   - Open dock: `public/obs-dock/index.html`
   - Open overlay in NEW TAB: `public/obs-overlay/index.html`
   - Both should be from same URL (file:// or http://)

2. **Verify Data**
   - In dock, select a hymn
   - Check preview shows correct text
   - Click Show
   - Check dock console for sent data

3. **Verify Reception**
   - Check overlay console for received data
   - If no logs appear, storage event isn't firing
   - If logs show empty `lines`, check hymn data

4. **Verify Display**
   - If console shows content but not visible:
     - Check text color vs background color
     - Check if content div has proper styling
     - Use browser inspector to check `.content` element

### Manual Test Commands

**In Dock Console**, test sending directly:

```javascript
localStorage.setItem('HymnFlow-lowerthird-command', JSON.stringify({
  type: 'show',
  title: 'Test Hymn',
  author: 'Test Author',
  verseNumber: 1,
  totalVerses: 1,
  lines: ['Line 1 of verse', 'Line 2 of verse'],
  settings: {
    fontSize: 48,
    fontFamily: 'Inter, sans-serif',
    textColor: '#ffffff',
    bgType: 'solid',
    bgColorA: '#000000',
    animation: 'fade',
    position: 'bottom'
  },
  timestamp: Date.now()
}));
```

**In Overlay Console**, check received data:

```javascript
// Check what's stored
JSON.parse(localStorage.getItem('HymnFlow-lowerthird-command'))

// Manually trigger show
const data = JSON.parse(localStorage.getItem('HymnFlow-lowerthird-command'));
document.getElementById('content').textContent = data.lines.join('\n');
```

### Updated Files

✅ `public/obs-overlay/overlay.css` - Added default visible styling  
✅ `public/obs-overlay/overlay.js` - Added console logging  
✅ `public/obs-dock/obs-dock.js` - Added console logging  

### Next Steps

1. Refresh both dock and overlay pages
2. Open console (F12) on both
3. Select a hymn and click Show
4. Check console logs to see where the data flow breaks
5. Report what you see in the console

If you still see only the title:

- Share the console logs from both windows
- Check if `.content` element has text using browser inspector (right-click → Inspect)

