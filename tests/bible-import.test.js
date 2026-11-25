// Bible import: BibliaTodo schema-3 JSON and the existing array format.
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

global.window = global;
global.localStorage = { setItem() {}, getItem() { return null; } };
global.document = { addEventListener() {}, getElementById() { return null; } };
let current = '';
global.FileReader = class { readAsText() { this.onload({ target: { result: current } }); } };
const realErr = console.error, realWarn = console.warn; console.error = () => {}; console.warn = () => {}; // IndexedDB is absent in Node
// eslint-disable-next-line no-eval
eval(fs.readFileSync(path.join(__dirname, '..', 'public', 'data', 'bible-lookup.js'), 'utf8'));
const L = window.HymnFlowBibleLookup;

const CODES = 'GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM EZK DAN HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH 1TI 2TI TIT PHM HEB JAS 1PE 2PE 1JN 2JN 3JN JUD REV'.split(' ');
const fixture = {
  schema: 3, version: 'TEST',
  libros: CODES.map(c => ({
    codigo: c, nombre: c === 'JHN' ? 'Juan' : c,
    capitulos: [{ numero: 1, versiculos: [{ numero: 1, texto: `${c} uno`, titulo: 'ignored' }, { numero: 2, texto: `${c} dos` }] }],
  })),
};

(async () => {
  current = JSON.stringify(fixture);
  let r = await L.importFile({}, 'TST');
  assert.ok(r.ok, r.message);
  assert.match(r.message, /66 books, 132 verses/);
  const hit = L.lookup('Juan 1:2');
  assert.ok(hit.found && hit.text === 'JHN dos', JSON.stringify(hit));
  assert.ok(L.lookup('Nahum 1:1').found || L.lookup('NAH 1:1').found, 'NAM was not mapped to NAH');

  current = JSON.stringify({ libros: fixture.libros.slice(0, 10) });
  r = await L.importFile({}, 'BAD');
  assert.ok(!r.ok && /expected 66/.test(r.message), r.message);

  current = 'not json at all';
  r = await L.importFile({}, 'BAD2');
  assert.ok(!r.ok);
  console.error = realErr; console.warn = realWarn;
  console.log('bible-import tests passed');
})().catch(e => { console.error(e); process.exit(1); });
