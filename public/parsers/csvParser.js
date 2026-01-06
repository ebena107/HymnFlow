/**
 * Client-side CSV parser
 * Parse CSV file format from File object
 * Expected columns: Title, Author, Verse Number, Verse Text, Chorus, Source Abbr, Source, Hymn Number
 * Example:
 * Title,Author,Verse Number,Verse Text,Chorus,Source Abbr,Source,Hymn Number
 * "Amazing Grace","John Newton",1,"Amazing grace! How sweet the sound...","Optional chorus","CH","Church Hymnal",123
 * "Amazing Grace","John Newton",2,"'Twas grace that taught my heart to fear...","","CH","Church Hymnal",123
 */
async function parseCsv(file) {
  const content = await file.text();
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);
  
  if (lines.length < 2) {
    throw new Error('CSV file must have header and at least one row');
  }
  
  // Parse CSV (simple parser - handles quoted fields)
  function parseCsvLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }
  
  const headers = parseCsvLine(lines[0]).map(h => h.toLowerCase());
  const hymnsMap = new Map();
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    
    if (values.length < headers.length) continue;
    
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    const title = row.title || `Hymn ${i}`;
    
    if (!hymnsMap.has(title)) {
      hymnsMap.set(title, {
        title: title,
        author: row.author || '',
        verses: [],
        chorus: row.chorus || '',
        metadata: {
          number: row['hymn number'] || row.number ? parseInt(row['hymn number'] || row.number, 10) : undefined,
          sourceAbbr: (row['source abbr'] || row['source abbreviation'] || '').toUpperCase() || undefined,
          source: row.source || undefined
        }
      });
    }
    
    const hymn = hymnsMap.get(title);
    if (row['verse text'] || row.text || row.verse) {
      hymn.verses.push(row['verse text'] || row.text || row.verse);
    }
    if (row.chorus && !hymn.chorus) {
      hymn.chorus = row.chorus;
    }
    
    // Update metadata if values found in later rows
    if (row['hymn number'] || row.number) {
      hymn.metadata.number = parseInt(row['hymn number'] || row.number, 10);
    }
    if (row['source abbr'] || row['source abbreviation']) {
      hymn.metadata.sourceAbbr = (row['source abbr'] || row['source abbreviation']).toUpperCase();
    }
    if (row.source) {
      hymn.metadata.source = row.source;
    }
  }
  
  return Array.from(hymnsMap.values());
}
