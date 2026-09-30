#!/usr/bin/env python3
"""
Process loadouts_raw.txt and generate worker/seed.ts with laser removed.
The raw format is messy, so this script does a best-effort parse:
- Removes the word 'laser' case-insensitively from any attachment list
- Normalizes semicolon separated attachments
- Outputs a TypeScript file with OPERATORS array
"""
import re
import sys

RAW_PATH = 'loadouts_raw.txt'
OUT_PATH = 'worker/seed.ts'

def clean_attachments(s):
    if not s:
        return []
    # Remove laser mentions
    s = re.sub(r'(?i)\blaser\b', '', s)
    # Split by semicolon or comma
    parts = re.split(r'[;,]', s)
    cleaned = [p.strip() for p in parts if p.strip()]
    return cleaned

def parse_raw(text):
    # Very naive parsing for demo: find operator blocks
    # This is a placeholder - in practice you'd structure the raw file better
    operators = []
    # Split by double newline
    blocks = text.split('\n\n')
    current = None
    for block in blocks:
        lines = [l.strip() for l in block.splitlines() if l.strip()]
        if not lines:
            continue
        # Detect operator name: line is capitalized word(s), not containing ':'
        if ':' not in lines[0] and len(lines[0]) < 30 and lines[0].islower() == False:
            # Assume new operator
            current = {
                'id': re.sub(r'[^a-z0-9]', '', lines[0].lower()),
                'name': lines[0],
                'role': 'Attacker' if 'attackers' in text.lower() else 'Defender',
                'category': '',
                'bestLoadout': {
                    'primary': '',
                    'primaryAttachments': [],
                    'secondary': '',
                    'secondaryAttachments': [],
                    'gadgets': [],
                    'notes': ''
                }
            }
            operators.append(current)
        else:
            # Try to extract weapon lines
            if current:
                # Heuristic: if line contains ':' it's a weapon definition
                if ':' in lines[0]:
                    weapon, att = lines[0].split(':',1)
                    weapon = weapon.strip()
                    atts = clean_attachments(att)
                    # Determine which slot based on context - simplified
                    if not current['bestLoadout']['primary']:
                        current['bestLoadout']['primary'] = weapon
                        current['bestLoadout']['primaryAttachments'] = atts
                    elif not current['bestLoadout']['secondary']:
                        current['bestLoadout']['secondary'] = weapon
                        current['bestLoadout']['secondaryAttachments'] = atts
    return operators

def main():
    with open(RAW_PATH, 'r', encoding='utf-8') as f:
        text = f.read()
    ops = parse_raw(text)
    # Write TS file
    ts = "export const OPERATORS = [\n"
    for op in ops[:30]:  # limit for demo
        ts += f"  {{\n"
        ts += f"    id: '{op['id']}',\n"
        ts += f"    name: '{op['name']}',\n"
        ts += f"    role: '{op['role']}',\n"
        ts += f"    category: '',\n"
        ts += f"    bestLoadout: {{\n"
        ts += f"      primary: '{op['bestLoadout']['primary']}',\n"
        ts += f"      primaryAttachments: {op['bestLoadout']['primaryAttachments']},\n"
        ts += f"      secondary: '{op['bestLoadout']['secondary']}',\n"
        ts += f"      secondaryAttachments: {op['bestLoadout']['secondaryAttachments']},\n"
        ts += f"      gadgets: [],\n"
        ts += f"      notes: ''\n"
        ts += f"    }}\n"
        ts += f"  }},\n"
    ts += "];\n"
    with open(OUT_PATH, 'w', encoding='utf-8') as f:
        f.write(ts)
    print(f"Wrote {OUT_PATH} with {len(ops)} operators parsed")

if __name__ == '__main__':
    main()
