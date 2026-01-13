import json
import os

def check_missing(file_path):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    mains = [h['metadata']['number'] for h in data if not h['metadata']['isVarious']]
    various = [h['metadata']['number'] for h in data if h['metadata']['isVarious']]
    
    missing_mains = sorted(list(set(range(1, 992)) - set(mains)))
    print(f"\nFile: {os.path.basename(file_path)}")
    print(f"Missing Mains ({len(missing_mains)}): {missing_mains}")
    print(f"Various Count: {len(various)} (Numbers: {sorted(various)})")

check_missing("c:/dev/HymnFlow/public/data/cac_ghb.json")
check_missing("c:/dev/HymnFlow/public/data/cac_yhb.json")
