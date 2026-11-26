// HymnFlow Bible Lookup — multi-translation support
// window.HymnFlowBibles: { [name]: HymnFlowFormat } — all loaded translations in memory.
// Active translation is used for all lookups; persisted across sessions.
(() => {
  // Maps any common name / abbreviation (lowercase, spaces+dots stripped) → 3-letter code
  const ALIASES = {
    // Old Testament
    genesis:'GEN',gen:'GEN',gn:'GEN',
    exodus:'EXO',exo:'EXO',ex:'EXO',exod:'EXO',
    leviticus:'LEV',lev:'LEV',lv:'LEV',
    numbers:'NUM',num:'NUM',nu:'NUM',nb:'NUM',numb:'NUM',
    deuteronomy:'DEU',deu:'DEU',dt:'DEU',deut:'DEU',
    joshua:'JOS',jos:'JOS',josh:'JOS',
    judges:'JDG',jdg:'JDG',jg:'JDG',judg:'JDG',
    ruth:'RUT',rut:'RUT',ru:'RUT',
    '1samuel':'1SA','1sa':'1SA','1sam':'1SA',
    '2samuel':'2SA','2sa':'2SA','2sam':'2SA',
    '1kings':'1KI','1ki':'1KI','1kgs':'1KI',
    '2kings':'2KI','2ki':'2KI','2kgs':'2KI',
    '1chronicles':'1CH','1ch':'1CH','1chr':'1CH','1chron':'1CH',
    '2chronicles':'2CH','2ch':'2CH','2chr':'2CH','2chron':'2CH',
    ezra:'EZR',ezr:'EZR',
    nehemiah:'NEH',neh:'NEH',
    esther:'EST',est:'EST',esth:'EST',
    job:'JOB',
    psalms:'PSA',psalm:'PSA',psa:'PSA',ps:'PSA',
    proverbs:'PRO',pro:'PRO',prov:'PRO',prv:'PRO',
    ecclesiastes:'ECC',ecc:'ECC',eccl:'ECC',eccles:'ECC',qoh:'ECC',
    songofsolomon:'SNG',songofsongs:'SNG',
    song:'SNG',sng:'SNG',sg:'SNG',sos:'SNG',ss:'SNG',canticles:'SNG',
    isaiah:'ISA',isa:'ISA',is:'ISA',
    jeremiah:'JER',jer:'JER',
    lamentations:'LAM',lam:'LAM',lm:'LAM',
    ezekiel:'EZK',ezk:'EZK',eze:'EZK',ezek:'EZK',
    daniel:'DAN',dan:'DAN',dn:'DAN',
    hosea:'HOS',hos:'HOS',
    joel:'JOL',jol:'JOL',joe:'JOL',
    amos:'AMO',amo:'AMO',am:'AMO',
    obadiah:'OBA',oba:'OBA',ob:'OBA',obad:'OBA',
    jonah:'JON',jon:'JON',
    micah:'MIC',mic:'MIC',
    nahum:'NAH',nah:'NAH',na:'NAH',
    habakkuk:'HAB',hab:'HAB',
    zephaniah:'ZEP',zep:'ZEP',zeph:'ZEP',
    haggai:'HAG',hag:'HAG',hg:'HAG',
    zechariah:'ZEC',zec:'ZEC',zech:'ZEC',
    malachi:'MAL',mal:'MAL',
    // New Testament
    matthew:'MAT',mat:'MAT',matt:'MAT',mt:'MAT',
    mark:'MRK',mrk:'MRK',mk:'MRK',mr:'MRK',
    luke:'LUK',luk:'LUK',lk:'LUK',
    john:'JHN',jhn:'JHN',jn:'JHN',
    acts:'ACT',act:'ACT',ac:'ACT',
    romans:'ROM',rom:'ROM',ro:'ROM',rm:'ROM',
    '1corinthians':'1CO','1co':'1CO','1cor':'1CO','1corinth':'1CO',
    '2corinthians':'2CO','2co':'2CO','2cor':'2CO','2corinth':'2CO',
    galatians:'GAL',gal:'GAL',
    ephesians:'EPH',eph:'EPH',
    philippians:'PHP',php:'PHP',phil:'PHP',philipp:'PHP',
    colossians:'COL',col:'COL',
    '1thessalonians':'1TH','1th':'1TH','1thes':'1TH','1thess':'1TH',
    '2thessalonians':'2TH','2th':'2TH','2thes':'2TH','2thess':'2TH',
    '1timothy':'1TI','1ti':'1TI','1tim':'1TI',
    '2timothy':'2TI','2ti':'2TI','2tim':'2TI',
    titus:'TIT',tit:'TIT',
    philemon:'PHM',phm:'PHM',philem:'PHM',phile:'PHM',
    hebrews:'HEB',heb:'HEB',
    james:'JAS',jas:'JAS',jm:'JAS',jms:'JAS',
    '1peter':'1PE','1pe':'1PE','1pet':'1PE',
    '2peter':'2PE','2pe':'2PE','2pet':'2PE',
    '1john':'1JN','1jn':'1JN','1jo':'1JN',
    '2john':'2JN','2jn':'2JN','2jo':'2JN',
    '3john':'3JN','3jn':'3JN','3jo':'3JN',
    jude:'JUD',jud:'JUD',jd:'JUD',
    revelation:'REV',rev:'REV',re:'REV',rv:'REV',apoc:'REV',
  };

  // Books that have only one chapter; bare "Jude 4" means verse 4, not chapter 4.
  const SINGLE_CHAPTER_BOOKS = new Set(['OBA', 'PHM', '2JN', '3JN', 'JUD']);

  // Normalises a book name for alias lookup: lowercase, strip accents/diacritics
  // (so "Génesis" → "genesis", "Éphésiens" → "ephesiens"), drop spaces and dots.
  function normKey(raw) {
    return raw
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[\s.]/g, '');
  }

  function resolveBook(raw) {
    return ALIASES[normKey(raw)] || null;
  }

  // Parses references like:
  //   "Jude 1"               → whole chapter (single-chapter books: verse 1 of ch 1)
  //   "John 3:16"            → single verse
  //   "John 3 16"            → same (space instead of colon)
  //   "John 3:16-18"         → verse range
  //   "John 3:16 18"         → same (space instead of dash)
  //   "John 3 16 18"         → same (all spaces)
  //   "1 Cor 13:4-7"         → numbered-book + range
  //   "1Cor 13:4-7"          → compact numbered-book (no space)
  //   "Song of Solomon 1:1"  → multi-word book name
  //   "Jude 24"              → single-chapter book: treated as Jude 1:24
  function parseRef(refStr) {
    // Drop a trailing "(KJV)"-style translation tag so references written back
    // into the search box by a previous lookup still round-trip.
    const s = refStr.trim().replace(/\s*\([^)]*\)$/, '');
    // Split book name from the numeric tail. The lazy book group plus a
    // digits-only tail makes the engine pick the shortest book that leaves a
    // purely numeric reference, so numbered books ("1 Cor 13 4") and
    // multi-word names ("Song of Solomon 1 1") both resolve.
    const m = s.match(/^(.*?\S)\s+(\d[\d\s:–—-]*)$/);
    if (!m) return null;

    const bookCode = resolveBook(m[1]);
    if (!bookCode) return null;

    // Tail: chapter, optional verse (colon or space), optional range end
    // (dash or space) — "8:28-30", "8:28 30", "8 28 30", "8:28", "8".
    const t = m[2].trim().match(/^(\d+)(?:(?:\s*:\s*|\s+)(\d+)(?:(?:\s*[–—-]\s*|\s+)(\d+))?)?$/);
    if (!t) return null;

    let chapter    = parseInt(t[1], 10);
    let verseStart = t[2] ? parseInt(t[2], 10) : null;
    let verseEnd   = t[3] ? parseInt(t[3], 10) : verseStart;
    if (verseStart !== null && verseEnd < verseStart) return null;

    // Single-chapter books: "Jude 24" means verse 24, not chapter 24.
    if (verseStart === null && SINGLE_CHAPTER_BOOKS.has(bookCode) && chapter > 1) {
      return { bookCode, chapter: 1, verseStart: chapter, verseEnd: chapter };
    }

    return { bookCode, chapter, verseStart, verseEnd };
  }

  // ── Canonical book data (used by convertRawArray) ──────────────────────
  const BOOK_CODES = [
    'GEN','EXO','LEV','NUM','DEU','JOS','JDG','RUT',
    '1SA','2SA','1KI','2KI','1CH','2CH','EZR','NEH',
    'EST','JOB','PSA','PRO','ECC','SNG','ISA','JER',
    'LAM','EZK','DAN','HOS','JOL','AMO','OBA','JON',
    'MIC','NAH','HAB','ZEP','HAG','ZEC','MAL',
    'MAT','MRK','LUK','JHN','ACT','ROM','1CO','2CO',
    'GAL','EPH','PHP','COL','1TH','2TH','1TI','2TI',
    'TIT','PHM','HEB','JAS','1PE','2PE','1JN','2JN',
    '3JN','JUD','REV',
  ];
  const BOOK_NAMES = [
    'Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth',
    '1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles',
    'Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes',
    'Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel',
    'Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk',
    'Zephaniah','Haggai','Zechariah','Malachi',
    'Matthew','Mark','Luke','John','Acts','Romans',
    '1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians',
    'Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy',
    'Titus','Philemon','Hebrews','James','1 Peter','2 Peter',
    '1 John','2 John','3 John','Jude','Revelation',
  ];

  // ── Localized book-name aliases ────────────────────────────────────────
  // Lets non-English operators type references in their language (e.g. "Juan 3:16",
  // "Jean 3:16", "João 3:16"). Names are listed in canonical BOOK_CODES order.
  // Accents are stripped at merge time, so cognates resolve even if typed plainly.
  // English (ALIASES above) always remains available as a fallback.
  // Extend by adding another language array; partial arrays are fine.
  const LOCALE_BOOK_NAMES = {
    es: ['Génesis','Éxodo','Levítico','Números','Deuteronomio','Josué','Jueces','Rut',
      '1 Samuel','2 Samuel','1 Reyes','2 Reyes','1 Crónicas','2 Crónicas','Esdras','Nehemías',
      'Ester','Job','Salmos','Proverbios','Eclesiastés','Cantares','Isaías','Jeremías',
      'Lamentaciones','Ezequiel','Daniel','Oseas','Joel','Amós','Abdías','Jonás',
      'Miqueas','Nahúm','Habacuc','Sofonías','Hageo','Zacarías','Malaquías',
      'Mateo','Marcos','Lucas','Juan','Hechos','Romanos','1 Corintios','2 Corintios',
      'Gálatas','Efesios','Filipenses','Colosenses','1 Tesalonicenses','2 Tesalonicenses',
      '1 Timoteo','2 Timoteo','Tito','Filemón','Hebreos','Santiago','1 Pedro','2 Pedro',
      '1 Juan','2 Juan','3 Juan','Judas','Apocalipsis'],
    fr: ['Genèse','Exode','Lévitique','Nombres','Deutéronome','Josué','Juges','Ruth',
      '1 Samuel','2 Samuel','1 Rois','2 Rois','1 Chroniques','2 Chroniques','Esdras','Néhémie',
      'Esther','Job','Psaumes','Proverbes','Ecclésiaste','Cantique des Cantiques','Ésaïe','Jérémie',
      'Lamentations','Ézéchiel','Daniel','Osée','Joël','Amos','Abdias','Jonas',
      'Michée','Nahum','Habacuc','Sophonie','Aggée','Zacharie','Malachie',
      'Matthieu','Marc','Luc','Jean','Actes','Romains','1 Corinthiens','2 Corinthiens',
      'Galates','Éphésiens','Philippiens','Colossiens','1 Thessaloniciens','2 Thessaloniciens',
      '1 Timothée','2 Timothée','Tite','Philémon','Hébreux','Jacques','1 Pierre','2 Pierre',
      '1 Jean','2 Jean','3 Jean','Jude','Apocalypse'],
    pt: ['Gênesis','Êxodo','Levítico','Números','Deuteronômio','Josué','Juízes','Rute',
      '1 Samuel','2 Samuel','1 Reis','2 Reis','1 Crônicas','2 Crônicas','Esdras','Neemias',
      'Ester','Jó','Salmos','Provérbios','Eclesiastes','Cânticos','Isaías','Jeremias',
      'Lamentações','Ezequiel','Daniel','Oseias','Joel','Amós','Obadias','Jonas',
      'Miqueias','Naum','Habacuque','Sofonias','Ageu','Zacarias','Malaquias',
      'Mateus','Marcos','Lucas','João','Atos','Romanos','1 Coríntios','2 Coríntios',
      'Gálatas','Efésios','Filipenses','Colossenses','1 Tessalonicenses','2 Tessalonicenses',
      '1 Timóteo','2 Timóteo','Tito','Filemom','Hebreus','Tiago','1 Pedro','2 Pedro',
      '1 João','2 João','3 João','Judas','Apocalipse'],
  };

  // Merge localized names into ALIASES. We never overwrite an existing English
  // mapping, so English semantics are preserved and cognates stay consistent.
  Object.values(LOCALE_BOOK_NAMES).forEach(names => {
    names.forEach((name, i) => {
      const code = BOOK_CODES[i];
      if (!code) return;
      const key = normKey(name);
      if (key && !(key in ALIASES)) ALIASES[key] = code;
    });
  });

  // Converts the raw source array format (thiagobodruk / aruljohn — 0-indexed)
  // into the HymnFlow 1-indexed object format used by lookup().
  function convertRawArray(arr) {
    const result = {};
    arr.forEach((book, i) => {
      if (i >= BOOK_CODES.length) return;
      const code = BOOK_CODES[i];
      const name = book.name || book.book || BOOK_NAMES[i] || code;
      const chapters = [null]; // 1-indexed: chapters[0] unused
      (book.chapters || []).forEach(ch => {
        chapters.push([null, ...ch]); // 1-indexed: verses[0] unused
      });
      result[code] = { name, chapters };
    });
    return result;
  }

  // Converts the BibliaTodo "schema 3" JSON (libros > capitulos > versiculos,
  // USFM book codes — NTBT/BTNT/NTB-BR). Verse text only; headings, notes and
  // formatting metadata are ignored so the translation wording stays untouched.
  function convertBibliaTodo(data) {
    const result = {};
    data.libros.forEach(book => {
      let code = String(book.codigo || '').toUpperCase();
      // Standard USFM codes that differ from HymnFlow's internal ones.
      const USFM_ALIAS = { NAM: 'NAH', JOE: 'JOL', EZE: 'EZK', SOS: 'SNG', SON: 'SNG', PHI: 'PHP', JAM: 'JAS', JHN: 'JHN' };
      if (USFM_ALIAS[code]) code = USFM_ALIAS[code];
      const idx = BOOK_CODES.indexOf(code);
      if (idx < 0) return; // unknown/deuterocanonical book: skip
      const chapters = [null];
      (book.capitulos || []).forEach(ch => {
        const verses = [null];
        (ch.versiculos || []).forEach(v => { verses[v.numero] = String(v.texto || ''); });
        for (let i = 1; i < verses.length; i++) if (verses[i] === undefined) verses[i] = '';
        chapters[ch.numero] = verses;
      });
      for (let i = 1; i < chapters.length; i++) if (!chapters[i]) chapters[i] = [null];
      result[code] = { name: book.nombre || BOOK_NAMES[idx] || code, chapters };
    });
    if (Object.keys(result).length < 66) {
      throw new Error(`Only ${Object.keys(result).length} books found — expected 66`);
    }
    Object.defineProperty(result, '__label', { value: String(data.version || ''), enumerable: false });
    return result;
  }

  // Detects and parses Bible file content (JSON array or HymnFlow JS/JSON).
  // Returns the HymnFlow-format object or throws on invalid content.
  function parseBibleFile(text) {
    let json = text.trim();
    // Strip JS assignment wrapper if present (bible-kjv.js format)
    if (json.startsWith('//') || json.includes('window.HymnFlowBible')) {
      const m = json.match(/window\.HymnFlowBible\s*=\s*([\s\S]+?);\s*$/);
      if (!m) throw new Error('Could not extract JSON from .js file');
      json = m[1];
    }
    const data = JSON.parse(json);
    if (Array.isArray(data)) {
      if (data.length < 66) throw new Error(`Only ${data.length} books found — expected 66`);
      return convertRawArray(data);
    }
    if (data && typeof data === 'object' && data.GEN) {
      return data;
    }
    if (data && typeof data === 'object' && Array.isArray(data.libros)) {
      return convertBibliaTodo(data);
    }
    throw new Error('Unrecognised Bible JSON format');
  }

  // ── Storage — IndexedDB (large Bible data) + localStorage (tiny metadata) ──
  const ACTIVE_KEY = 'hymnflow-bible-active'; // name of active translation (localStorage)
  const DB_NAME    = 'HymnFlowBibles';
  const DB_VERSION = 1;
  const STORE      = 'translations';

  window.HymnFlowBibles = {};
  let activeTranslation = '';

  // Cached IDB connection promise
  let _dbPromise = null;
  function openDB() {
    if (_dbPromise) return _dbPromise;
    _dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = e => {
        e.target.result.createObjectStore(STORE, { keyPath: 'name' });
      };
      req.onsuccess = e => resolve(e.target.result);
      req.onerror   = e => reject(e.target.error);
    });
    return _dbPromise;
  }

  function idbPut(name, data) {
    return openDB().then(db => new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put({ name, data });
      tx.oncomplete = () => resolve(true);
      tx.onerror    = e => reject(e.target.error);
    }));
  }

  function idbGet(name) {
    return openDB().then(db => new Promise((resolve, reject) => {
      const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(name);
      req.onsuccess = e => resolve(e.target.result ? e.target.result.data : null);
      req.onerror   = e => reject(e.target.error);
    }));
  }

  function idbDelete(name) {
    return openDB().then(db => new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(name);
      tx.oncomplete = () => resolve();
      tx.onerror    = e => reject(e.target.error);
    }));
  }

  function idbAllKeys() {
    return openDB().then(db => new Promise((resolve, reject) => {
      const req = db.transaction(STORE, 'readonly').objectStore(STORE).getAllKeys();
      req.onsuccess = e => resolve(e.target.result);
      req.onerror   = e => reject(e.target.error);
    }));
  }

  // Returns a Promise<boolean> — true if successfully persisted.
  function persistOne(name, data) {
    return idbPut(name, data).then(() => true).catch(err => {
      console.warn('[Bible] IndexedDB persist failed:', err);
      return false;
    });
  }

  // Fire-and-forget removal from IDB.
  function removeFromStorage(name) {
    idbDelete(name).catch(e => console.warn('[Bible] IDB delete failed:', e));
  }

  // Returns a Promise that resolves once all stored translations are loaded into memory.
  // Also migrates any data still in the old localStorage formats.
  async function restoreBibles() {
    // ── Migration: pre-v2.4.1 single localStorage key ──────────────────────
    try {
      const legacy = localStorage.getItem('hymnflow-bible-kjv');
      if (legacy) {
        const data = JSON.parse(legacy);
        window.HymnFlowBibles['KJV'] = data;
        activeTranslation = 'KJV';
        await idbPut('KJV', data).catch(() => {});
        localStorage.setItem(ACTIVE_KEY, 'KJV');
        localStorage.removeItem('hymnflow-bible-kjv');
        localStorage.removeItem('hymnflow-bible-index');
      }
    } catch (e) { console.warn('[Bible] Legacy migration error:', e); }

    // ── Migration: v2.4.1 multi-key localStorage format → IDB ───────────────
    try {
      const indexRaw = localStorage.getItem('hymnflow-bible-index');
      if (indexRaw) {
        const names = JSON.parse(indexRaw);
        for (const name of names) {
          const raw = localStorage.getItem(`hymnflow-bible-data-${name}`);
          if (raw) {
            try {
              const data = JSON.parse(raw);
              window.HymnFlowBibles[name] = data;
              await idbPut(name, data).catch(() => {});
              localStorage.removeItem(`hymnflow-bible-data-${name}`);
            } catch (e) { console.warn(`[Bible] Migration failed for ${name}:`, e); }
          }
        }
        localStorage.removeItem('hymnflow-bible-index');
      }
    } catch (e) { console.warn('[Bible] localStorage migration error:', e); }

    // ── Normal IDB restore ───────────────────────────────────────────────────
    try {
      const keys = await idbAllKeys();
      for (const name of keys) {
        if (window.HymnFlowBibles[name]) continue; // already migrated above
        try {
          const data = await idbGet(name);
          if (data) window.HymnFlowBibles[name] = data;
        } catch (e) { console.warn(`[Bible] Could not restore ${name}:`, e); }
      }
      const savedActive = localStorage.getItem(ACTIVE_KEY);
      activeTranslation = (savedActive && window.HymnFlowBibles[savedActive])
        ? savedActive
        : (Object.keys(window.HymnFlowBibles)[0] || '');
    } catch (e) { console.warn('[Bible] Could not restore translations:', e); }
  }

  // ── Public API ────────────────────────────────────────────────────────────
  window.HymnFlowBibleLookup = {
    isLoaded() {
      return Object.keys(window.HymnFlowBibles).length > 0;
    },

    listTranslations() {
      return Object.keys(window.HymnFlowBibles);
    },

    getActiveTranslation() {
      return activeTranslation;
    },

    setActiveTranslation(name) {
      if (!window.HymnFlowBibles[name]) return false;
      activeTranslation = name;
      try { localStorage.setItem(ACTIVE_KEY, name); } catch (e) { /* ignore */ }
      return true;
    },

    // Returns a Promise — callers must await before rendering Bible UI.
    restoreFromStorage() { return restoreBibles(); },

    // Imports a Bible JSON file under the given translation name.
    // Returns a Promise resolving to { ok, name, message, persisted }.
    importFile(file, name) {
      const fname = String((file && file.name) || '');
      const ext = fname.toLowerCase().split('.').pop();
      const F = window.HymnFlowBibleFormats;
      const derive = () => (F ? F.nameFromFileName(fname) : (fname.replace(/\.[^.]+$/, '').toUpperCase() || 'BIBLE'));

      // Stores a parsed Bible under a name and reports the result.
      const finish = (bibleData, nm) => {
        nm = nm || derive();
        const bookCount = Object.keys(bibleData).length;
        const verseCount = Object.values(bibleData).reduce((n, b) =>
          n + b.chapters.slice(1).reduce((s, ch) => s + (ch ? ch.length - 1 : 0), 0), 0);
        window.HymnFlowBibles[nm] = bibleData;
        if (!activeTranslation) activeTranslation = nm;
        return persistOne(nm, bibleData).then(persisted => {
          if (persisted) {
            try { localStorage.setItem(ACTIVE_KEY, activeTranslation); } catch (e2) { /* ignore */ }
          }
          return {
            ok: true,
            name: nm,
            message: `${nm} loaded \u2014 ${bookCount} books, ${verseCount.toLocaleString()} verses${persisted ? '' : ' (session only \u2014 storage unavailable)'}`,
            persisted,
          };
        });
      };

      // .zip / USFM: unzip and convert in the browser, no tools needed.
      if (ext === 'zip' || ext === 'usfm' || ext === 'sfm' || ext === 'ptx') {
        return (async () => {
          if (!F) return { ok: false, message: 'Import failed: file reader is not loaded' };
          try {
            const buf = await file.arrayBuffer();
            const texts = [];
            if (ext === 'zip') {
              const entries = await F.unzip(buf);
              const jsons = entries.filter(e => /\.(json|js)$/i.test(e.name)).sort((a, b) => b.size - a.size);
              for (const e of jsons) {
                try {
                  const d = parseBibleFile(await e.text());
                  return await finish(d, name || d.__label);
                } catch (err) { /* not a Bible file; try the next one */ }
              }
              for (const e of entries.filter(e => /\.(usfm|sfm|ptx|txt)$/i.test(e.name))) {
                texts.push({ name: e.name, text: await e.text() });
              }
            } else {
              texts.push({ name: fname, text: new TextDecoder('utf-8').decode(new Uint8Array(buf)) });
            }
            const r = F.parseUsfm(texts);
            if (!r.books) return { ok: false, message: 'Import failed: no Bible text was found in this file' };
            return await finish(r.data, name);
          } catch (err) {
            return { ok: false, message: `Import failed: ${err.message}` };
          }
        })();
      }

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          let bibleData;
          try {
            bibleData = parseBibleFile(e.target.result);
          } catch (err) {
            resolve({ ok: false, message: `Import failed: ${err.message}` });
            return;
          }
          resolve(finish(bibleData, name || bibleData.__label));
        };
        reader.onerror = () => resolve({ ok: false, message: 'Could not read file' });
        reader.readAsText(file);
      });
    },

    // Imports already-loaded data (a parsed object/array, not a File) under the
    // given name. Used for first-run auto-seeding from a bundled JS global.
    // Accepts the raw source array format or the HymnFlow object format.
    // Returns a Promise resolving to { ok, name, persisted }.
    importParsed(content, name) {
      let bibleData;
      try {
        bibleData = Array.isArray(content) ? convertRawArray(content) : content;
      } catch (err) {
        return Promise.resolve({ ok: false, message: `Seed failed: ${err.message}` });
      }
      if (!bibleData || !bibleData.GEN) {
        return Promise.resolve({ ok: false, message: 'Seed data not in a recognised format' });
      }
      window.HymnFlowBibles[name] = bibleData;
      if (!activeTranslation) activeTranslation = name;
      return persistOne(name, bibleData).then(persisted => {
        if (persisted) {
          try { localStorage.setItem(ACTIVE_KEY, activeTranslation); } catch (e) { /* ignore */ }
        }
        return { ok: true, name, persisted };
      });
    },

    // Removes a translation from memory and storage.
    removeBible(name) {
      if (!window.HymnFlowBibles[name]) return;
      delete window.HymnFlowBibles[name];
      removeFromStorage(name);
      if (activeTranslation === name) {
        activeTranslation = Object.keys(window.HymnFlowBibles)[0] || '';
        try { localStorage.setItem(ACTIVE_KEY, activeTranslation); } catch (e) { /* ignore */ }
      }
    },

    // Returns { found, reference, text, verseCount } or { found: false, error }
    // text uses blank-line separation between verses so QS chunk nav works.
    lookup(refStr) {
      if (!this.isLoaded()) {
        return { found: false, error: 'Bible not loaded — import a translation in the Library tab' };
      }
      const bible = window.HymnFlowBibles[activeTranslation];
      if (!bible) {
        return { found: false, error: 'No active translation — select one in the Library tab' };
      }
      const parsed = parseRef(refStr);
      if (!parsed) {
        return { found: false, error: 'Format: "Book Chapter:Verse" — e.g. John 3:16  or  Ps 23  or  Jn 3 16  or  1Cor 13:4' };
      }

      const { bookCode, chapter, verseStart, verseEnd } = parsed;
      const bookData = bible[bookCode];
      if (!bookData) {
        return { found: false, error: `Book not recognised: "${refStr}"` };
      }
      const chapterArr = bookData.chapters[chapter];
      if (!chapterArr) {
        return { found: false, error: `${bookData.name} does not have chapter ${chapter}` };
      }

      if (verseStart === null) {
        const allVerses = chapterArr.slice(1);
        const reference = `${bookData.name} ${chapter} (${activeTranslation})`;
        const text = allVerses.map((t, i) => `${i + 1} ${t}`).join('\n\n');
        return { found: true, reference, text, verseCount: allVerses.length };
      }

      const verses = [];
      for (let v = verseStart; v <= verseEnd; v++) {
        const vText = chapterArr[v];
        if (vText == null) {
          return { found: false, error: `${bookData.name} ${chapter} does not have verse ${v}` };
        }
        verses.push(vText);
      }

      const rangeStr = verseEnd > verseStart ? `${verseStart}-${verseEnd}` : `${verseStart}`;
      const reference = `${bookData.name} ${chapter}:${rangeStr} (${activeTranslation})`;
      const text = verses.length === 1
        ? verses[0]
        : verses.map((t, i) => `${verseStart + i} ${t}`).join('\n\n');

      return { found: true, reference, text, verseCount: verses.length };
    },

    // Helper: canParse without needing data loaded
    canParse(refStr) {
      return parseRef(refStr) !== null;
    },
  };
})();
