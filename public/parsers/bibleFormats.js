/**
 * Bible file readers so a church can simply drop a downloaded file into the dock.
 *
 *  - unzip(arrayBuffer)       : minimal .zip reader (stored + deflate), no libraries
 *  - parseUsfm(files)         : USFM (.usfm/.sfm) -> HymnFlow Bible object
 *  - nameFromFileName(name)   : "NTBT-json.zip" -> "NTBT"
 *
 * Everything runs locally in the browser; content is only ever treated as data.
 */
(function (root) {
  'use strict';

  const MAX_ENTRY_BYTES = 60 * 1024 * 1024; // refuse zip bombs
  const MAX_ENTRIES = 3000;

  const BOOK_CODES = [
    'GEN','EXO','LEV','NUM','DEU','JOS','JDG','RUT','1SA','2SA','1KI','2KI','1CH','2CH','EZR','NEH',
    'EST','JOB','PSA','PRO','ECC','SNG','ISA','JER','LAM','EZK','DAN','HOS','JOL','AMO','OBA','JON',
    'MIC','NAH','HAB','ZEP','HAG','ZEC','MAL','MAT','MRK','LUK','JHN','ACT','ROM','1CO','2CO','GAL',
    'EPH','PHP','COL','1TH','2TH','1TI','2TI','TIT','PHM','HEB','JAS','1PE','2PE','1JN','2JN','3JN','JUD','REV',
  ];
  const ALIAS = { NAM: 'NAH', JOE: 'JOL', EZE: 'EZK', SOS: 'SNG', SON: 'SNG', PHI: 'PHP', JAM: 'JAS' };

  // Translated text with an English fallback (works before/without the i18n module, e.g. in tests).
  function tr(key, fallback, params) {
    try {
      const I = window.HymnFlowI18n;
      const en = window.HymnFlowTranslations && window.HymnFlowTranslations.en;
      const known = en && key.split('.').reduce((o, k) => (o && typeof o === 'object') ? o[k] : undefined, en);
      if (I && typeof known === 'string') return I.getTranslation(key, params || {});
    } catch (e) { /* fall through to English */ }
    let out = fallback;
    Object.keys(params || {}).forEach(k => { out = out.split('{' + k + '}').join(String(params[k])); });
    return out;
  }

  // ── Zip ──────────────────────────────────────────────────────────────────
  async function unzip(buffer) {
    const bytes = new Uint8Array(buffer);
    const dv = new DataView(buffer);
    let eocd = -1;
    for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 22 - 65535); i--) {
      if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error(tr('zip.invalid', 'This does not look like a valid .zip file'));
    const count = dv.getUint16(eocd + 10, true);
    let p = dv.getUint32(eocd + 16, true);
    if (count === 0xffff || p === 0xffffffff) throw new Error(tr('zip.zip64', 'Very large .zip files (zip64) are not supported'));
    if (count > MAX_ENTRIES) throw new Error(tr('zip.tooMany', 'The .zip has too many files'));
    const dec = new TextDecoder('utf-8');
    const entries = [];
    let encrypted = false;
    for (let n = 0; n < count; n++) {
      if (p + 46 > bytes.length || dv.getUint32(p, true) !== 0x02014b50) throw new Error(tr('zip.damaged', 'The .zip file is damaged'));
      const flags = dv.getUint16(p + 8, true);
      const method = dv.getUint16(p + 10, true);
      const compSize = dv.getUint32(p + 20, true);
      const size = dv.getUint32(p + 24, true);
      const nameLen = dv.getUint16(p + 28, true);
      const extraLen = dv.getUint16(p + 30, true);
      const commentLen = dv.getUint16(p + 32, true);
      const local = dv.getUint32(p + 42, true);
      const name = dec.decode(bytes.subarray(p + 46, p + 46 + nameLen));
      p += 46 + nameLen + extraLen + commentLen;
      if (name.endsWith('/') || name.startsWith('__MACOSX/')) continue;
      if (flags & 1) { encrypted = true; continue; }
      entries.push({
        name, size,
        async bytes() {
          if (size > MAX_ENTRY_BYTES) throw new Error(tr('zip.tooLarge', 'A file inside the .zip is too large'));
          if (dv.getUint32(local, true) !== 0x04034b50) throw new Error(tr('zip.damaged', 'The .zip file is damaged'));
          const start = local + 30 + dv.getUint16(local + 26, true) + dv.getUint16(local + 28, true);
          const raw = bytes.subarray(start, start + compSize);
          if (method === 0) return raw;
          if (method !== 8) throw new Error(tr('zip.method', 'This .zip uses an unsupported compression method'));
          if (typeof DecompressionStream !== 'function') throw new Error(tr('zip.noUnzip', 'This browser cannot unzip files; unzip it first and drop the inner file'));
          const stream = new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
          const out = new Uint8Array(await new Response(stream).arrayBuffer());
          if (out.length > MAX_ENTRY_BYTES) throw new Error(tr('zip.tooLarge', 'A file inside the .zip is too large'));
          return out;
        },
        async text() { return new TextDecoder('utf-8').decode(await this.bytes()).replace(/^﻿/, ''); },
      });
    }
    if (!entries.length && encrypted) throw new Error(tr('zip.password', 'This .zip is password-protected'));
    return entries;
  }

  // ── USFM ─────────────────────────────────────────────────────────────────
  function cleanInline(s) {
    return s
      .replace(/\\f\s[\s\S]*?\\f\*/g, '')         // footnotes
      .replace(/\\x\s[\s\S]*?\\x\*/g, '')         // cross references
      .replace(/\\fig\s[\s\S]*?\\fig\*/g, '')     // figures
      .replace(/\\\+?w\s+([^|\\]*)(?:\|[^\\]*)?\\\+?w\*/g, '$1') // \w word|attrs\w*
      .replace(/\\\+?[a-z]+\d*\*?/gi, '')         // any remaining marker
      .replace(/\s+/g, ' ')
      .trim();
  }

  const SKIP = /^\\(id|ide|usfm|h\d?|toc\d|mt\d?|mte\d?|ms\d?|mr|s\d?|sr|r|rem|sp|d|cl|cp|ca|va|vp|b|periph|restore|sts)\b/;

  // files: [{name, text}] -> { data, books, title }
  function parseUsfm(files) {
    const data = {};
    let title = '';
    for (const f of files) {
      const text = String(f.text || '');
      const idm = text.match(/^\\id\s+([A-Z0-9]{3})/m);
      if (!idm) continue;
      let code = idm[1].toUpperCase();
      code = ALIAS[code] || code;
      if (BOOK_CODES.indexOf(code) < 0) continue; // apocrypha etc.
      const nm = text.match(/^\\toc1\s+(.+)$/m) || text.match(/^\\h\s+(.+)$/m) || text.match(/^\\mt1?\s+(.+)$/m);
      const bookName = nm ? cleanInline(nm[1]) : code;
      if (!title) { const t = text.match(/^\\id\s+[A-Z0-9]{3}\s+(.+)$/m); if (t) title = cleanInline(t[1]); }
      const chapters = [null];
      let ch = 0, verse = 0, buf = [];
      const flush = () => {
        if (ch > 0 && verse > 0) {
          if (!chapters[ch]) chapters[ch] = [null];
          const prev = chapters[ch][verse] || '';
          chapters[ch][verse] = (prev + ' ' + cleanInline(buf.join(' '))).trim();
        }
        buf = [];
      };
      for (const raw of text.replace(/\r/g, '').split('\n')) {
        const line = raw.trim();
        if (!line) continue;
        const cm = line.match(/^\\c\s+(\d+)/);
        if (cm) { flush(); ch = parseInt(cm[1], 10); verse = 0; if (!chapters[ch]) chapters[ch] = [null]; continue; }
        if (SKIP.test(line)) continue;
        const vm = line.match(/^\\v\s+(\d+)[a-z]?(?:[-–,]\d+[a-z]?)?\s*(.*)$/);
        if (vm) { flush(); verse = parseInt(vm[1], 10); buf.push(vm[2]); continue; }
        if (verse > 0) buf.push(line.replace(/^\\[a-z]+\d*\s*/i, (m) => (/^\\(f|x|w|add|nd|qs|wj|bk|k|tl)\b/i.test(m) ? m : ''))); // paragraph/poetry marker -> text
      }
      flush();
      for (let c = 1; c < chapters.length; c++) {
        if (!chapters[c]) { chapters[c] = [null]; continue; }
        for (let v = 1; v < chapters[c].length; v++) if (chapters[c][v] == null) chapters[c][v] = '';
      }
      if (chapters.length > 1) data[code] = { name: bookName, chapters };
    }
    return { data, books: Object.keys(data).length, title };
  }

  function nameFromFileName(fileName) {
    let n = String(fileName || '').replace(/\.[^.]+$/, '');
    n = n.replace(/[-_ .]+(json|usfm|usx|sfm|sqlite|text|texto|txt|bible|biblia)$/i, '');
    n = n.split(/[\\/]/).pop().split(/[^A-Za-z0-9]+/).filter(Boolean).pop() || 'BIBLE';
    return n.toUpperCase().slice(0, 20);
  }

  // One name for a set of per-book files, e.g. 41-MATyor.usfm + 42-MRKyor.usfm -> YOR.
  function commonName(fileNames) {
    const bases = (fileNames || []).map(n => String(n).replace(/^.*[\\/]/, '').replace(/\.[^.]+$/, ''));
    if (!bases.length) return 'BIBLE';
    let suf = bases[0];
    for (const b of bases.slice(1)) {
      let i = 0;
      while (i < suf.length && i < b.length && suf[suf.length - 1 - i] === b[b.length - 1 - i]) i++;
      suf = suf.slice(suf.length - i);
    }
    suf = suf.replace(/^[^A-Za-z]+/, '').replace(/[^A-Za-z0-9]+$/, '');
    return (suf.length >= 2 ? suf : 'BIBLE').toUpperCase().slice(0, 20);
  }

  const api = { unzip, parseUsfm, nameFromFileName, commonName, BOOK_CODES };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.HymnFlowBibleFormats = api;
})(typeof window !== 'undefined' ? window : globalThis);
