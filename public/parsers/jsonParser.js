/**
 * Client-side JSON parser
 * Parse JSON file format from File object
 * Expected format:
 * {
 *   "hymns": [
 *     {
 *       "title": "Hymn Title",
 *       "author": "Author Name",
 *       "verses": ["Verse 1 text", "Verse 2 text"],
 *       "chorus": "Optional chorus",
 *       "metadata": {}
 *     }
 *   ]
 * }
 * 
 * Or an array of hymn objects directly
 */
async function parseJson(file) {
  const content = await file.text();
  const data = JSON.parse(content);
  
  let hymns = [];
  
  // Handle both formats: { hymns: [] } or direct array
  if (Array.isArray(data)) {
    hymns = data;
  } else if (data.hymns && Array.isArray(data.hymns)) {
    hymns = data.hymns;
  } else {
    throw new Error('Invalid JSON format. Expected array or object with "hymns" property.');
  }
  
  // Validate and normalize hymn objects
  return hymns.map(hymn => ({
    title: hymn.title || 'Untitled',
    author: hymn.author || '',
    verses: Array.isArray(hymn.verses) ? hymn.verses : [],
    chorus: hymn.chorus || '',
    metadata: hymn.metadata || {}
  }));
}
