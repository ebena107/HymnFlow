// HymnFlow Bible Lookup
// Requires window.HymnFlowBible (from bible-kjv.js) for verse text.
// Reference parsing works without it; isLoaded() returns false until data is present.
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
    // Group 4: verse start
    // Group 5: verse end (optional)
    const m = s.match(/^(\d\s+)?([A-Za-z]+)\s+(\d+):(\d+)(?:\s*[-–]\s*(\d+))?$/);
    if (!m) return null;
    const prefix = (m[1] || '').replace(/\s/g, '');
    const bookRaw = prefix + m[2];
    const chapter = parseInt(m[3], 10);
    const verseStart = parseInt(m[4], 10);
    const verseEnd = m[5] ? parseInt(m[5], 10) : verseStart;
    if (verseEnd < verseStart) return null;
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
      // Raw source format — convert to HymnFlow format
      if (data.length < 66) throw new Error(`Only ${data.length} books found — expected 66`);
      return convertRawArray(data);
    }
    if (data && typeof data === 'object' && data.GEN) {
      // Already HymnFlow format
      return data;
    }
    throw new Error('Unrecognised Bible JSON format');
  }

  const STORAGE_KEY = 'hymnflow-bible-kjv';

  function persistBible(bibleData) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bibleData));
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') return false;
      throw e;
    }
  }

  function restoreBible() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        window.HymnFlowBible = JSON.parse(raw);
        return true;
      }
    } catch (e) {
      console.warn('[Bible] Could not restore from storage:', e);
    }
    return false;
  }

  // ── Public API ───────────────────────────────────────────────────────────
  window.HymnFlowBibleLookup = {
    isLoaded() {
      return !!(window.HymnFlowBible && typeof window.HymnFlowBible === 'object');
    },

    // Called on startup — restores previously imported Bible from localStorage.
    restoreFromStorage: restoreBible,

    // Imports Bible data from a File object (from <input type="file">).
    // Returns a Promise resolving to { ok, message, persisted }.
    importFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const bibleData = parseBibleFile(e.target.result);
            const bookCount = Object.keys(bibleData).length;
            const verseCount = Object.values(bibleData).reduce((n, b) =>
              n + b.chapters.slice(1).reduce((s, ch) => s + (ch ? ch.length - 1 : 0), 0), 0);
            window.HymnFlowBible = bibleData;
            const persisted = persistBible(bibleData);
            resolve({
              ok: true,
              message: `KJV loaded — ${bookCount} books, ${verseCount.toLocaleString()} verses${persisted ? '' : ' (session only — storage full)'}`,
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

    // Returns { found, reference, text, verseCount } or { found: false, error }
    // text uses blank-line separation between verses in a range so QS chunk nav works.
    lookup(refStr) {
      if (!this.isLoaded()) {
        return {
          found: false,
          error: 'Bible not loaded — use Import Bible JSON in the Library tab',
        };
      }
      const parsed = parseRef(refStr);
      if (!parsed) {
        return {
          found: false,
          error: 'Format: "Book Chapter:Verse" — e.g. John 3:16 or Rom 8:28-30',
        };
      }

      const { bookCode, chapter, verseStart, verseEnd } = parsed;
      const bookData = window.HymnFlowBible[bookCode];
      if (!bookData) {
        return { found: false, error: `Book not recognised: "${refStr}"` };
      }

      const chapterArr = bookData.chapters[chapter];
      if (!chapterArr) {
        return { found: false, error: `${bookData.name} does not have chapter ${chapter}` };
      }

      const verses = [];
      for (let v = verseStart; v <= verseEnd; v++) {
        const text = chapterArr[v];
        if (text == null) {
          return {
            found: false,
            error: `${bookData.name} ${chapter} does not have verse ${v}`,
          };
        }
        verses.push(text);
      }

      const rangeStr = verseEnd > verseStart ? `${verseStart}-${verseEnd}` : `${verseStart}`;
      const reference = `${bookData.name} ${chapter}:${rangeStr} (KJV)`;

      let text;
      if (verses.length === 1) {
        text = verses[0];
      } else {
        // Each verse numbered and blank-line separated → one QS chunk per verse
        text = verses.map((t, i) => `${verseStart + i} ${t}`).join('\n\n');
      }

      return { found: true, reference, text, verseCount: verses.length };
    },

    // Helper: canParse without needing data loaded (UI can show parse errors early)
    canParse(refStr) {
      return parseRef(refStr) !== null;
    },
  };
})();
