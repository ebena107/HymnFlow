/**
 * Validate generated hymnal JSON files
 */

const fs = require('fs');
const path = require('path');

const hymnals = ['nnbh', 'umh', 'fws'];

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║          HYMNAL FILES VALIDATION REPORT                   ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

hymnals.forEach(code => {
  const filePath = path.join(__dirname, '..', 'public', 'data', `${code}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${code.toUpperCase()}: File not found`);
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const fileSize = (fs.statSync(filePath).size / 1024).toFixed(2);
  
  console.log(`${'='.repeat(60)}`);
  console.log(`${data.source} (${data.sourceAbbreviation})`);
  console.log('='.repeat(60));
  console.log(`  Publisher: ${data.publisher}`);
  console.log(`  Year: ${data.year}`);
  console.log(`  Total Hymns: ${data.count}`);
  console.log(`  Hymns in Array: ${data.hymns.length}`);
  console.log(`  Match: ${data.count === data.hymns.length ? '✓' : '✗'}`);
  console.log(`  File Size: ${fileSize} KB`);
  console.log(`  With Chorus: ${data.hymns.filter(h => h.chorus).length}`);
  console.log('');
  console.log('  Data Model Validation:');
  console.log(`    • All have ID: ${data.hymns.every(h => h.id) ? '✓' : '✗'}`);
  console.log(`    • All have title: ${data.hymns.every(h => h.title) ? '✓' : '✗'}`);
  console.log(`    • All have author: ${data.hymns.every(h => h.author) ? '✓' : '✗'}`);
  console.log(`    • All have verses: ${data.hymns.every(h => h.verses && h.verses.length > 0) ? '✓' : '✗'}`);
  console.log(`    • All have chorus field: ${data.hymns.every(h => h.hasOwnProperty('chorus')) ? '✓' : '✗'}`);
  console.log(`    • All have metadata: ${data.hymns.every(h => h.metadata) ? '✓' : '✗'}`);
  console.log(`    • All have createdAt: ${data.hymns.every(h => h.createdAt) ? '✓' : '✗'}`);
  console.log('');
  console.log('  Metadata Validation:');
  console.log(`    • All have hymn number: ${data.hymns.every(h => h.metadata.number) ? '✓' : '✗'}`);
  console.log(`    • All have sourceAbbr: ${data.hymns.every(h => h.metadata.sourceAbbr === data.sourceAbbreviation) ? '✓' : '✗'}`);
  console.log(`    • All have source: ${data.hymns.every(h => h.metadata.source === data.source) ? '✓' : '✗'}`);
  console.log(`    • All have publisher: ${data.hymns.every(h => h.metadata.publisher === data.publisher) ? '✓' : '✗'}`);
  console.log('');
  console.log('  Sample Hymns:');
  console.log(`    • First: ${data.hymns[0].id} - ${data.hymns[0].title.substring(0, 40)}`);
  console.log(`    • Last: ${data.hymns[data.hymns.length - 1].id} - ${data.hymns[data.hymns.length - 1].title.substring(0, 40)}`);
  
  // Find hymn with chorus
  const hymnWithChorus = data.hymns.find(h => h.chorus);
  if (hymnWithChorus) {
    console.log(`    • With Chorus: ${hymnWithChorus.id} - ${hymnWithChorus.title.substring(0, 40)}`);
  }
  
  console.log('');
});

console.log('='.repeat(60));
console.log('OVERALL SUMMARY');
console.log('='.repeat(60));

let totalHymns = 0;
let totalSize = 0;
let allValid = true;

hymnals.forEach(code => {
  const filePath = path.join(__dirname, '..', 'public', 'data', `${code}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    totalHymns += data.count;
    totalSize += fs.statSync(filePath).size;
    
    const isValid = data.hymns.every(h => 
      h.id && h.title && h.verses && h.verses.length > 0 && h.metadata
    );
    if (!isValid) allValid = false;
  }
});

console.log(`  Total Files: ${hymnals.length}`);
console.log(`  Total Hymns: ${totalHymns}`);
console.log(`  Total Size: ${(totalSize / 1024).toFixed(2)} KB (${(totalSize / 1024 / 1024).toFixed(2)} MB)`);
console.log(`  All Valid: ${allValid ? '✓' : '✗'}`);
console.log('');
console.log('🚀 PRODUCTION STATUS: ' + (allValid ? 'READY ✓' : 'ERRORS FOUND ✗'));
console.log('');
console.log('Generated Files:');
hymnals.forEach(code => {
  console.log(`  • public/data/${code}.json`);
});
