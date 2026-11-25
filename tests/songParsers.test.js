const assert = require('node:assert');
const P = require('../public/parsers/songParsers.js');

// Plain lyrics (SongSelect / Hymnary style)
let [h] = P.parsePlainSongText(`Amazing Grace\n\nVerse 1\nAmazing grace\nhow sweet\n\nChorus\nMy chains are gone\n\nJohn Newton\nCCLI Song # 22025\n© Public Domain\n`);
assert.equal(h.title, 'Amazing Grace');
assert.equal(h.author, 'John Newton');
assert.equal(h.chorus, 'My chains are gone');
assert.deepEqual(h.verses, ['Amazing grace\nhow sweet']);
assert.equal(h.metadata.ccli, '22025');

// ChordPro: chords stripped, multi-song, directives
let hs = P.parseChordProText('{title: A}\n{start_of_verse}\n[G]Hello [C]world\n{end_of_verse}\n{new_song}\n{title: B}\nLine');
assert.equal(hs.length, 2);
assert.deepEqual(hs[0].verses, ['Hello world']);

// USR
[h] = P.parseUsrText('[S A1]\nTitle=T\nAuthor=Me\nFields=Verse 1/tChorus\nWords=a/nb/tc');
assert.equal(h.author, 'Me'); assert.deepEqual(h.verses, ['a\nb']); assert.equal(h.chorus, 'c');

// Empty / junk input yields nothing, never throws
assert.deepEqual(P.parsePlainSongText(''), []);
assert.deepEqual(P.parseChordProText('# only a comment'), []);
console.log('songParsers: all tests passed');
