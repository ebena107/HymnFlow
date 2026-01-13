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
    throw new Error('CSV file must have header and at least one data row');
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
  
  // Validate required columns exist
  if (!headers.includes('title') && !headers.includes('name')) {
    throw new Error('CSV must have Title or Name column');
  }
  
  const hymnsMap = new Map();
  const errors = [];
  
  for (let i = 1; i < lines.length; i++) {
    try {
      const values = parseCsvLine(lines[i]);
      
      if (values.length < 1 || (values.length === 1 && !values[0])) continue;
      
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      const title = (row.title || row.name || `Hymn ${i}`).trim();
      
      if (!title) {
        errors.push(`Row ${i + 1}: Missing title/name`);
        continue;
      }
      
      if (!hymnsMap.has(title)) {
        hymnsMap.set(title, {
          title: title,
          author: (row.author || '').trim(),
          verses: [],
          chorus: (row.chorus || '').trim(),
          metadata: {}
        });
      }
      
      const hymn = hymnsMap.get(title);
      
      // Add verse text
      const verseText = (row['verse text'] || row.text || row.verse || '').trim();
      if (verseText) {
        hymn.verses.push(verseText);
      }
      
      // Update chorus if found
      if (row.chorus && !hymn.chorus) {
        hymn.chorus = row.chorus.trim();
      }
      
      // Extract metadata
      const hymnNumber = parseInt(row['hymn number'] || row.number, 10);
      if (!isNaN(hymnNumber) && hymnNumber > 0) {
        hymn.metadata.number = hymnNumber;
      }
      
      const sourceAbbr = (row['source abbr'] || row['source abbreviation'] || '').trim().toUpperCase();
      if (sourceAbbr) {
        hymn.metadata.sourceAbbr = sourceAbbr;
      }
      
      const source = (row.source || '').trim();
      if (source) {
        hymn.metadata.source = source;
      }
    } catch (err) {
      errors.push(`Row ${i + 1}: ${err.message}`);
    }
  }
  
  if (errors.length > 0) {
    console.warn('CSV parsing warnings:', errors.join('; '));
  }
  
  const result = Array.from(hymnsMap.values());
  
  if (result.length === 0) {
    throw new Error('No valid hymns extracted from CSV');
  }
  
  return result;
}
