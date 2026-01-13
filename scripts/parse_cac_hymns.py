import json
import re
import uuid
import datetime
import os

def generate_id():
    timestamp = int(datetime.datetime.now().timestamp() * 1000)
    random_part = uuid.uuid4().hex[:8]
    return f"hymn_{timestamp}_0_{random_part}"

def clean_line(text):
    if not text:
        return ""
    # Remove leading musical markers like "f", "mf", "cr", etc.
    text = re.sub(r'^(?:f|mf|p|cr|ff|mp|pp|mp|pp|mp|p|f)\b\s*', '', text, flags=re.IGNORECASE).strip()
    text = text.replace('\t', ' ').strip()
    return text

def is_likely_meter(text):
    t = text.strip().upper()
    if not t: return False
    # Meters like "8.8.8.8", "C.M.", "S.M.", "6.6.6"
    if re.fullmatch(r'[\d\.\+ \& a-zA-Z]+', t) and len(t) < 30:
        if any(char.isdigit() for char in t) and "." in t: return True
        if any(m in t.upper() for m in ["C.M", "L.M", "S.M", "P.M", "D.C"]): return True
    return False

def is_preamble_line(text):
    t = text.strip()
    if not t: return True
    
    # Check for meter
    if is_likely_meter(t): return True
    
    # Bible ref patterns
    # Matches "103:2" or "3.3" when associated with a book name
    if re.search(r'\d+\s*[:\.]\s*\d+', t):
        if len(t) < 120 and any(b in t.upper() for b in ["OD", "GEN", "PSA", "MAT", "ACT", "ROM", "COR", "REV", "JOH", "LUK", "MRK", "EXO"]):
            return True
    
    # Explicit check for known book-only lines or book+number
    books = ["OD", "GEN", "PSA", "MAT", "ACT", "ROM", "COR", "REV", "JOH", "LUK", "MRK", "EXO"]
    for book in books:
        if re.search(r'\b' + re.escape(book) + r'\.?\b', t.upper()) or t.upper().startswith(book):
            if len(t) < 120 and (re.search(r'\d', t) or ":" in t or "." in t):
                return True
            
    # Musical markers on their own line
    if t.lower() in ["f", "mf", "p", "cr", "ff", "mp", "pp"]: return True

    return False

def parse_file_content(content, source_abbr, source_name, expected_range, is_various):
    lines = content.split('\n')
    hymns_raw = []
    current_h_num = None
    current_h_block = []
    found_nums_in_chunk = set()

    for i, line_raw in enumerate(lines):
        line = line_raw.strip()
        if not line:
            if current_h_block: current_h_block.append(line_raw)
            continue
            
        m = re.match(r'^(\d+)\.?[\t\s]*(.*)$', line)
        is_h_start = False
        if m:
            num = int(m.group(1))
            meta = m.group(2).strip()
            
            in_range = False
            if is_various:
                if 1 <= num <= 50: in_range = True
            elif expected_range:
                if expected_range[0] <= num <= expected_range[1]: in_range = True
            
            if in_range and num not in found_nums_in_chunk:
                # Hymn Header Detection
                if not meta:
                    if i == 0 or not lines[i-1].strip() or "--- FILE:" in lines[i-1]:
                        is_h_start = True
                elif is_preamble_line(meta):
                    is_h_start = True
                elif is_various:
                    if i == 0 or not lines[i-1].strip():
                        is_h_start = True
                
        if is_h_start:
            if current_h_block and current_h_num is not None:
                hymns_raw.append({'num': current_h_num, 'lines': current_h_block})
            current_h_num = num
            found_nums_in_chunk.add(num)
            current_h_block = [line_raw]
        else:
            if current_h_block:
                current_h_block.append(line_raw)

    if current_h_block and current_h_num is not None:
        hymns_raw.append({'num': current_h_num, 'lines': current_h_block})

    final_hymns = []
    for h in hymns_raw:
        block_lines = h['lines']
        verses = []
        current_v = []
        found_first_v = False
        
        for line_raw in block_lines[1:]:
            line = line_raw.strip()
            if not line:
                if current_v: current_v.append("")
                continue
            
            # Verse detection
            v_match = re.match(r'^(\d+)[\t\s\.\)]+(.*)$', line)
            
            # CRITICAL FIX: Disambiguate verse number from meter (e.g. "7" at start of "7.7.7")
            is_new_verse = False
            if v_match and 1 <= int(v_match.group(1)) <= 15:
                # It's only a verse if the WHOLE line isn't a preamble (meter/bible ref)
                if not is_preamble_line(line):
                    is_new_verse = True
            
            if is_new_verse:
                if current_v:
                    verses.append("\n".join(current_v).strip())
                current_v = [v_match.group(2)]
                found_first_v = True
            elif not found_first_v:
                if is_preamble_line(line):
                    continue
                else:
                    # Start Verse 1 without a number
                    current_v = [line]
                    found_first_v = True
            else:
                current_v.append(line)
        
        if current_v:
            verses.append("\n".join(current_v).strip())
            
        if not verses: continue
        
        cleaned_verses = []
        for v in verses:
            if not v.strip(): continue
            v = re.sub(r'\s+Amen\.?$', '', v, flags=re.IGNORECASE).strip()
            v = re.sub(r'\s+Amin\.?$', '', v, flags=re.IGNORECASE).strip()
            
            v_lines = []
            for l in v.split('\n'):
                cl = clean_line(l)
                if cl: v_lines.append(cl)
            if v_lines:
                cleaned_verses.append("\n".join(v_lines))
        
        if not cleaned_verses: continue

        # Robust title extraction
        title = ""
        for line in cleaned_verses[0].split('\n'):
            line = line.strip()
            if not is_preamble_line(line):
                title = line
                break
        if not title:
            title = cleaned_verses[0].split('\n')[0].strip()

        final_hymns.append({
            "id": generate_id(),
            "title": title,
            "author": "Christ Apostolic Church (CAC) Worldwide",
            "verses": cleaned_verses,
            "chorus": "",
            "metadata": {
                "number": h['num'],
                "sourceAbbr": source_abbr,
                "source": source_name,
                "isVarious": is_various
            },
            "createdAt": datetime.datetime.now().isoformat() + "Z"
        })
        
    return final_hymns

def process_collection(input_path, output_path, source_abbr, source_name):
    if not os.path.exists(input_path): return 0
    with open(input_path, 'r', encoding='utf-8') as f:
        full_content = f.read()
    
    file_chunks = re.split(r'--- FILE: (.*) ---', full_content)
    all_hymns = []
    
    for i in range(1, len(file_chunks), 2):
        filename = file_chunks[i]
        content = file_chunks[i+1]
        is_various = "Various" in filename or "Oniruuru" in filename
        range_match = re.search(r'(\d+)\s*-\s*(\d+)', filename)
        expected_range = (int(range_match.group(1)), int(range_match.group(2))) if range_match else None
        
        file_hymns = parse_file_content(content, source_abbr, source_name, expected_range, is_various)
        all_hymns.extend(file_hymns)

    collection = {}
    for h in all_hymns:
        key = (h['metadata']['isVarious'], h['metadata']['number'])
        if key not in collection:
            collection[key] = h
            
    final_list = sorted(collection.values(), key=lambda x: (x['metadata']['isVarious'], x['metadata']['number']))
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(final_list, f, indent=2, ensure_ascii=False)
    
    mains = [h for h in final_list if not h['metadata']['isVarious']]
    various = [h for h in final_list if h['metadata']['isVarious']]
    print(f"{source_abbr}: {len(mains)} main, {len(various)} various. Total: {len(final_list)}")
    
    return len(final_list)

if __name__ == "__main__":
    process_collection("c:/dev/HymnFlow/temp_english.txt", "c:/dev/HymnFlow/hymn-bundle/cac_ghb.json", "CAC GHB", "Christ Apostolic Church Gospel Hymn Book")
    process_collection("c:/dev/HymnFlow/temp_yoruba.txt", "c:/dev/HymnFlow/hymn-bundle/cac_yhb.json", "CAC YHB", "Iwe Orin CAC")
