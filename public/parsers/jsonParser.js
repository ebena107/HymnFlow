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
  
  // Validate and normalize hymn objects — coerce all string fields explicitly
  return hymns.map(hymn => ({
    id: hymn.id,
    title: typeof hymn.title === 'string' ? hymn.title || 'Untitled' : String(hymn.title ?? 'Untitled'),
    author: typeof hymn.author === 'string' ? hymn.author : String(hymn.author ?? ''),
    verses: Array.isArray(hymn.verses) ? hymn.verses.map(v => typeof v === 'string' ? v : String(v ?? '')) : [],
    chorus: typeof hymn.chorus === 'string' ? hymn.chorus : String(hymn.chorus ?? ''),
    metadata: hymn.metadata && typeof hymn.metadata === 'object' && !Array.isArray(hymn.metadata) ? hymn.metadata : {},
    createdAt: hymn.createdAt
  }));
}
