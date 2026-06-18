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
    songofsolomon:'SNG',song:'SNG',sng:'SNG',sos:'SNG',ss:'SNG',canticles:'SNG',
    isaiah:'ISA',isa:'ISA',
    jeremiah:'JER',jer:'JER',
    lamentations:'LAM',lam:'LAM',
    ezekiel:'EZK',ezk:'EZK',eze:'EZK',ezek:'EZK',
    daniel:'DAN',dan:'DAN',
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
    romans:'ROM',rom:'ROM',ro:'ROM',
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
    revelation:'REV',rev:'REV',re:'REV',apoc:'REV',
  };

  function resolveBook(raw) {
    const key = raw.toLowerCase().replace(/[\s.]/g, '');
    return ALIASES[key] || null;
  }

  // Parses references like:
  //   "Jude 1"             → whole chapter
  //   "John 3:16"          → single verse
  //   "John 3:16-18"       → verse range
  //   "1 Cor 13:4-7"       → numbered-book + range
  //   "Psalm 23:1"         → standard
  //   "Rev 22:20-21"       → end of Bible
  function parseRef(refStr) {
    const s = refStr.trim();
    // Group 1: optional leading digit + space (e.g. "1 " in "1 Cor")
    // Group 2: book name letters
    // Group 3: chapter
    // Group 4: verse start (optional — omit for whole chapter)
    // Group 5: verse end (optional)
    const m = s.match(/^(\d\s+)?([A-Za-z]+)\s+(\d+)(?::(\d+)(?:\s*[-–]\s*(\d+))?)?$/);
    if (!m) return null;
    const prefix = (m[1] || '').replace(/\s/g, '');
    const bookRaw = prefix + m[2];
    const chapter = parseInt(m[3], 10);
    const verseStart = m[4] ? parseInt(m[4], 10) : null; // null = whole chapter
    const verseEnd = m[5] ? parseInt(m[5], 10) : verseStart;
    if (verseStart !== null && verseEnd < verseStart) return null;
    const bookCode = resolveBook(bookRaw);
    if (!bookCode) return null;
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
    throw new Error('Unrecognised Bible JSON format');
  }

  // ── Storage ───────────────────────────────────────────────────────────────
  const INDEX_KEY  = 'hymnflow-bible-index';  // JSON array of loaded translation names
  const ACTIVE_KEY = 'hymnflow-bible-active'; // name of active translation
  const LEGACY_KEY = 'hymnflow-bible-kjv';    // old single-translation key (pre-v2.4.1)
  const dataKey = name => `hymnflow-bible-data-${name}`;

  window.HymnFlowBibles = {};
  let activeTranslation = '';

  function saveIndex() {
    try {
      localStorage.setItem(INDEX_KEY, JSON.stringify(Object.keys(window.HymnFlowBibles)));
    } catch (e) { /* ignore */ }
  }

  function persistOne(name, data) {
    try {
      localStorage.setItem(dataKey(name), JSON.stringify(data));
      saveIndex();
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') return false;
      throw e;
    }
  }

  function removeFromStorage(name) {
    try { localStorage.removeItem(dataKey(name)); } catch (e) { /* ignore */ }
    saveIndex();
  }

  function restoreBibles() {
    // Migrate legacy single-key format to multi-translation format
    try {
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy && !localStorage.getItem(INDEX_KEY)) {
        window.HymnFlowBibles['KJV'] = JSON.parse(legacy);
        activeTranslation = 'KJV';
        localStorage.setItem(dataKey('KJV'), legacy);
        localStorage.setItem(INDEX_KEY, JSON.stringify(['KJV']));
        localStorage.setItem(ACTIVE_KEY, 'KJV');
        localStorage.removeItem(LEGACY_KEY);
        return;
      }
    } catch (e) { console.warn('[Bible] Legacy migration error:', e); }

    try {
      const indexRaw = localStorage.getItem(INDEX_KEY);
      if (!indexRaw) return;
      const names = JSON.parse(indexRaw);
      names.forEach(name => {
        try {
          const raw = localStorage.getItem(dataKey(name));
          if (raw) window.HymnFlowBibles[name] = JSON.parse(raw);
        } catch (e) { console.warn(`[Bible] Could not restore ${name}:`, e); }
      });
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

    restoreFromStorage: restoreBibles,

    // Imports a Bible JSON file under the given translation name.
    // Returns a Promise resolving to { ok, name, message, persisted }.
    importFile(file, name) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const bibleData = parseBibleFile(e.target.result);
            const bookCount = Object.keys(bibleData).length;
            const verseCount = Object.values(bibleData).reduce((n, b) =>
              n + b.chapters.slice(1).reduce((s, ch) => s + (ch ? ch.length - 1 : 0), 0), 0);
            window.HymnFlowBibles[name] = bibleData;
            if (!activeTranslation) activeTranslation = name;
            const persisted = persistOne(name, bibleData);
            if (persisted) {
              try { localStorage.setItem(ACTIVE_KEY, activeTranslation); } catch (e2) { /* ignore */ }
            }
            resolve({
              ok: true,
              name,
              message: `${name} loaded — ${bookCount} books, ${verseCount.toLocaleString()} verses${persisted ? '' : ' (session only — storage full)'}`,
              persisted,
            });
          } catch (err) {
            resolve({ ok: false, message: `Import failed: ${err.message}` });
          }
        };
        reader.onerror = () => resolve({ ok: false, message: 'Could not read file' });
        reader.readAsText(file);
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
        return { found: false, error: 'Format: "Book Chapter" or "Book Chapter:Verse" — e.g. Ps 23 or John 3:16' };
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
