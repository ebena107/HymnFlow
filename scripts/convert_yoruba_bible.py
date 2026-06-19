#!/usr/bin/env python3
"""
Yoruba Bible text → HymnFlow JSON/JS converter.

Input format (Yoruba bible.txt):
  - TOC line (ignored)
  - Book + chapter headers: "Genesisi 1", "1 Samueli 3"
  - Section headings (no leading verse number): skipped
  - Verse lines: "1 text... 2 text... 3 text..."  (multiple inline verses per line)

Output (default --format js):
  window.HymnFlowBible = {...};  →  public/data/bible-yor.js

Usage:
  python scripts/convert_yoruba_bible.py "C:/path/Yoruba bible.txt"
  python scripts/convert_yoruba_bible.py input.txt -o public/data/bible-yor.js
  python scripts/convert_yoruba_bible.py input.txt --format json
"""

import argparse
import json
import os
import re
import sys

# ---------------------------------------------------------------------------
# Canonical book ordering
# ---------------------------------------------------------------------------
BOOK_CODES = [
    "GEN","EXO","LEV","NUM","DEU","JOS","JDG","RUT",
    "1SA","2SA","1KI","2KI","1CH","2CH","EZR","NEH",
    "EST","JOB","PSA","PRO","ECC","SNG","ISA","JER",
    "LAM","EZK","DAN","HOS","JOL","AMO","OBA","JON",
    "MIC","NAH","HAB","ZEP","HAG","ZEC","MAL",
    "MAT","MRK","LUK","JHN","ACT","ROM","1CO","2CO",
    "GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI",
    "TIT","PHM","HEB","JAS","1PE","2PE","1JN","2JN",
    "3JN","JUD","REV",
]

ENGLISH_NAMES = [
    "Genesis","Exodus","Leviticus","Numbers","Deuteronomy",
    "Joshua","Judges","Ruth","1 Samuel","2 Samuel",
    "1 Kings","2 Kings","1 Chronicles","2 Chronicles",
    "Ezra","Nehemiah","Esther","Job","Psalms","Proverbs",
    "Ecclesiastes","Song of Solomon","Isaiah","Jeremiah",
    "Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos",
    "Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah",
    "Haggai","Zechariah","Malachi",
    "Matthew","Mark","Luke","John","Acts","Romans",
    "1 Corinthians","2 Corinthians","Galatians","Ephesians",
    "Philippians","Colossians","1 Thessalonians","2 Thessalonians",
    "1 Timothy","2 Timothy","Titus","Philemon","Hebrews",
    "James","1 Peter","2 Peter","1 John","2 John","3 John",
    "Jude","Revelation",
]

CODE_TO_ENGLISH = dict(zip(BOOK_CODES, ENGLISH_NAMES))

# ---------------------------------------------------------------------------
# Yoruba book name → 3-letter code
# ---------------------------------------------------------------------------
_YORUBA_MAP = {
    "Genesisi":      "GEN",
    "Eksodu":        "EXO",
    "Lefitiku":      "LEV",
    "Numeri":        "NUM",
    "Deuteronomi":   "DEU",
    "Joṣua":         "JOS",  "Josua":        "JOS",
    "Onidajọ":       "JDG",  "Onidajo":      "JDG",
    "Rutu":          "RUT",
    "1 Samueli":     "1SA",
    "2 Samueli":     "2SA",
    "1 Ọba":         "1KI",  "1 Oba":        "1KI",
    "2 Ọba":         "2KI",  "2 Oba":        "2KI",
    "1 Kronika":     "1CH",
    "2 Kronika":     "2CH",
    "Esra":          "EZR",
    "Nehemiah":      "NEH",
    "Esteri":        "EST",
    "Jobu":          "JOB",
    "Psalmu":        "PSA",
    "Owe":           "PRO",
    "Oniwasu":       "ECC",
    "Orin":          "SNG",
    "Isaiah":        "ISA",
    "Jeremiah":      "JER",
    "Ẹkún":          "LAM",  "Ekun":         "LAM",
    "Esekieli":      "EZK",
    "Danieli":       "DAN",
    "Hosea":         "HOS",
    "Joeli":         "JOL",
    "Amosi":         "AMO",
    "Obadiah":       "OBA",
    "Jona":          "JON",
    "Mika":          "MIC",
    "Nahumu":        "NAH",
    "Habakuku":      "HAB",
    "Sefaniah":      "ZEP",
    "Hagai":         "HAG",
    "Sekariah":      "ZEC",
    "Malaki":        "MAL",
    "Matteu":        "MAT",
    "Marku":         "MRK",
    "Luku":          "LUK",
    "Johanu":        "JHN",
    "Iṣe":           "ACT",  "Ise":          "ACT",
    "Romu":          "ROM",
    "1 Korinti":     "1CO",
    "2 Korinti":     "2CO",
    "Galatia":       "GAL",
    "Efesu":         "EPH",
    "Filippi":       "PHP",
    "Kolosse":       "COL",
    "1 Tessalonika": "1TH",
    "2 Tessalonika": "2TH",
    "1 Timotiu":     "1TI",
    "2 Timotiu":     "2TI",
    "Titu":          "TIT",
    "Filemoni":      "PHM",
    "Heberu":        "HEB",
    "Jakọbu":        "JAS",  "Jakobu":       "JAS",
    "1 Peteru":      "1PE",
    "2 Peteru":      "2PE",
    "1 Johanu":      "1JN",
    "2 Johanu":      "2JN",
    "3 Johanu":      "3JN",
    "Juda":          "JUD",
    "Ifihàn":        "REV",  "Ifihan":       "REV",
}


def _norm(s):
    return re.sub(r'[\s.]', '', s).lower()


_LOOKUP = {_norm(k): (k, v) for k, v in _YORUBA_MAP.items()}


def resolve_book(raw):
    """Returns (yoruba_name, code) or None."""
    return _LOOKUP.get(_norm(raw))


# ---------------------------------------------------------------------------
# Chapter-header detection
# ---------------------------------------------------------------------------
_CHAPTER_RE = re.compile(r'^(.+?)\s+(\d+)\s*$')


def try_chapter_header(line):
    """Return (yoruba_name, code, chapter_num) or None."""
    m = _CHAPTER_RE.match(line)
    if not m:
        return None
    book_raw, chapter_num = m.group(1).strip(), int(m.group(2))
    resolved = resolve_book(book_raw)
    if resolved:
        yoruba_name, code = resolved
        return yoruba_name, code, chapter_num
    return None


# ---------------------------------------------------------------------------
# Inline verse splitting
# ---------------------------------------------------------------------------

def split_verses(text):
    """
    Split a line containing multiple inline-numbered verses into [(verse_num, verse_text)].

    Verse boundaries: a verse number appears at start of text or after ". " (period + space).
    Returns list of (int verse_num, str verse_text).
    """
    text = text.strip()
    if not text:
        return []

    # Split at punctuation + space + verse-number + space boundaries.
    # Verse boundaries in this text use period, comma, colon, semicolon, ? or !
    parts = re.split(r'(?<=[.,;:!?])\s+(?=\d+\s)', text)

    result = []
    for part in parts:
        part = part.strip()
        m = re.match(r'^(\d+)\s+(.*)', part, re.DOTALL)
        if m:
            result.append((int(m.group(1)), m.group(2).strip()))
    return result


# ---------------------------------------------------------------------------
# Parser
# ---------------------------------------------------------------------------

def parse(lines):
    """Yield (yoruba_name, code, chapter, verse, text) tuples."""
    current_code = None
    current_name = None
    current_chapter = None

    for lineno, raw in enumerate(lines, 1):
        line = raw.strip()
        if not line:
            continue

        # Skip TOC and testament heading lines
        if '|Old Testament|' in line or '|New Testament|' in line:
            continue
        if re.match(r'^The (Old|New) Testament', line, re.IGNORECASE):
            continue

        # Chapter header?
        header = try_chapter_header(line)
        if header:
            current_name, current_code, current_chapter = header
            continue

        # Verse line: starts with a digit
        if current_code and current_chapter and re.match(r'^\d+\s', line):
            for verse_num, verse_text in split_verses(line):
                yield current_name, current_code, current_chapter, verse_num, verse_text
            continue

        # Otherwise: section heading — skip


# ---------------------------------------------------------------------------
# Build HymnFlow structure
# ---------------------------------------------------------------------------

def build_bible(tuples):
    """Accumulate tuples into { code: { name, chapters } } with 1-based indexing."""
    books_raw = {}   # code → { name, chapters: {ch: {vs: text}} }

    for yoruba_name, code, ch, vs, text in tuples:
        if code not in books_raw:
            books_raw[code] = {"name": yoruba_name, "chapters": {}}
        books_raw[code]["chapters"].setdefault(ch, {})[vs] = text

    result = {}
    for code in BOOK_CODES:
        if code not in books_raw:
            continue
        entry = books_raw[code]
        chapters_dict = entry["chapters"]
        max_ch = max(chapters_dict)
        chapters_arr = [None]
        for ch_num in range(1, max_ch + 1):
            vd = chapters_dict.get(ch_num, {})
            if vd:
                max_vs = max(vd)
                verses_arr = [None] + [vd.get(v, "") for v in range(1, max_vs + 1)]
            else:
                verses_arr = [None]
            chapters_arr.append(verses_arr)
        result[code] = {"name": entry["name"], "chapters": chapters_arr}

    return result


# ---------------------------------------------------------------------------
# Output writers
# ---------------------------------------------------------------------------

def _stats(bible):
    total = sum(
        len(ch) - 1
        for book in bible.values()
        for ch in book["chapters"]
        if ch is not None
    )
    return len(bible), total


def write_js(bible, path, translation_name):
    n_books, n_verses = _stats(bible)
    with open(path, "w", encoding="utf-8") as f:
        f.write(f"// HymnFlow Bible Bundle — {translation_name}\n")
        f.write("// Generated by scripts/convert_yoruba_bible.py\n")
        f.write(f"// {n_books} books, {n_verses:,} verses\n")
        f.write('// Structure: window.HymnFlowBible["GEN"].chapters[1][1] = Genesis 1:1\n\n')
        f.write("window.HymnFlowBible = ")
        json.dump(bible, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")
    size_kb = os.path.getsize(path) / 1024
    print(f"  Wrote {path}  ({n_books} books, {n_verses:,} verses, {size_kb:.0f} KB)")


def write_json(bible, path):
    n_books, n_verses = _stats(bible)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(bible, f, ensure_ascii=False, separators=(",", ":"))
    size_kb = os.path.getsize(path) / 1024
    print(f"  Wrote {path}  ({n_books} books, {n_verses:,} verses, {size_kb:.0f} KB)")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Convert Yoruba Bible text to HymnFlow JSON/JS format."
    )
    parser.add_argument("input", help="Input .txt file")
    parser.add_argument("-o", "--output", help="Output file (default: public/data/bible-yor.js)")
    parser.add_argument("--format", choices=["js", "json"], default="js")
    parser.add_argument("--name", default="Yoruba Bible (Bibeli Mimo)")
    args = parser.parse_args()

    if not os.path.isfile(args.input):
        print(f"Error: file not found: {args.input}", file=sys.stderr)
        sys.exit(1)

    lines = None
    for enc in ("utf-8-sig", "utf-8", "latin-1"):
        try:
            with open(args.input, encoding=enc) as f:
                lines = f.readlines()
            print(f"Read {len(lines):,} lines  (encoding: {enc})")
            break
        except UnicodeDecodeError:
            continue
    if lines is None:
        print("Error: could not decode file (tried utf-8-sig, utf-8, latin-1)", file=sys.stderr)
        sys.exit(1)

    tuples = list(parse(lines))
    if not tuples:
        print("Error: no verses parsed — check the input file.", file=sys.stderr)
        sys.exit(1)
    print(f"Parsed {len(tuples):,} verses")

    bible = build_bible(tuples)
    print(f"Built {len(bible)} books")

    # Report any missing books
    missing = [c for c in BOOK_CODES if c not in bible]
    if missing:
        print(f"  WARNING: {len(missing)} books missing from output: {missing}")

    if not args.output:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        repo_root = os.path.dirname(script_dir)
        ext = ".js" if args.format == "js" else ".json"
        args.output = os.path.join(repo_root, "public", "data", f"bible-yor{ext}")

    if args.format == "js":
        write_js(bible, args.output, args.name)
    else:
        write_json(bible, args.output)

    print("Done.")


if __name__ == "__main__":
    main()
