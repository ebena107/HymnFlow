import json
import os

# Hymn bundle directory
hymn_bundle_dir = r"c:\dev\HymnFlow\hymn-bundle"
output_file = os.path.join(hymn_bundle_dir, "metadata.json")

# Hymn book metadata
hymn_books = [
    {
        "filename": "cac_ghb.json",
        "name": "CAC Gospel Hymn Book",
        "fullName": "Christ Apostolic Church Gospel Hymn Book",
        "abbr": "CAC GHB",
        "description": "Complete collection of hymns from the Christ Apostolic Church Gospel Hymn Book"
    },
    {
        "filename": "cac_yhb.json",
        "name": "CAC Yoruba Hymn Book",
        "fullName": "Christ Apostolic Church Yoruba Hymn Book (Iwe Orin CAC)",
        "abbr": "CAC YHB",
        "description": "Yoruba hymns from the Christ Apostolic Church (Iwe Orin CAC)"
    },
    {
        "filename": "fws.json",
        "name": "Faith We Sing",
        "fullName": "The Faith We Sing Hymnal",
        "abbr": "FWS",
        "description": "Contemporary worship supplement hymnal"
    },
    {
        "filename": "nnbh.json",
        "name": "Nigerian Baptist Hymnal",
        "fullName": "Nigerian National Baptist Hymnal",
        "abbr": "NNBH",
        "description": "Traditional hymns from the Nigerian Baptist Convention"
    },
    {
        "filename": "umh.json",
        "name": "United Methodist Hymnal",
        "fullName": "The United Methodist Hymnal",
        "abbr": "UMH",
        "description": "Official hymnal of the United Methodist Church"
    },
    {
        "filename": "ybh.json",
        "name": "Yoruba Baptist Hymnal",
        "fullName": "Yoruba Baptist Hymnal",
        "abbr": "YBH",
        "description": "Baptist hymns in Yoruba language"
    }
]

metadata = []

for book in hymn_books:
    filepath = os.path.join(hymn_bundle_dir, book["filename"])
    
    if os.path.exists(filepath):
        # Get file size
        file_size = os.path.getsize(filepath)
        size_kb = file_size / 1024
        size_mb = size_kb / 1024
        
        # Format size string
        if size_mb >= 1:
            size_str = f"{size_mb:.2f} MB"
        else:
            size_str = f"{size_kb:.0f} KB"
        
        # Count hymns
        with open(filepath, 'r', encoding='utf-8') as f:
            hymns = json.load(f)
            hymn_count = len(hymns)
        
        # Add to metadata
        metadata.append({
            "filename": book["filename"],
            "name": book["name"],
            "fullName": book["fullName"],
            "abbr": book["abbr"],
            "description": book["description"],
            "size": size_str,
            "sizeBytes": file_size,
            "hymnCount": hymn_count,
            "githubUrl": f"https://raw.githubusercontent.com/ebena107/HymnFlow/master/hymn-bundle/{book['filename']}"
        })
        
        print(f"✓ {book['name']}: {hymn_count} hymns, {size_str}")
    else:
        print(f"✗ {book['filename']} not found")

# Write metadata file
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(metadata, f, indent=2, ensure_ascii=False)

print(f"\n✓ Metadata generated: {output_file}")
print(f"Total hymn books: {len(metadata)}")
