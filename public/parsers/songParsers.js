/**
 * Song-format parsers for lyrics downloaded from hymn sources.
 *
 *  - parsePlainSong : plain lyrics (Hymnary.org copy/paste, CCLI SongSelect .txt)
 *  - parseChordPro  : ChordPro (.cho / .chordpro / .chopro / .pro / .crd)
 *  - parseUsr       : CCLI SongSelect legacy USR (.usr)
 *
 * Each *Text function is pure (string in, hymn objects out) and each file
 * wrapper just reads the File. Output matches the other parsers:
 * { title, author, verses[], chorus, metadata }. Chords are discarded.
 * No code or HTML is ever evaluated; all values are plain strings.
 */
(function (root) {
  'use strict';

  const CHORUS_RE = /^(pre[- ]?chorus|chorus|refrain|coro|estribillo)\b/i;
  const SECTION_RE = /^\[?\s*(verse|v|stanza|chorus|refrain|pre[- ]?chorus|bridge|tag|intro|outro|ending|interlude|coda|vamp|coro|estribillo|verso)\s*\d*\s*\]?\s*:?\s*$/i;
  const MAX_TEXT = 5 * 1024 * 1024; // refuse absurdly large inputs

  function clean(s) { return String(s == null ? '' : s).replace(/\r/g, '').trim(); }

  function newHymn(title) {
    return { title: clean(title) || 'Untitled', author: '', verses: [], chorus: '', metadata: {} };
  }

  // Adds a finished section to a hymn: choruses fill `chorus` (first one wins,
  // later different ones are kept as extra verses), everything else is a verse.
  function pushSection(h, label, lines) {
    const text = lines.map(l => l.trim()).join('\n').trim();
    if (!text) return;
    if (CHORUS_RE.test(label || '')) {
      if (!h.chorus) h.chorus = text;
      else if (h.chorus !== text) h.verses.push(text);
    } else {
      h.verses.push(text);
    }
  }

  function applyFooterLine(h, line) {
    let m = line.match(/^CCLI\s*(?:Song\s*)?#?\s*[:]?\s*(\d{3,})/i);
    if (m) { h.metadata.ccli = m[1]; return true; }
    if (/^(?:©|\(c\)|copyright\b)/i.test(line)) {
      h.metadata.copyright = (h.metadata.copyright ? h.metadata.copyright + ' ' : '') + line;
      return true;
    }
    if (/^for use solely with the SongSelect/i.test(line) || /^CCLI License\s*#/i.test(line)) return true;
    return false;
  }

  // ── Plain lyrics ─────────────────────────────────────────────────────────
  // First non-empty line is the title; blank lines separate sections; an
  // optional section label line ("Verse 1", "Chorus", "[Bridge]") names them.
  function parsePlainSongText(text) {
    text = String(text || '').replace(/^﻿/, '');
    if (text.length > MAX_TEXT) throw new Error('File too large');
    const lines = text.replace(/\r/g, '').split('\n');
    let i = 0;
    while (i < lines.length && !lines[i].trim()) i++;
    if (i >= lines.length) return [];
    const h = newHymn(lines[i++]);
    let label = '';
    let buf = [];
    let seenLyrics = false;
    const flush = () => { pushSection(h, label, buf); buf = []; label = ''; };
    for (; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) { flush(); continue; }
      if (applyFooterLine(h, line)) { flush(); continue; }
      if (SECTION_RE.test(line)) { flush(); label = line.replace(/[\[\]:]/g, '').trim(); continue; }
      const by = line.match(/^(?:words|text|lyrics|author|by)\s*(?:and music)?\s*[:\-]\s*(.+)$/i);
      if (by && !seenLyrics) { h.author = by[1].trim(); continue; }
      seenLyrics = true;
      buf.push(line);
    }
    flush();
    // SongSelect puts the author(s) on a line just before the CCLI/copyright footer.
    if (!h.author && (h.metadata.ccli || h.metadata.copyright) && h.verses.length > 1) {
      const last = h.verses[h.verses.length - 1];
      if (!last.includes('\n') && last.length < 120) { h.author = last; h.verses.pop(); }
    }
    return h.verses.length || h.chorus ? finish([h]) : [];
  }

  // ── ChordPro ─────────────────────────────────────────────────────────────
  function parseChordProText(text) {
    text = String(text || '').replace(/^﻿/, '');
    if (text.length > MAX_TEXT) throw new Error('File too large');
    const hymns = [];
    let h = null;
    let label = '';
    let buf = [];
    const flush = () => { if (h) pushSection(h, label, buf); buf = []; };
    const start = (title) => { if (h) { flush(); hymns.push(h); } h = newHymn(title); label = ''; };
    for (const raw of text.replace(/\r/g, '').split('\n')) {
      const line = raw.trim();
      if (line.startsWith('#')) continue; // comment
      const dir = line.match(/^\{\s*([a-z_]+)\s*(?::\s*(.*?))?\s*\}$/i);
      if (dir) {
        const name = dir[1].toLowerCase();
        const val = clean(dir[2]);
        if (name === 'new_song' || name === 'ns') { start(''); continue; }
        if (name === 'title' || name === 't') { if (!h || h.verses.length || h.chorus) start(val); else h.title = val || h.title; continue; }
        if (!h) start('');
        if (name === 'author' || name === 'artist' || name === 'lyricist' || name === 'composer') { if (!h.author) h.author = val; continue; }
        if (name === 'ccli' || name === 'ccli_song_number') { h.metadata.ccli = val; continue; }
        if (name === 'copyright') { h.metadata.copyright = val; continue; }
        if (name === 'key') { h.metadata.key = val; continue; }
        if (name === 'start_of_chorus' || name === 'soc') { flush(); label = 'Chorus'; continue; }
        if (name === 'start_of_verse' || name === 'sov') { flush(); label = val || 'Verse'; continue; }
        if (name === 'start_of_bridge' || name === 'sob') { flush(); label = val || 'Bridge'; continue; }
        if (name === 'end_of_chorus' || name === 'eoc' || name === 'end_of_verse' || name === 'eov' ||
            name === 'end_of_bridge' || name === 'eob') { flush(); label = ''; continue; }
        if (name === 'comment' || name === 'c' || name === 'comment_italic' || name === 'ci') {
          if (SECTION_RE.test(val)) { flush(); label = val; }
          continue;
        }
        continue; // unknown directives are ignored
      }
      if (!line) { flush(); label = label && CHORUS_RE.test(label) ? label : ''; continue; }
      if (!h) start('');
      const lyric = line.replace(/\[[^\]]*\]/g, '').replace(/\s{2,}/g, ' ').trim(); // drop chords
      if (lyric) buf.push(lyric);
    }
    if (h) { flush(); hymns.push(h); }
    return finish(hymns.filter(x => x.verses.length || x.chorus));
  }

  // ── CCLI USR ─────────────────────────────────────────────────────────────
  // INI-like. Section "[S A<ccli>]" holds Title, Author, Copyright, Fields
  // (section names separated by "/t") and Words (text separated by "/t",
  // lines by "/n").
  function parseUsrText(text) {
    text = String(text || '').replace(/^﻿/, '');
    if (text.length > MAX_TEXT) throw new Error('File too large');
    const hymns = [];
    let h = null;
    let fields = [];
    const kv = {};
    const finishSong = () => {
      if (!h) return;
      const names = (kv.Fields || '').split('/t');
      const words = (kv.Words || '').split('/t');
      words.forEach((w, idx) => {
        pushSection(h, names[idx] || '', w.split('/n'));
      });
      h.title = clean(kv.Title) || h.title;
      h.author = clean(kv.Author);
      if (kv.Copyright) h.metadata.copyright = clean(kv.Copyright);
      if (kv.Admin) h.metadata.admin = clean(kv.Admin);
      if (kv.Keys) h.metadata.key = clean(kv.Keys);
      hymns.push(h);
      h = null;
      for (const k of Object.keys(kv)) delete kv[k];
    };
    for (const raw of text.replace(/\r/g, '').split('\n')) {
      const line = raw.trim();
      const sec = line.match(/^\[S\s*A?(\d*)\]$/i);
      if (sec) { finishSong(); h = newHymn(''); if (sec[1]) h.metadata.ccli = sec[1]; continue; }
      if (/^\[.*\]$/.test(line)) { continue; }
      const eq = line.indexOf('=');
      if (h && eq > 0) kv[line.slice(0, eq).trim()] = line.slice(eq + 1);
    }
    finishSong();
    return finish(hymns.filter(x => x.verses.length || x.chorus));
  }

  function finish(list) {
    // Trim metadata strings so the dock's validators and renderers get plain data.
    list.forEach(h => {
      for (const k of Object.keys(h.metadata)) {
        if (typeof h.metadata[k] !== 'string') h.metadata[k] = String(h.metadata[k]);
        h.metadata[k] = h.metadata[k].slice(0, 500);
      }
    });
    return list;
  }

  const api = {
    parsePlainSongText, parseChordProText, parseUsrText,
    parsePlainSong: async (file) => parsePlainSongText(await file.text()),
    parseChordPro: async (file) => parseChordProText(await file.text()),
    parseUsr: async (file) => parseUsrText(await file.text()),
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  Object.assign(root, { HymnFlowSongParsers: api });
})(typeof window !== 'undefined' ? window : globalThis);
