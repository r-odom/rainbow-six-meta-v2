#!/usr/bin/env python3
"""
Convert loadouts_raw.txt to operators_clean.json
Format expected in loadouts_raw.txt:
attackers:
Operator
Primary
Alternative
Secondary
Gadget
OperatorName
Weapon: attachments
Weapon: attachments
Weapon: attachments
Gadget line
...
defenders:
...
"""
import re, json, sys

def clean_atts(s):
    if not s:
        return ''
    s = re.sub(r'(?i)\blaser\b', '', s)
    s = re.sub(r'\s*;\s*', '; ', s)
    s = re.sub(r'\s+', ' ', s).strip(' ;')
    return s

def parse_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        lines = [l.rstrip() for l in f.readlines()]
    
    operators = {'attackers': [], 'defenders': []}
    role = None
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        low = line.lower()
        if low.startswith('attackers:'):
            role = 'attackers'
            i += 1
            continue
        if low.startswith('defenders:'):
            role = 'defenders'
            i += 1
            continue
        if not line or low in ['operator','primary','alternative','secondary','gadget']:
            i += 1
            continue
        # operator name: line without ':' and next line contains ':'
        if ':' not in line and i+1 < len(lines) and ':' in lines[i+1]:
            name = line
            # skip to next 4 lines
            primary = None
            alternative = None
            secondary = None
            gadget = None
            j = i+1
            # read up to 4 blocks
            count = 0
            while j < len(lines) and count < 4:
                l = lines[j].strip()
                if not l:
                    j += 1
                    continue
                # weapon line
                if ':' in l:
                    weapon, atts = l.split(':',1)
                    weapon = weapon.strip()
                    atts = clean_atts(atts)
                    if count == 0:
                        primary = {'weapon': weapon, 'attachments': atts}
                    elif count == 1:
                        if l.strip() == '-':
                            alternative = None
                        else:
                            alternative = {'weapon': weapon, 'attachments': atts}
                    elif count == 2:
                        secondary = {'weapon': weapon, 'attachments': atts}
                    count += 1
                    j += 1
                else:
                    # gadget line
                    gadget = l
                    j += 1
                    break
            # consume remaining
            i = j
            op = {
                'id': re.sub(r'[^a-z0-9]+','', name.lower()),
                'name': name,
                'primary': primary,
                'alternative': alternative,
                'secondary': secondary,
                'gadgets': [g.strip() for g in re.split(r'[+,]', gadget or '') if g.strip()] if gadget else []
            }
            operators[role].append(op)
            continue
        i += 1
    return operators

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--in', dest='inp', default='loadouts_raw.txt')
    p.add_argument('--out', dest='out', default='operators_clean.json')
    args = p.parse_args()
    data = parse_file(args.inp)
    with open(args.out, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    print(f'Wrote {len(data["attackers"])} attackers and {len(data["defenders"])} defenders to {args.out}')
