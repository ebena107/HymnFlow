import json
import os
import random
from datetime import datetime, timezone

BUNDLE_DIR = os.path.join("c:\\dev\\HymnFlow", "hymn-bundle")

last_timestamp = 0
same_time_counter = 0


def generate_unique_hymn_id():
    global last_timestamp, same_time_counter
    now = int(datetime.now(timezone.utc).timestamp() * 1000)
    if now == last_timestamp:
        same_time_counter += 1
    else:
        last_timestamp = now
        same_time_counter = 0
    random_part = "".join(random.choices("abcdefghijklmnopqrstuvwxyz0123456789", k=8))
    return f"hymn_{now}_{same_time_counter}_{random_part}"


def is_valid_iso_date(value):
    if not isinstance(value, str):
        return False
    try:
        datetime.fromisoformat(value.replace("Z", "+00:00"))
        return True
    except ValueError:
        return False


def normalize_text(value, default=""):
    if value is None:
        return default
    if not isinstance(value, str):
        value = str(value)
    value = value.strip()
    return value if value else default


def normalize_verses(value):
    if isinstance(value, list):
        raw = value
    elif isinstance(value, str):
        raw = [value]
    else:
        raw = []

    verses = []
    for item in raw:
        if item is None:
            continue
        if not isinstance(item, str):
            item = str(item)
        item = item.strip()
        if item:
            verses.append(item)
    return verses


def normalize_metadata(value):
    if isinstance(value, dict) and not isinstance(value, list):
        return value
    return {}


def normalize_hymn(hymn):
    if not isinstance(hymn, dict):
        hymn = {}

    hymn_id = hymn.get("id")
    if not isinstance(hymn_id, str) or not hymn_id.strip():
        hymn_id = generate_unique_hymn_id()

    title = normalize_text(hymn.get("title"), "Untitled")
    author = normalize_text(hymn.get("author"), "")
    chorus = normalize_text(hymn.get("chorus"), "")
    verses = normalize_verses(hymn.get("verses"))
    metadata = normalize_metadata(hymn.get("metadata"))

    created_at = hymn.get("createdAt")
    if not is_valid_iso_date(created_at):
        created_at = None

    normalized = {
        "id": hymn_id,
        "title": title,
        "author": author,
        "verses": verses,
        "chorus": chorus,
        "metadata": metadata
    }

    if created_at:
        normalized["createdAt"] = created_at

    return normalized


def optimize_file(file_path):
    with open(file_path, "r", encoding="utf-8") as handle:
        data = json.load(handle)

    if isinstance(data, dict) and isinstance(data.get("hymns"), list):
        data["hymns"] = [normalize_hymn(hymn) for hymn in data["hymns"]]
        if "count" in data:
            data["count"] = len(data["hymns"])
    elif isinstance(data, list):
        data = [normalize_hymn(hymn) for hymn in data]

    with open(file_path, "w", encoding="utf-8") as handle:
        json.dump(data, handle, indent=2, ensure_ascii=False)
        handle.write("\n")


def main():
    if not os.path.isdir(BUNDLE_DIR):
        raise SystemExit(f"Hymn bundle directory not found: {BUNDLE_DIR}")

    json_files = []
    for filename in os.listdir(BUNDLE_DIR):
        if not filename.lower().endswith(".json"):
            continue
        if filename.lower() == "metadata.json":
            continue
        json_files.append(os.path.join(BUNDLE_DIR, filename))

    if not json_files:
        raise SystemExit("No JSON files found in hymn bundle directory.")

    for file_path in sorted(json_files):
        optimize_file(file_path)
        print(f"Optimized {os.path.basename(file_path)}")


if __name__ == "__main__":
    main()
