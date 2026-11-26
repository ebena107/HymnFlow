// Drop-in Bible files: .zip (stored + deflated), USFM, auto-naming, error cases.
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

// ── helpers: build a real .zip in memory ───────────────────────────────────
function zipOf(files, { deflate = true, encrypt = false } = {}) {
  const locals = []; const central = []; let offset = 0;
  for (const [name, content] of Object.entries(files)) {
    const nameB = Buffer.from(name); const raw = Buffer.from(content);
    const data = deflate ? zlib.deflateRawSync(raw) : raw;
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(encrypt ? 1 : 0, 6);
    lh.writeUInt16LE(deflate ? 8 : 0, 8); lh.writeUInt32LE(data.length, 18); lh.writeUInt32LE(raw.length, 22);
    lh.writeUInt16LE(nameB.length, 26);
    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(20, 4); ch.writeUInt16LE(20, 6); ch.writeUInt16LE(encrypt ? 1 : 0, 8);
    ch.writeUInt16LE(deflate ? 8 : 0, 10); ch.writeUInt32LE(data.length, 20); ch.writeUInt32LE(raw.length, 24);
    ch.writeUInt16LE(nameB.length, 28); ch.writeUInt32LE(offset, 42);
    locals.push(lh, nameB, data); central.push(ch, nameB);
    offset += lh.length + nameB.length + data.length;
  }
  const cd = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(Object.keys(files).length, 8); end.writeUInt16LE(Object.keys(files).length, 10);
  end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(offset, 16);
  const all = Buffer.concat([...locals, cd, end]);
  return all.buffer.slice(all.byteOffset, all.byteOffset + all.length);
}
const fileOf = (name, content) => {
  const ab = content instanceof ArrayBuffer ? content : Buffer.from(content);
  const buf = ab instanceof ArrayBuffer ? ab : ab.buffer.slice(ab.byteOffset, ab.byteOffset + ab.length);
  return { name, arrayBuffer: async () => buf };
};

global.window = global;
global.localStorage = { setItem() {}, getItem() { return null; } };
global.document = { addEventListener() {}, getElementById() { return null; } };
global.FileReader = class { readAsText(f) { this.onload({ target: { result: f.__text } }); } };
const realWarn = console.warn, realErr = console.error; console.warn = console.error = () => {};
const F = require('../public/parsers/bibleFormats.js');
// eslint-disable-next-line no-eval
eval(fs.readFileSync(path.join(__dirname, '..', 'public', 'data', 'bible-lookup.js'), 'utf8'));
const L = window.HymnFlowBibleLookup;

const USFM_JHN = `\\id JHN Yoruba test
\\h Johanu
\\toc1 Ihinrere Johanu
\\mt1 JOHANU
\\c 3
\\s1 Heading that must be skipped
\\p
\\v 16 Nitori Ọlọrun fẹ araiye \\w pupọ|strong="G1"\\w*, \\f + \\fr 3:16 \\ft A footnote.\\f* ti o fi Ọmọ rẹ funni.
\\q1
\\v 17 Ọlọrun kò rán Ọmọ rẹ si aiye lati da aiye lẹbi.
\\v 18-19 Ẹniti o ba gbà a gbọ.
`;

(async () => {
  // 1. names
  assert.equal(F.nameFromFileName('NTBT-json.zip'), 'NTBT');
  assert.equal(F.nameFromFileName('yor_usfm.zip'), 'YOR');
  assert.equal(F.nameFromFileName('Bible.json'), 'BIBLE');

  // 2. USFM parsing: footnotes, \w, headings, verse ranges, poetry marker
  const r = F.parseUsfm([{ name: 'a.usfm', text: USFM_JHN }]);
  assert.equal(r.books, 1);
  const j = r.data.JHN;
  assert.equal(j.name, 'Ihinrere Johanu');
  assert.equal(j.chapters[3][16], 'Nitori Ọlọrun fẹ araiye pupọ, ti o fi Ọmọ rẹ funni.');
  assert.equal(j.chapters[3][17], 'Ọlọrun kò rán Ọmọ rẹ si aiye lati da aiye lẹbi.');
  assert.equal(j.chapters[3][18], 'Ẹniti o ba gbà a gbọ.'); // range stored at first number

  // 3. zip reader: deflated + stored, and bad inputs
  for (const deflate of [true, false]) {
    const entries = await F.unzip(zipOf({ 'x/one.txt': 'héllo', 'two.usfm': USFM_JHN }, { deflate }));
    assert.equal(entries.length, 2);
    assert.equal(await entries[0].text(), 'héllo');
  }
  await assert.rejects(F.unzip(new Uint8Array([1, 2, 3, 4]).buffer), /valid .zip/);
  await assert.rejects(F.unzip(zipOf({ 'a.txt': 'x' }, { encrypt: true })), /password/);

  // 4. full import: a zip holding a Bible JSON (BibliaTodo style) is auto-named from "version"
  const CODES = F.BOOK_CODES.map(c => (c === 'NAH' ? 'NAM' : c));
  const bt = JSON.stringify({ schema: 3, version: 'NTBT', libros: CODES.map(c => ({ codigo: c, nombre: c, capitulos: [{ numero: 1, versiculos: [{ numero: 1, texto: c + ' uno' }] }] })) });
  let res = await L.importFile(fileOf('NTBT-json.zip', zipOf({ 'NTBT.json': bt, 'LICENCIA.txt': 'x' })), '');
  assert.ok(res.ok && res.name === 'NTBT' && /66 books/.test(res.message), JSON.stringify(res));

  // 5. full import: a zip of USFM files becomes a (partial) Bible named from the file
  res = await L.importFile(fileOf('yor_usfm.zip', zipOf({ '44-JHNyor.usfm': USFM_JHN })), '');
  assert.ok(res.ok && res.name === 'YOR' && /1 books/.test(res.message), JSON.stringify(res));
  L.setActiveTranslation('YOR');
  const hit = L.lookup('John 3:16');
  assert.ok(hit.found && /Nitori Ọlọrun/.test(hit.text), JSON.stringify(hit));

  // 6. a typed name wins; a bare .usfm works; junk fails politely
  res = await L.importFile(fileOf('x.usfm', USFM_JHN), 'MYYOR');
  assert.ok(res.ok && res.name === 'MYYOR', JSON.stringify(res));
  res = await L.importFile(fileOf('junk.zip', zipOf({ 'readme.txt': 'nothing here' })), '');
  assert.ok(!res.ok && /no Bible text/.test(res.message), JSON.stringify(res));
  res = await L.importFile(fileOf('bad.zip', new ArrayBuffer(10)), '');
  assert.ok(!res.ok && /valid .zip/.test(res.message), JSON.stringify(res));

  console.warn = realWarn; console.error = realErr;
  console.log('bible-formats tests passed');
})().catch(e => { console.warn = realWarn; console.error = realErr; console.error(e); process.exit(1); });
