/**
 * Transform all hymnal collections to HymnFlow data model
 * Processes NNBH, FWS, and UMH folders
 */

const fs = require('fs');
const path = require('path');

// Hymnal metadata
const HYMNALS = {
  'NNBH': {
    name: 'Baptist Hymnal',
    abbreviation: 'NNBH',
    publisher: 'LifeWay Christian Resources',
    year: 2008
  },
  'UMH': {
    name: 'United Methodist Hymnal',
    abbreviation: 'UMH',
    publisher: 'United Methodist Publishing House',
    year: 1989
  },
  'FWS': {
    name: 'The Faith We Sing',
    abbreviation: 'FWS',
    publisher: 'Abingdon Press',
    year: 2000
  }
};

/**
 * Parse hymn text file
 */
function parseHymnFile(filePath, hymnalCode) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  let title = '';
  let hymnNumber = null;
  let author = '';
  const verses = [];
  let chorus = '';
  let refrain = '';
  let currentVerse = [];
  let inRefrain = false;
  let inChorus = false;
  
  for (let line of lines) {
    line = line.trim();
    
    // Skip comments
    if (line.startsWith('//')) continue;
    
    // Parse title
    if (line.startsWith('#T:')) {
      title = line.substring(3).trim();
      continue;
    }
    
    // Parse source and number
    if (line.startsWith('#S:')) {
      const match = line.match(/#(\d+)/);
      if (match) {
        hymnNumber = parseInt(match[1], 10);
      }
      continue;
    }
    
    // Parse author (if present)
    if (line.startsWith('#A:')) {
      author = line.substring(3).trim();
      continue;
    }
    
    // Skip line count markers
    if (line.startsWith('#L:')) continue;
    
    // Refrain start (uppercase R)
    if (line.startsWith('#R[')) {
      inRefrain = true;
      refrain = '';
      continue;
    }
    
    // Refrain end
    if (line.startsWith('#R]')) {
      inRefrain = false;
      continue;
    }
    
    // Chorus/Refrain start (lowercase r)
    if (line.startsWith('#r[')) {
      inChorus = true;
      chorus = '';
      continue;
    }
    
    // Chorus end
    if (line.startsWith('#r]')) {
      inChorus = false;
      continue;
    }
    
    // Verse marker
    if (line.startsWith('##V')) {
      // Save previous verse
      if (currentVerse.length > 0) {
        verses.push(currentVerse.join('\n'));
        currentVerse = [];
      }
      continue;
    }
    
    // Refrain reference (##R or ##r means repeat refrain/chorus)
    if (line === '##R' || line === '##r') {
      continue;
    }
    
    // Skip refrain label lines
    if (line.startsWith('Refrain')) {
      continue;
    }
    
    // Skip empty lines
    if (!line) continue;
    
    // Collect lines
    if (inRefrain) {
      refrain += (refrain ? '\n' : '') + line;
    } else if (inChorus) {
      chorus += (chorus ? '\n' : '') + line;
    } else {
      currentVerse.push(line);
    }
  }
  
  // Save last verse
  if (currentVerse.length > 0) {
    verses.push(currentVerse.join('\n'));
  }
  
  // Use refrain if no chorus
  if (!chorus && refrain) {
    chorus = refrain;
  }
  
  // Extract hymn metadata
  const hymnalMeta = HYMNALS[hymnalCode];
  
  return {
    title: title || path.basename(filePath, '.txt'),
    author: author,
    verses: verses,
    chorus: chorus,
    hymnNumber: hymnNumber,
    hymnalCode: hymnalCode,
    hymnalName: hymnalMeta.name,
    publisher: hymnalMeta.publisher
  };
}

/**
 * Transform parsed hymn to HymnFlow data model
 */
function transformToDataModel(parsedHymn, index) {
  const hymnal = HYMNALS[parsedHymn.hymnalCode];
  
  return {
    id: `${parsedHymn.hymnalCode.toLowerCase()}_${String(parsedHymn.hymnNumber || index + 1).padStart(4, '0')}`,
    title: parsedHymn.title,
    author: parsedHymn.author || 'Unknown',
    verses: parsedHymn.verses,
    chorus: parsedHymn.chorus || '',
    metadata: {
      number: parsedHymn.hymnNumber || (index + 1),
      sourceAbbr: hymnal.abbreviation,
      source: hymnal.name,
      publisher: hymnal.publisher,
      year: hymnal.year
    },
    createdAt: new Date().toISOString()
  };
}

/**
 * Process a hymnal folder
 */
function processHymnal(hymnalCode) {
  const hymnalPath = path.join(__dirname, '..', 'hymn texts', hymnalCode);
  const outputPath = path.join(__dirname, '..', 'public', 'data', `${hymnalCode.toLowerCase()}.json`);
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processing: ${HYMNALS[hymnalCode].name} (${hymnalCode})`);
  console.log('='.repeat(60));
  
  if (!fs.existsSync(hymnalPath)) {
    console.error(`❌ Directory not found: ${hymnalPath}`);
    return null;
  }
  
  // Get all .txt files
  const files = fs.readdirSync(hymnalPath)
    .filter(f => f.endsWith('.txt'))
    .sort();
  
  console.log(`Found ${files.length} hymn files`);
  
  const hymns = [];
  const errors = [];
  
  files.forEach((file, index) => {
    try {
      const filePath = path.join(hymnalPath, file);
      const parsed = parseHymnFile(filePath, hymnalCode);
      
      // Validate required fields
      if (!parsed.title || parsed.verses.length === 0) {
        errors.push({
          file: file,
          error: 'Missing title or verses'
        });
        return;
      }
      
      const hymn = transformToDataModel(parsed, index);
      hymns.push(hymn);
      
      // Progress indicator
      if ((index + 1) % 50 === 0) {
        console.log(`  Processed ${index + 1}/${files.length} hymns...`);
      }
    } catch (err) {
      errors.push({
        file: file,
        error: err.message
      });
    }
  });
  
  console.log(`✓ Successfully processed: ${hymns.length} hymns`);
  
  if (errors.length > 0) {
    console.log(`⚠ Errors encountered: ${errors.length}`);
    errors.slice(0, 5).forEach(e => {
      console.log(`  - ${e.file}: ${e.error}`);
    });
    if (errors.length > 5) {
      console.log(`  ... and ${errors.length - 5} more errors`);
    }
  }
  
  // Create output structure
  const output = {
    source: HYMNALS[hymnalCode].name,
    sourceAbbreviation: HYMNALS[hymnalCode].abbreviation,
    publisher: HYMNALS[hymnalCode].publisher,
    year: HYMNALS[hymnalCode].year,
    count: hymns.length,
    generatedAt: new Date().toISOString(),
    hymns: hymns
  };
  
  // Write output
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');
  console.log(`✓ Output written to: ${outputPath}`);
  console.log(`✓ File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
  
  return {
    code: hymnalCode,
    name: HYMNALS[hymnalCode].name,
    count: hymns.length,
    outputFile: outputPath,
    errors: errors.length
  };
}

/**
 * Main execution
 */
function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║       HYMNFLOW - HYMNAL TRANSFORMATION PIPELINE          ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('Transforming hymnal collections to HymnFlow data model...');
  
  const results = [];
  
  // Process each hymnal
  for (const hymnalCode of Object.keys(HYMNALS)) {
    const result = processHymnal(hymnalCode);
    if (result) {
      results.push(result);
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('TRANSFORMATION SUMMARY');
  console.log('='.repeat(60));
  
  results.forEach(r => {
    console.log(`\n${r.name} (${r.code})`);
    console.log(`  ✓ Hymns: ${r.count}`);
    console.log(`  ✓ Output: ${path.basename(r.outputFile)}`);
    if (r.errors > 0) {
      console.log(`  ⚠ Errors: ${r.errors}`);
    }
  });
  
  const totalHymns = results.reduce((sum, r) => sum + r.count, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.errors, 0);
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`TOTAL HYMNS PROCESSED: ${totalHymns}`);
  console.log(`TOTAL FILES GENERATED: ${results.length}`);
  if (totalErrors > 0) {
    console.log(`TOTAL ERRORS: ${totalErrors}`);
  }
  console.log('='.repeat(60));
  console.log('\n✅ All transformations complete!');
  console.log('\nOutput files:');
  results.forEach(r => {
    console.log(`  • public/data/${path.basename(r.outputFile)}`);
  });
}

// Run
main();
