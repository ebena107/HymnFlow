// First-launch language detection and "don't save an automatic choice".
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

function load({ saved, languages }) {
  const store = saved ? { 'hymnflow-language': saved } : {};
  const win = { HymnFlowTranslations: JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'i18n', 'en.json'), 'utf8')) && {}, dispatchEvent() {} };
  const tr = fs.readFileSync(path.join(__dirname, '..', 'public', 'i18n', 'translations.js'), 'utf8');
  win.HymnFlowTranslations = JSON.parse(tr.match(/window\.HymnFlowTranslations\s*=\s*(\{[\s\S]*\});\s*$/)[1]);
  const ctx = {
    window: win,
    document: { readyState: 'complete', addEventListener() {}, querySelectorAll: () => [], documentElement: {} },
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = v; } },
    navigator: { languages, language: languages[0] },
    console: { warn() {}, error() {}, log() {} },
    CustomEvent: class { constructor(n, o) { this.type = n; this.detail = o && o.detail; } },
  };
  new Function('window', 'document', 'localStorage', 'navigator', 'console', 'CustomEvent',
    fs.readFileSync(path.join(__dirname, '..', 'public', 'i18n', 'i18n.js'), 'utf8'))
    (ctx.window, ctx.document, ctx.localStorage, ctx.navigator, ctx.console, ctx.CustomEvent);
  return { I: win.HymnFlowI18n, store };
}

// detection rules
let { I } = load({ languages: ['en-US'] });
assert.equal(I.detectLanguage(['es-MX', 'en']), 'es');
assert.equal(I.detectLanguage(['pt-BR']), 'pt');
assert.equal(I.detectLanguage(['fil-PH']), 'tl');
assert.equal(I.detectLanguage(['zh-CN']), 'zh');
assert.equal(I.detectLanguage(['yo']), 'yo');
assert.equal(I.detectLanguage(['de-DE', 'fr-FR']), 'fr');   // first supported language wins
assert.equal(I.detectLanguage(['en-GB', 'es']), 'en');      // the user's top choice wins
assert.equal(I.detectLanguage(['de-DE', 'ja']), 'en');      // nothing supported -> English
assert.equal(I.detectLanguage([]), 'en');

// first launch follows the browser but does NOT save it as a choice
({ I, store: global.__s } = load({ languages: ['es-ES'] }));
assert.equal(I.getCurrentLanguage(), 'es');
assert.equal(global.__s['hymnflow-language'], undefined, 'auto-detected language must not be persisted');

// a saved choice always wins, even over the browser language
({ I } = load({ saved: 'yo', languages: ['es-ES'] }));
assert.equal(I.getCurrentLanguage(), 'yo');

// an explicit choice is saved
({ I, store: global.__s } = load({ languages: ['es-ES'] }));
I.changeLanguage('fr');
assert.equal(global.__s['hymnflow-language'], 'fr');

console.log('i18n detection tests passed');
