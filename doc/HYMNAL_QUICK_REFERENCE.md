# Hymnal Collections Quick Reference

## Files Generated

| Collection | File | Hymns | Size | Abbreviation |
|------------|------|-------|------|--------------|
| Baptist Hymnal | `nnbh.json` | 325 | 352 KB | NNBH |
| United Methodist Hymnal | `umh.json` | 296 | 337 KB | UMH |
| The Faith We Sing | `fws.json` | 46 | 44 KB | FWS |
| **TOTAL** | **3 files** | **667** | **734 KB** | — |

## Quick Import

### Single Collection
```javascript
// Load Baptist Hymnal
fetch('data/nnbh.json')
  .then(r => r.json())
  .then(data => {
    localStorage.setItem('hymnflow-hymns', JSON.stringify(data.hymns));
    console.log(`Loaded ${data.count} hymns from ${data.source}`);
  });
```

### All Collections
```javascript
// Load all three collections
Promise.all([
  fetch('data/nnbh.json').then(r => r.json()),
  fetch('data/umh.json').then(r => r.json()),
  fetch('data/fws.json').then(r => r.json())
]).then(([nnbh, umh, fws]) => {
  const allHymns = [...nnbh.hymns, ...umh.hymns, ...fws.hymns];
  localStorage.setItem('hymnflow-hymns', JSON.stringify(allHymns));
  console.log(`Loaded ${allHymns.length} total hymns`);
});
```

## Search Examples

### By Hymn Number
```javascript
// Find NNBH #555
const hymn = hymns.find(h => 
  h.metadata.sourceAbbr === 'NNBH' && h.metadata.number === 555
);
```

### By Reference String
```javascript
// Search "NNBH 555"
const matches = hymns.filter(h => {
  const ref = `${h.metadata.sourceAbbr} ${h.metadata.number}`;
  return ref.includes('NNBH 555');
});
```

### By Title (Partial Match)
```javascript
// Search "Amazing Grace"
const matches = hymns.filter(h => 
  h.title.toLowerCase().includes('amazing grace')
);
```

### By Source
```javascript
// Get all Baptist Hymnal hymns
const nnbhHymns = hymns.filter(h => 
  h.metadata.sourceAbbr === 'NNBH'
);
```

## Hymn Structure

```json
{
  "id": "nnbh_0555",
  "title": "A Child Of The King",
  "author": "Unknown",
  "verses": [
    "Verse 1 text\nwith line breaks",
    "Verse 2 text"
  ],
  "chorus": "Chorus text\nwith line breaks",
  "metadata": {
    "number": 555,
    "sourceAbbr": "NNBH",
    "source": "Baptist Hymnal",
    "publisher": "LifeWay Christian Resources",
    "year": 2008
  },
  "createdAt": "2026-01-07T08:01:11.165Z"
}
```

## Collection Details

### Baptist Hymnal (NNBH)
- **Publisher**: LifeWay Christian Resources
- **Year**: 2008
- **Hymns**: 325
- **With Chorus**: 129 (39.7%)
- **Number Range**: Various (e.g., 555, 8, 375)

### United Methodist Hymnal (UMH)
- **Publisher**: United Methodist Publishing House
- **Year**: 1989
- **Hymns**: 296
- **With Chorus**: 66 (22.3%)
- **Number Range**: Various (e.g., 282, 451)

### The Faith We Sing (FWS)
- **Publisher**: Abingdon Press
- **Year**: 2000
- **Hymns**: 46
- **With Chorus**: 17 (37.0%)
- **Number Range**: 2000s (e.g., 2078, 2056)

## Common Operations

### Filter by Collection
```javascript
const nnbhOnly = hymns.filter(h => h.metadata.sourceAbbr === 'NNBH');
const umhOnly = hymns.filter(h => h.metadata.sourceAbbr === 'UMH');
const fwsOnly = hymns.filter(h => h.metadata.sourceAbbr === 'FWS');
```

### Get Hymns with Chorus
```javascript
const withChorus = hymns.filter(h => h.chorus && h.chorus.length > 0);
```

### Sort by Hymn Number
```javascript
const sorted = hymns.sort((a, b) => 
  a.metadata.number - b.metadata.number
);
```

### Sort by Title
```javascript
const sorted = hymns.sort((a, b) => 
  a.title.localeCompare(b.title)
);
```

### Group by Source
```javascript
const grouped = hymns.reduce((acc, hymn) => {
  const source = hymn.metadata.sourceAbbr;
  if (!acc[source]) acc[source] = [];
  acc[source].push(hymn);
  return acc;
}, {});
// Result: { NNBH: [...], UMH: [...], FWS: [...] }
```

## Display Formats

### List Item
```javascript
function formatHymnListItem(hymn) {
  const ref = `${hymn.metadata.sourceAbbr} ${hymn.metadata.number}`;
  return `${ref} - ${hymn.title}`;
}
// Result: "NNBH 555 - A Child Of The King"
```

### Full Display
```javascript
function formatHymnFull(hymn) {
  return `
    ${hymn.metadata.sourceAbbr} ${hymn.metadata.number}
    ${hymn.title}
    ${hymn.author}
    
    ${hymn.verses.join('\n\n')}
    
    ${hymn.chorus ? `Chorus:\n${hymn.chorus}` : ''}
  `;
}
```

## Statistics

### Count by Source
```javascript
const counts = {
  NNBH: hymns.filter(h => h.metadata.sourceAbbr === 'NNBH').length,
  UMH: hymns.filter(h => h.metadata.sourceAbbr === 'UMH').length,
  FWS: hymns.filter(h => h.metadata.sourceAbbr === 'FWS').length
};
```

### Average Verses per Hymn
```javascript
const avgVerses = hymns.reduce((sum, h) => sum + h.verses.length, 0) / hymns.length;
```

### Chorus Percentage
```javascript
const withChorus = hymns.filter(h => h.chorus).length;
const percentage = (withChorus / hymns.length * 100).toFixed(1);
```

## Validation

### Check Hymn Validity
```javascript
function isValidHymn(hymn) {
  return hymn.id &&
         hymn.title &&
         hymn.verses && hymn.verses.length > 0 &&
         hymn.metadata &&
         hymn.metadata.sourceAbbr &&
         hymn.metadata.number;
}
```

### Validate Collection
```javascript
function validateCollection(hymns) {
  const invalid = hymns.filter(h => !isValidHymn(h));
  return {
    valid: invalid.length === 0,
    count: hymns.length,
    invalidCount: invalid.length,
    invalidHymns: invalid
  };
}
```

## Export/Backup

### Export Single Collection
```javascript
function exportCollection(sourceAbbr) {
  const filtered = hymns.filter(h => h.metadata.sourceAbbr === sourceAbbr);
  const json = JSON.stringify(filtered, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sourceAbbr.toLowerCase()}-backup.json`;
  a.click();
  
  URL.revokeObjectURL(url);
}
```

### Export All
```javascript
function exportAll() {
  const json = JSON.stringify(hymns, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'all-hymns-backup.json';
  a.click();
  
  URL.revokeObjectURL(url);
}
```

## Troubleshooting

### Missing Hymns
```javascript
// Check if hymn exists
const hymnExists = hymns.some(h => 
  h.metadata.sourceAbbr === 'NNBH' && h.metadata.number === 555
);
```

### Duplicate Detection
```javascript
// Find duplicate IDs
const ids = hymns.map(h => h.id);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
```

### Empty Verses
```javascript
// Find hymns with empty verses
const withEmptyVerses = hymns.filter(h => 
  h.verses.some(v => !v || !v.trim())
);
```

## Performance Tips

### Lazy Loading
```javascript
// Load one collection at a time
async function loadCollectionLazy(code) {
  const response = await fetch(`data/${code}.json`);
  const data = await response.json();
  return data.hymns;
}

// Usage
const nnbh = await loadCollectionLazy('nnbh');
```

### Indexed Search
```javascript
// Create index for faster searching
const index = new Map();
hymns.forEach(hymn => {
  const key = `${hymn.metadata.sourceAbbr}_${hymn.metadata.number}`;
  index.set(key, hymn);
});

// Fast lookup
const hymn = index.get('NNBH_555');
```

## See Also

- [HYMNAL_COLLECTIONS_SUMMARY.md](HYMNAL_COLLECTIONS_SUMMARY.md) - Complete documentation
- [DATA_MODELS.md](DATA_MODELS.md) - Data model specification
- `scripts/transform-all-hymnals.js` - Transformation script
- `scripts/validate-hymnals.js` - Validation script
