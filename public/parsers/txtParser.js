/**
 * Client-side TXT parser
 * Parse TXT file format from File object
 * Expected format:
 * Title: [Hymn Title]
 * Author: [Author Name] (optional)
 * 
 * Verse 1 text here
 * Can be multiple lines
 * 
 * Verse 2 text here
 * 
 * Chorus: (optional)
 * Chorus text here
 */
async function parseTxt(file) {
  const content = await file.text();
  const lines = content.split('\n').map(line => line.trim());
  
  const hymns = [];
  let currentHymn = null;
  let currentVerse = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // New hymn title
    if (line.startsWith('Title:')) {
      if (currentHymn && currentVerse.length > 0) {
        currentHymn.verses.push(currentVerse.join('\n'));
      }
      if (currentHymn) {
        hymns.push(currentHymn);
      }
      
      currentHymn = {
        title: line.substring(6).trim(),
        author: '',
        verses: [],
        chorus: '',
        metadata: {}
      };
      currentVerse = [];
    }
    // Author
    else if (line.startsWith('Author:')) {
      if (currentHymn) {
        currentHymn.author = line.substring(7).trim();
      }
    }
    // Chorus
    else if (line.startsWith('Chorus:')) {
      if (currentVerse.length > 0 && currentHymn) {
        currentHymn.verses.push(currentVerse.join('\n'));
        currentVerse = [];
      }
      // Get chorus text (can be on same line or next lines)
      const chorusText = line.substring(7).trim();
      if (currentHymn) {
        currentHymn.chorus = chorusText;
      }
    }
    // Empty line - verse separator
    else if (line === '' && currentVerse.length > 0) {
      if (currentHymn) {
        currentHymn.verses.push(currentVerse.join('\n'));
        currentVerse = [];
      }
    }
    // Verse content
    else if (line !== '') {
      currentVerse.push(line);
    }
  }
  
  // Add last verse and hymn
  if (currentHymn) {
    if (currentVerse.length > 0) {
      currentHymn.verses.push(currentVerse.join('\n'));
    }
    if (currentHymn.title) {
      hymns.push(currentHymn);
    }
  }
  
  return hymns;
}
