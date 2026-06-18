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

  window.HymnFlowBibleLookup = {
    isLoaded() {
      return !!(window.HymnFlowBible && typeof window.HymnFlowBible === 'object');
    },

    // Returns { found, reference, text, verseCount } or { found: false, error }
    // text uses blank-line separation between verses in a range so QS chunk nav works.
    lookup(refStr) {
      if (!this.isLoaded()) {
        return {
          found: false,
          error: 'Bible data not loaded. Run: python scripts/bundle_bible_kjv.py',
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
