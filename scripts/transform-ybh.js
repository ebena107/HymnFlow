/**
 * Transform Yoruba Baptist Hymnal data to HymnFlow data model
 * Extracts chorus from "Egbe:" lines and harmonizes with data model
 */

const fs = require('fs');
const path = require('path');

// Read source hymns.json
const sourceFile = path.join(__dirname, '..', 'public', 'data', 'hymns.json');
const outputFile = path.join(__dirname, '..', 'public', 'data', 'ybh.json');

console.log('Reading source file:', sourceFile);
const sourceData = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

console.log(`Processing ${sourceData.hymns.length} hymns...`);

// Transform each hymn
const transformedHymns = sourceData.hymns.map((hymn, index) => {
  // Extract verses and chorus
  const verses = [];
  let chorus = "";
  
  hymn.verses.forEach(verseObj => {
    const lines = verseObj.lines;
    let verseLines = [];
    let chorusLines = [];
    let inChorus = false;
    
    lines.forEach(line => {
      // Skip verse numbers (single digit or number lines)
      if (/^\d+$/.test(line.trim())) {
        return;
      }
      
      // Check if this line starts with "Egbe:"
      if (line.includes('Egbe:')) {
        inChorus = true;
        // Extract text after "Egbe:"
        const chorusText = line.replace(/^.*Egbe:\s*/, '').trim();
        if (chorusText) {
          chorusLines.push(chorusText);
        }
      } else if (inChorus) {
        // Continue collecting chorus lines
        chorusLines.push(line);
      } else {
        // Regular verse line
        verseLines.push(line);
      }
    });
    
    // Add verse if it has content
    if (verseLines.length > 0) {
      verses.push(verseLines.join('\n'));
    }
    
    // Set chorus (only from first occurrence, subsequent references ignored)
    if (chorusLines.length > 0 && !chorus) {
      chorus = chorusLines.join('\n');
    }
  });
  
  // Create transformed hymn object following data model
  const transformed = {
    id: `ybh_${String(hymn.number).padStart(3, '0')}`,
    title: hymn.title,
    author: "Nigeria Baptist Convention",
    verses: verses,
    chorus: chorus,
    metadata: {
      number: hymn.number,
      source: "Yoruba Baptist Hymnal",
      sourceAbbreviation: "YBH"
    },
    createdAt: new Date().toISOString()
  };
  
  // Progress indicator
  if ((index + 1) % 50 === 0) {
    console.log(`Processed ${index + 1} hymns...`);
  }
  
  return transformed;
});

// Create output structure
const output = {
  source: "Yoruba Baptist Hymnal",
  sourceAbbreviation: "YBH",
  publisher: "Nigeria Baptist Convention",
  count: transformedHymns.length,
  generatedAt: new Date().toISOString(),
  hymns: transformedHymns
};

// Write output file
console.log(`Writing ${transformedHymns.length} transformed hymns to ${outputFile}...`);
fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf8');

console.log('✓ Transformation complete!');
console.log(`✓ Output saved to: ${outputFile}`);
console.log(`✓ Total hymns: ${transformedHymns.length}`);
console.log(`✓ Hymns with chorus: ${transformedHymns.filter(h => h.chorus).length}`);
