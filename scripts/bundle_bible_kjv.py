#!/usr/bin/env python3
"""
HymnFlow Bible Bundle Generator
Downloads the KJV Bible (public domain) and converts it to HymnFlow format.

Output: public/data/bible-kjv.js  (sets window.HymnFlowBible)

Usage:
    python scripts/bundle_bible_kjv.py
    python scripts/bundle_bible_kjv.py --local path/to/kjv.json

Source: https://github.com/aruljohn/Bible-kjv (public domain)
Expected input format:
  [
    { "abbrev": "gn", "book": "Genesis",
      "chapters": [["verse1", "verse2", ...], ...] },
    ...
  ]
  Chapters and verses are 0-indexed in the source; we convert to 1-indexed output.
"""

import json
import os
import sys
import urllib.request

# Tried in order until one succeeds
KJV_URLS = [
    "https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_kjv.json",
    "https://raw.githubusercontent.com/aruljohn/Bible-kjv/main/kjv.json",
    "https://raw.githubusercontent.com/aruljohn/Bible-kjv/master/kjv.json",
]

# Full book names in canonical order — fallback when source JSON lacks a "name" field
BOOK_NAMES = [
    "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth",
    "1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles",
    "Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes",
    "Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel",
    "Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk",
    "Zephaniah","Haggai","Zechariah","Malachi",
    "Matthew","Mark","Luke","John","Acts","Romans",
    "1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians",
    "Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy",
    "Titus","Philemon","Hebrews","James","1 Peter","2 Peter",
    "1 John","2 John","3 John","Jude","Revelation",
]

# Standard 3-letter codes in canonical order (matches aruljohn source order)
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


def load_source(local_path=None):
    if local_path:
        print(f"Loading from local file: {local_path}")
        for enc in ("utf-8-sig", "utf-8"):
            try:
                with open(local_path, encoding=enc) as f:
                    return json.load(f)
            except (UnicodeDecodeError, json.JSONDecodeError):
                continue
        raise ValueError(f"Could not decode {local_path}")

    last_err = None
    for url in KJV_URLS:
        print(f"Trying {url} ...")
        try:
            with urllib.request.urlopen(url, timeout=30) as resp:
                raw = resp.read()
            # Handle optional UTF-8 BOM
            for enc in ("utf-8-sig", "utf-8"):
                try:
                    data = json.loads(raw.decode(enc))
                    print(f"  Downloaded {len(data)} books.")
                    return data
                except (UnicodeDecodeError, json.JSONDecodeError):
                    continue
        except Exception as e:
            print(f"  Failed: {e}")
            last_err = e
    raise RuntimeError(f"All download sources failed. Last error: {last_err}")


def convert(source_data):
    """Convert 0-indexed source to 1-indexed HymnFlow format.

    Output structure:
      {
        "GEN": { "name": "Genesis", "chapters": [null, [null, "v1", "v2", ...], ...] },
        ...
      }
    chapters[0] = null  (1-based index — chapter 1 is at index 1)
    chapters[1][0] = null  (1-based index — verse 1 is at index 1)
    """
    if len(source_data) != len(BOOK_CODES):
        print(
            f"WARNING: Expected {len(BOOK_CODES)} books, got {len(source_data)}. "
            "Book codes may be misaligned."
        )

    result = {}
    for i, book_entry in enumerate(source_data):
        if i >= len(BOOK_CODES):
            break
        code = BOOK_CODES[i]
        name = book_entry.get("name") or book_entry.get("book") or (BOOK_NAMES[i] if i < len(BOOK_NAMES) else code)

        # 1-indexed chapters: chapters[0] = null placeholder
        chapters_1indexed = [None]
        for ch in book_entry.get("chapters", []):
            # 1-indexed verses: verses[0] = null placeholder
            verses_1indexed = [None] + list(ch)
            chapters_1indexed.append(verses_1indexed)

        result[code] = {"name": name, "chapters": chapters_1indexed}

    return result


def write_js(bible_data, output_path):
    print(f"Writing {output_path} ...")
    total_verses = sum(
        len(ch) - 1
        for book in bible_data.values()
        for ch in book["chapters"]
        if ch is not None
    )
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("// HymnFlow Bible Bundle — King James Version (Public Domain)\n")
        f.write("// Generated by scripts/bundle_bible_kjv.py\n")
        f.write(f"// {len(bible_data)} books, {total_verses:,} verses\n")
        f.write("// Structure: window.HymnFlowBible[\"GEN\"].chapters[1][1] = Genesis 1:1\n\n")
        f.write("window.HymnFlowBible = ")
        json.dump(bible_data, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")
    size_kb = os.path.getsize(output_path) / 1024
    print(f"  Done. {total_verses:,} verses, {size_kb:.0f} KB")


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.dirname(script_dir)
    output_path = os.path.join(repo_root, "public", "data", "bible-kjv.js")

    local_path = None
    if "--local" in sys.argv:
        idx = sys.argv.index("--local")
        if idx + 1 < len(sys.argv):
            local_path = sys.argv[idx + 1]
        else:
            print("Error: --local requires a file path argument")
            sys.exit(1)

    try:
        source = load_source(local_path)
        bible = convert(source)
        write_js(bible, output_path)
        print("\nBible bundle ready. Reload the HymnFlow dock to use Quick Scripture lookup.")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
