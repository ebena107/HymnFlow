#!/usr/bin/env python3
"""
HymnFlow Bible Text Converter
Converts a plain-text Bible file to HymnFlow JSON format.

Supported input formats (auto-detected):
  1. Verse-per-line     Genesis 1:1 In the beginning...
  2. Pipe-delimited     Genesis|1|1|In the beginning...
  3. Tab-delimited      Genesis\t1\t1\tIn the beginning...
  4. Headed             GENESIS\\nChapter 1\\n1 In the beginning...

Output (--format js, default):
  window.HymnFlowBible = {...};   (drop-in for public/data/bible-kjv.js)

Output (--format json):
  Raw JSON file

Usage:
  python scripts/convert_bible_txt.py input.txt
  python scripts/convert_bible_txt.py input.txt -o output.js
  python scripts/convert_bible_txt.py input.txt --format json -o bible.json
  python scripts/convert_bible_txt.py input.txt --name "New King James Version"
"""

import argparse
import json
import os
import re
import sys

# ---------------------------------------------------------------------------
# Book name / abbreviation → 3-letter HymnFlow code
# ---------------------------------------------------------------------------
BOOK_CODES = [
    "GEN", "EXO", "LEV", "NUM", "DEU", "JOS", "JDG", "RUT",
    "1SA", "2SA", "1KI", "2KI", "1CH", "2CH", "EZR", "NEH",
    "EST", "JOB", "PSA", "PRO", "ECC", "SNG", "ISA", "JER",
    "LAM", "EZK", "DAN", "HOS", "JOL", "AMO", "OBA", "JON",
    "MIC", "NAH", "HAB", "ZEP", "HAG", "ZEC", "MAL",
    "MAT", "MRK", "LUK", "JHN", "ACT", "ROM", "1CO", "2CO",
    "GAL", "EPH", "PHP", "COL", "1TH", "2TH", "1TI", "2TI",
    "TIT", "PHM", "HEB", "JAS", "1PE", "2PE", "1JN", "2JN",
    "3JN", "JUD", "REV",
]

BOOK_NAMES = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
    "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
    "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles",
    "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
    "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
    "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
    "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah",
    "Haggai", "Zechariah", "Malachi",
    "Matthew", "Mark", "Luke", "John", "Acts", "Romans",
    "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
    "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
    "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews",
    "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
    "Jude", "Revelation",
]

# Canonical full name → code
_NAME_TO_CODE = {name.lower(): code for name, code in zip(BOOK_NAMES, BOOK_CODES)}

# All aliases (abbreviations, alternate spellings) → code
_ALIASES = {
    # Old Testament
    "gen": "GEN", "gn": "GEN",
    "exo": "EXO", "ex": "EXO", "exod": "EXO",
    "lev": "LEV", "lv": "LEV",
    "num": "NUM", "nu": "NUM", "nb": "NUM", "numb": "NUM",
    "deu": "DEU", "dt": "DEU", "deut": "DEU",
    "jos": "JOS", "josh": "JOS",
    "jdg": "JDG", "jg": "JDG", "judg": "JDG",
    "rut": "RUT", "ru": "RUT",
    "1sa": "1SA", "1sam": "1SA", "1samuel": "1SA",
    "2sa": "2SA", "2sam": "2SA", "2samuel": "2SA",
    "1ki": "1KI", "1kgs": "1KI", "1kings": "1KI",
    "2ki": "2KI", "2kgs": "2KI", "2kings": "2KI",
    "1ch": "1CH", "1chr": "1CH", "1chron": "1CH", "1chronicles": "1CH",
    "2ch": "2CH", "2chr": "2CH", "2chron": "2CH", "2chronicles": "2CH",
    "ezr": "EZR",
    "neh": "NEH",
    "est": "EST", "esth": "EST",
    "job": "JOB",
    "psa": "PSA", "ps": "PSA", "psalm": "PSA",
    "pro": "PRO", "prov": "PRO", "prv": "PRO",
    "ecc": "ECC", "eccl": "ECC", "eccles": "ECC", "qoh": "ECC",
    "sng": "SNG", "song": "SNG", "sos": "SNG", "ss": "SNG",
    "songofsolomon": "SNG", "canticles": "SNG", "canticleofcanticles": "SNG",
    "isa": "ISA",
    "jer": "JER",
    "lam": "LAM",
    "ezk": "EZK", "eze": "EZK", "ezek": "EZK",
    "dan": "DAN",
    "hos": "HOS",
    "jol": "JOL", "joe": "JOL",
    "amo": "AMO", "am": "AMO",
    "oba": "OBA", "ob": "OBA", "obad": "OBA",
    "jon": "JON",
    "mic": "MIC",
    "nah": "NAH", "na": "NAH",
    "hab": "HAB",
    "zep": "ZEP", "zeph": "ZEP",
    "hag": "HAG", "hg": "HAG",
    "zec": "ZEC", "zech": "ZEC",
    "mal": "MAL",
    # New Testament
    "mat": "MAT", "matt": "MAT", "mt": "MAT",
    "mrk": "MRK", "mk": "MRK", "mr": "MRK",
    "luk": "LUK", "lk": "LUK",
    "jhn": "JHN", "jn": "JHN",
    "act": "ACT", "ac": "ACT",
    "rom": "ROM", "ro": "ROM",
    "1co": "1CO", "1cor": "1CO", "1corinth": "1CO", "1corinthians": "1CO",
    "2co": "2CO", "2cor": "2CO", "2corinth": "2CO", "2corinthians": "2CO",
    "gal": "GAL",
    "eph": "EPH",
    "php": "PHP", "phil": "PHP", "philipp": "PHP", "philippians": "PHP",
    "col": "COL",
    "1th": "1TH", "1thes": "1TH", "1thess": "1TH", "1thessalonians": "1TH",
    "2th": "2TH", "2thes": "2TH", "2thess": "2TH", "2thessalonians": "2TH",
    "1ti": "1TI", "1tim": "1TI", "1timothy": "1TI",
    "2ti": "2TI", "2tim": "2TI", "2timothy": "2TI",
    "tit": "TIT",
    "phm": "PHM", "philem": "PHM", "phile": "PHM",
    "heb": "HEB",
    "jas": "JAS", "jm": "JAS", "jms": "JAS",
    "1pe": "1PE", "1pet": "1PE", "1peter": "1PE",
    "2pe": "2PE", "2pet": "2PE", "2peter": "2PE",
    "1jn": "1JN", "1jo": "1JN", "1john": "1JN",
    "2jn": "2JN", "2jo": "2JN", "2john": "2JN",
    "3jn": "3JN", "3jo": "3JN", "3john": "3JN",
    "jud": "JUD", "jd": "JUD",
    "rev": "REV", "re": "REV", "apoc": "REV",
}


def normalize_book_key(raw: str) -> str:
    """Strip spaces/dots/hyphens, lowercase."""
    return re.sub(r"[\s.\-]", "", raw).lower()


def resolve_book(raw: str) -> str | None:
    key = normalize_book_key(raw)
    return _NAME_TO_CODE.get(key) or _ALIASES.get(key)


def canonical_name(code: str) -> str:
    idx = BOOK_CODES.index(code)
    return BOOK_NAMES[idx]


# ---------------------------------------------------------------------------
# Format detection
# ---------------------------------------------------------------------------

def detect_format(lines: list[str]) -> str:
    """
    Returns one of: 'verse_per_line', 'pipe', 'tab', 'headed'
    """
    sample = [l for l in lines if l.strip()][:40]

    pipe_hits = sum(1 for l in sample if l.count("|") >= 3)
    tab_hits  = sum(1 for l in sample if l.count("\t") >= 3)

    if pipe_hits >= len(sample) // 2:
        return "pipe"
    if tab_hits >= len(sample) // 2:
        return "tab"

    # Verse-per-line: starts with word(s) then chapter:verse number
    vpl_re = re.compile(r"^(?:\d\s)?\w[\w\s]{0,30}\d+:\d+\s")
    vpl_hits = sum(1 for l in sample if vpl_re.match(l.strip()))
    if vpl_hits >= len(sample) // 3:
        return "verse_per_line"

    return "headed"


# ---------------------------------------------------------------------------
# Parsers — each yields (book_raw, chapter, verse, text) tuples
# ---------------------------------------------------------------------------

def parse_verse_per_line(lines: list[str]):
    """
    Handles lines like:
      Genesis 1:1 In the beginning...
      1 Samuel 2:3 Talk no more so exceeding proudly...
      Ps 119:105 Thy word is a lamp...
    """
    # Greedy book name: one or two tokens (handles "1 Samuel", "Song of Solomon")
    pattern = re.compile(
        r"^((?:\d\s)?[A-Za-z]+(?:\s[A-Za-z]+)*?)\s+(\d+):(\d+)\s+(.+)$"
    )
    for lineno, raw in enumerate(lines, 1):
        line = raw.strip()
        if not line:
            continue
        m = pattern.match(line)
        if not m:
            print(f"  [skip ln {lineno}] {line[:80]}", file=sys.stderr)
            continue
        book_raw, ch, vs, text = m.group(1), int(m.group(2)), int(m.group(3)), m.group(4).strip()
        yield book_raw, ch, vs, text


def parse_delimited(lines: list[str], sep: str):
    """
    Handles pipe or tab delimited:
      Genesis|1|1|In the beginning...
      GEN\t1\t1\tIn the beginning...
    Column order: book, chapter, verse, text   (or chapter, verse, book, text — auto-tried)
    """
    for lineno, raw in enumerate(lines, 1):
        line = raw.strip()
        if not line:
            continue
        parts = line.split(sep)
        if len(parts) < 4:
            print(f"  [skip ln {lineno}] too few columns: {line[:80]}", file=sys.stderr)
            continue
        # Try book|ch|vs|text first
        book_raw, ch_s, vs_s, text = parts[0], parts[1], parts[2], sep.join(parts[3:])
        try:
            ch, vs = int(ch_s), int(vs_s)
        except ValueError:
            print(f"  [skip ln {lineno}] bad numbers: {line[:80]}", file=sys.stderr)
            continue
        yield book_raw.strip(), ch, vs, text.strip()


def parse_headed(lines: list[str]):
    """
    Handles structured text with book/chapter headings:
      GENESIS
      Chapter 1
      1 In the beginning...
      2 And the earth was...

    or:
      THE BOOK OF GENESIS
      CHAPTER 1
      VERSE 1  In the beginning...
    """
    book_raw = None
    chapter  = None
    # Chapter heading patterns
    ch_re  = re.compile(r"^(?:chapter|chap\.?|ch\.?)\s*(\d+)$", re.IGNORECASE)
    # Verse line: starts with optional "verse" keyword then number
    vs_re  = re.compile(r"^(?:verse\s+)?(\d+)\s+(.+)$", re.IGNORECASE)
    # Book heading: a line that resolves to a known book and has no digits (not a verse)
    digit_re = re.compile(r"\d+:\d+")

    for lineno, raw in enumerate(lines, 1):
        line = raw.strip()
        if not line:
            continue

        # Chapter heading?
        m = ch_re.match(line)
        if m:
            chapter = int(m.group(1))
            continue

        # Verse line?
        if chapter is not None and book_raw is not None:
            m = vs_re.match(line)
            if m:
                yield book_raw, chapter, int(m.group(1)), m.group(2).strip()
                continue

        # Could be a book heading — strip common prefixes and test
        candidate = re.sub(r"^(?:the\s+(?:book\s+of\s+)?)?", "", line, flags=re.IGNORECASE).strip()
        code = resolve_book(candidate)
        if code and not digit_re.search(line):
            book_raw = candidate
            chapter  = None
            continue

        # Unrecognised line — skip silently unless we're mid-book
        if book_raw:
            print(f"  [skip ln {lineno}] {line[:80]}", file=sys.stderr)


# ---------------------------------------------------------------------------
# Accumulator → HymnFlow structure
# ---------------------------------------------------------------------------

def build_bible(tuples) -> dict:
    """
    Accumulates (book_raw, chapter, verse, text) into:
      { "GEN": { "name": "Genesis", "chapters": [null, [null, "v1", ...], ...] } }
    """
    raw: dict[str, dict] = {}  # code → { name, chapters: {ch: {vs: text}} }
    skipped = 0

    for book_raw, ch, vs, text in tuples:
        code = resolve_book(book_raw)
        if not code:
            print(f"  [unknown book] '{book_raw}' — skipped", file=sys.stderr)
            skipped += 1
            continue
        if code not in raw:
            raw[code] = {"name": canonical_name(code), "chapters": {}}
        raw[code]["chapters"].setdefault(ch, {})[vs] = text

    if skipped:
        print(f"  WARNING: {skipped} verses skipped (unrecognised book names)", file=sys.stderr)

    # Sort into canonical book order and build 1-indexed arrays
    result = {}
    for code in BOOK_CODES:
        if code not in raw:
            continue
        book = raw[code]
        chapters_dict = book["chapters"]
        max_ch = max(chapters_dict.keys())
        # chapters[0] = null sentinel
        chapters_arr = [None]
        for ch_num in range(1, max_ch + 1):
            verses_dict = chapters_dict.get(ch_num, {})
            if verses_dict:
                max_vs = max(verses_dict.keys())
                # verses[0] = null sentinel
                verses_arr = [None] + [verses_dict.get(v, "") for v in range(1, max_vs + 1)]
            else:
                verses_arr = [None]
            chapters_arr.append(verses_arr)
        result[code] = {"name": book["name"], "chapters": chapters_arr}

    return result


# ---------------------------------------------------------------------------
# Output writers
# ---------------------------------------------------------------------------

def write_js(bible: dict, path: str, translation_name: str):
    total_verses = sum(
        len(ch) - 1
        for book in bible.values()
        for ch in book["chapters"]
        if ch is not None
    )
    with open(path, "w", encoding="utf-8") as f:
        f.write(f"// HymnFlow Bible Bundle — {translation_name}\n")
        f.write("// Generated by scripts/convert_bible_txt.py\n")
        f.write(f"// {len(bible)} books, {total_verses:,} verses\n")
        f.write('// Structure: window.HymnFlowBible["GEN"].chapters[1][1] = Genesis 1:1\n\n')
        f.write("window.HymnFlowBible = ")
        json.dump(bible, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")
    size_kb = os.path.getsize(path) / 1024
    print(f"  Wrote {path}  ({len(bible)} books, {total_verses:,} verses, {size_kb:.0f} KB)")


def write_json(bible: dict, path: str):
    total_verses = sum(
        len(ch) - 1
        for book in bible.values()
        for ch in book["chapters"]
        if ch is not None
    )
    with open(path, "w", encoding="utf-8") as f:
        json.dump(bible, f, ensure_ascii=False, separators=(",", ":"))
    size_kb = os.path.getsize(path) / 1024
    print(f"  Wrote {path}  ({len(bible)} books, {total_verses:,} verses, {size_kb:.0f} KB)")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Convert a plain-text Bible to HymnFlow JSON format."
    )
    parser.add_argument("input", help="Input text file")
    parser.add_argument("-o", "--output", help="Output file path (default: <input>.js or .json)")
    parser.add_argument(
        "--format", choices=["js", "json"], default="js",
        help="Output format: js (window.HymnFlowBible bundle) or json (default: js)"
    )
    parser.add_argument(
        "--detect-only", action="store_true",
        help="Print the detected input format and exit"
    )
    parser.add_argument(
        "--input-format",
        choices=["verse_per_line", "pipe", "tab", "headed"],
        help="Force a specific input format instead of auto-detecting"
    )
    parser.add_argument(
        "--name", default="Bible",
        help="Translation name used in the JS bundle header comment (default: Bible)"
    )
    args = parser.parse_args()

    # Read input
    if not os.path.isfile(args.input):
        print(f"Error: file not found: {args.input}", file=sys.stderr)
        sys.exit(1)

    for enc in ("utf-8-sig", "utf-8", "latin-1"):
        try:
            with open(args.input, encoding=enc) as f:
                lines = f.readlines()
            break
        except UnicodeDecodeError:
            continue
    else:
        print("Error: could not decode input file (tried utf-8, utf-8-sig, latin-1)", file=sys.stderr)
        sys.exit(1)

    print(f"Read {len(lines):,} lines from {args.input}")

    # Detect / force format
    fmt = args.input_format or detect_format(lines)
    print(f"Input format: {fmt}")
    if args.detect_only:
        return

    # Parse
    if fmt == "verse_per_line":
        tuples = parse_verse_per_line(lines)
    elif fmt == "pipe":
        tuples = parse_delimited(lines, "|")
    elif fmt == "tab":
        tuples = parse_delimited(lines, "\t")
    else:
        tuples = parse_headed(lines)

    bible = build_bible(tuples)

    if not bible:
        print("Error: no verses were parsed. Check the input format.", file=sys.stderr)
        sys.exit(1)

    # Default output path
    ext = ".js" if args.format == "js" else ".json"
    output = args.output or (os.path.splitext(args.input)[0] + ext)

    if args.format == "js":
        write_js(bible, output, args.name)
    else:
        write_json(bible, output)

    print("Done.")


if __name__ == "__main__":
    main()
