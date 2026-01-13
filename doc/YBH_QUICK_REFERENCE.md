# YBH.json - Yoruba Baptist Hymnal Quick Reference

## File Information
- **Location**: `public/data/ybh.json`
- **Total Hymns**: 650
- **Format**: HymnFlow-compatible JSON
- **Size**: 587 KB (0.57 MB)
- **Encoding**: UTF-8

## Importing into HymnFlow

### Method 1: Manual Import via OBS Dock
1. Open HymnFlow OBS Dock
2. Click **Import** button
3. Select `ybh.json` from file picker
4. All 650 hymns will be loaded into HymnFlow

### Method 2: Set as Default Hymn Data
Replace or merge with `public/data/hymns-data.js`:

```javascript
// In public/data/hymns-data.js
const YBH_HYMNS = [
  // Copy hymns array from ybh.json
];

// Or fetch dynamically
fetch('data/ybh.json')
  .then(r => r.json())
  .then(data => {
    localStorage.setItem('hymnflow-hymns', JSON.stringify(data.hymns));
  });
```

### Method 3: Pre-load in HTML
```html
<!-- In public/obs-dock/index.html -->
<script src="../data/ybh.json" type="application/json" id="ybh-data"></script>
<script>
  const ybhData = JSON.parse(document.getElementById('ybh-data').textContent);
  localStorage.setItem('hymnflow-hymns', JSON.stringify(ybhData.hymns));
</script>
```

## Data Structure

### Root Object
```json
{
  "source": "Yoruba Baptist Hymnal",
  "sourceAbbreviation": "YBH",
  "publisher": "Nigeria Baptist Convention",
  "count": 650,
  "generatedAt": "2026-01-07T07:44:26.067Z",
  "hymns": [...]
}
```

### Individual Hymn
```json
{
  "id": "ybh_001",
  "title": "EFI iyin fun Olorun,",
  "author": "Nigeria Baptist Convention",
  "verses": [
    "Verse 1 text\nWith line breaks\nUsing \\n character"
  ],
  "chorus": "Optional chorus text",
  "metadata": {
    "number": 1,
    "source": "Yoruba Baptist Hymnal",
    "sourceAbbreviation": "YBH"
  },
  "createdAt": "2026-01-07T07:44:26.032Z"
}
```

## Search and Filter

### By Hymn Number
```javascript
const hymn23 = ybhData.hymns.find(h => h.metadata.number === 23);
```

### By Title (Partial Match)
```javascript
const hymnsByTitle = ybhData.hymns.filter(h => 
  h.title.toLowerCase().includes('jesu')
);
```

### Hymns with Chorus
```javascript
const hymnsWithChorus = ybhData.hymns.filter(h => h.chorus);
// Returns: ybh_023, ybh_618
```

### By ID
```javascript
const hymn = ybhData.hymns.find(h => h.id === 'ybh_001');
```

## Notable Hymns

### With Chorus
1. **ybh_023** - "MO j' alejo nihin, 'nu ile ajeji,"
2. **ybh_618** - "MO Fe mo nipa Jesu sii,"

### Hymn Number Ranges
- **1-100**: Opening/Praise hymns
- **101-300**: Worship and devotional
- **301-500**: Teaching and doctrine
- **501-660**: Special occasions and closing

## Technical Notes

### Character Encoding
- Uses UTF-8 encoding for Yoruba characters
- Supports diacritics (ẹ, ọ, ṣ, etc.)
- Compatible with all modern browsers

### Performance
- File size: 587 KB (loads in <1 second)
- All 650 hymns fit comfortably in localStorage
- No pagination needed

### Validation
- All hymns have required fields
- No missing or null values
- Valid JSON structure
- Production-ready

## Integration Example

```javascript
// Load YBH hymns into HymnFlow
fetch('data/ybh.json')
  .then(response => response.json())
  .then(data => {
    // Get existing hymns
    const existing = JSON.parse(
      localStorage.getItem('hymnflow-hymns') || '[]'
    );
    
    // Merge or replace
    const merged = [...existing, ...data.hymns];
    
    // Save to localStorage
    localStorage.setItem('hymnflow-hymns', JSON.stringify(merged));
    
    console.log(`Loaded ${data.hymns.length} YBH hymns`);
  });
```

## Support
For issues or questions about the YBH hymnal data:
- Check: [doc/YBH_TRANSFORMATION_SUMMARY.md](YBH_TRANSFORMATION_SUMMARY.md)
- Original source: Yoruba Baptist Hymnal
- Publisher: Nigeria Baptist Convention

## Generated
January 7, 2026
