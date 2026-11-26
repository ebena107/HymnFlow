// Translation guard: every UI key exists, every language is complete, placeholders match,
// and the JSON sources stay in sync with the translations.js the app actually loads.
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const pub = path.join(__dirname, '..', 'public');
const src = fs.readFileSync(path.join(pub, 'i18n', 'translations.js'), 'utf8');
const T = JSON.parse(src.match(/window\.HymnFlowTranslations\s*=\s*(\{[\s\S]*\});\s*$/)[1]);

function flat(o, p = '') {
  const r = {};
  for (const [k, v] of Object.entries(o)) {
    if (v && typeof v === 'object') Object.assign(r, flat(v, p + k + '.')); else r[p + k] = v;
  }
  return r;
}
const en = flat(T.en);
const ph = (s) => (String(s).match(/\{\w+\}/g) || []).sort().join(',');

// 1. every language has every English key, with the same {placeholders}
for (const lang of Object.keys(T)) {
  const f = flat(T[lang]);
  const missing = Object.keys(en).filter(k => !(k in f));
  assert.deepEqual(missing, [], `${lang} is missing ${missing.length} key(s): ${missing.slice(0, 5)}`);
  for (const k of Object.keys(en)) {
    assert.equal(ph(f[k]), ph(en[k]), `${lang}.${k}: placeholders differ from English`);
    assert.ok(String(f[k]).trim().length > 0, `${lang}.${k} is empty`);
  }
}

// 2. the per-language JSON files match what the app loads
for (const lang of Object.keys(T)) {
  const j = JSON.parse(fs.readFileSync(path.join(pub, 'i18n', `${lang}.json`), 'utf8'));
  assert.deepEqual(j, T[lang], `${lang}.json is out of sync with translations.js (run scripts/combine_translations.py)`);
}

// 3. every key referenced from the HTML exists
const html = fs.readFileSync(path.join(pub, 'obs-dock', 'index.html'), 'utf8');
for (const m of html.matchAll(/data-i18n(?:-placeholder|-title|-aria)?="([\w.]+)"/g)) {
  assert.ok(m[1] in en, `index.html uses unknown translation key "${m[1]}"`);
}

// 4. every key used from the dock script via t('key', 'fallback') exists
const js = fs.readFileSync(path.join(pub, 'obs-dock', 'obs-dock.js'), 'utf8');
for (const m of js.matchAll(/\bt\(\s*'([\w.]+)'\s*,/g)) {
  assert.ok(m[1] in en, `obs-dock.js uses unknown translation key "${m[1]}"`);
}
for (const m of js.matchAll(/getTranslation\(\s*'([\w.]+)'/g)) {
  assert.ok(m[1] in en, `obs-dock.js uses unknown translation key "${m[1]}"`);
}

// 5. keys used by the standalone modules (tr('key', ...)) exist too
for (const f of ['data/bible-lookup.js', 'parsers/bibleFormats.js']) {
  const m = fs.readFileSync(path.join(pub, f), 'utf8');
  for (const k of m.matchAll(/tr\(\s*'([\w.]+)'/g)) assert.ok(k[1] in en, `${f} uses unknown translation key "${k[1]}"`);
}

console.log(`i18n tests passed (${Object.keys(T).length} languages, ${Object.keys(en).length} keys each)`);
