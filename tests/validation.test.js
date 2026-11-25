const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const src = fs.readFileSync(path.join(__dirname, '..', 'public', 'validation.js'), 'utf8');
const HymnValidator = new Function(src + '; return HymnValidator;')();

const good = { id: 'hymn_1', title: 'T', author: '', verses: ['a'], chorus: '', metadata: {} };
assert.equal(HymnValidator.validateHymn(good).valid, true);
for (const bad of [
  { ...good, id: "hymn_');alert(1);//" },
  { ...good, title: '  ' },
  { ...good, verses: [] },
  { ...good, metadata: [] },
  null,
]) assert.equal(HymnValidator.validateHymn(bad).valid, false, JSON.stringify(bad));
const r = HymnValidator.batchValidate([good, { ...good, id: 'x' }]);
assert.equal(r.valid.length, 1); assert.equal(r.invalid.length, 1);
console.log('validation tests passed');
