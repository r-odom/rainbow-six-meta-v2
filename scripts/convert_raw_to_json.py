#!/usr/bin/env python3
"""
Convert loadouts_raw.txt to operators_clean.json
Removes 'laser' from all weapon attachments and parses attackers/defenders correctly.
"""
import re, json, argparse

def clean_attachments(attach):
    if not attach:
        return ''
    # split on ; and ,
    parts = re.split(r'[;,]', attach)
    cleaned = []
    for p in parts:
        p = p.strip()
        if not p:
            continue
        # remove laser word
        if re.search(r'laser', p, re.I):
            p2 = re.sub(r'\blaser\b', '', p, flags=re.I)
            p2 = re.sub(r'\s+', ' ', p2).strip(' ,;')
            if p2.lower() in ['no', 'no ']:
                continue
            if p2:
                cleaned.append(p2)
            continue
        cleaned.append(p)
    return '; '.join(cleaned)

def parse_weapon(raw):
    if not raw or raw.strip() == '-':
        return None
    if ':' in raw:
        w, a = raw.split(':', 1)
        return {'weapon': w.strip(), 'attachments': clean_attachments(a.strip())}
    # no colon, return as weapon name only
    return {'weapon': raw.strip(), 'attachments': ''}

def parse_section(lines, start_idx, end_idx):
    ops = []
    i = start_idx
    # skip section header lines
    while i < end_idx:
        name = lines[i]
        if name.lower() in ['operator','primary','alternative','secondary','gadget']:
            i += 1
            continue
        if name.lower().endswith(':'):
            i += 1
            continue
        # assume operator name
        # collect next 4 entries
        entries = []
        j = i + 1
        count = 0
        while j < end_idx and count < 4:
            cand = lines[j]
            # stop if we hit a header
            if cand.lower() in ['operator','primary','alternative','secondary','gadget'] or cand.lower().endswith(':'):
                break
            entries.append(cand)
            j += 1
            count += 1
        if len(entries) < 4:
            i += 1
            continue
        op = {
            'id': re.sub(r'[^a-z0-9]+', '', name.lower()),
            'name': name,
            'primary': parse_weapon(entries[0]),
            'alternative': parse_weapon(entries[1]),
            'secondary': parse_weapon(entries[2]),
            'gadgets': [g.strip() for g in re.split(r'[+,]', entries[3]) if g.strip()]
        }
        ops.append(op)
        i = j
    return ops

def parse_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        raw = f.read()
    filtered = [l.strip() for l in raw.splitlines() if l.strip()!='']
    # find sections
    try:
        attackers_start = filtered.index('attackers:')
        defenders_start = filtered.index('defenders:')
    except ValueError:
        attackers_start = 0
        defenders_start = len(filtered)
    attackers = parse_section(filtered, attackers_start, defenders_start)
    defenders = parse_section(filtered, defenders_start, len(filtered))
    return {'attackers': attackers, 'defenders': defenders}

if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--in', dest='inp', default='loadouts_raw.txt')
    p.add_argument('--out', dest='out', default='operators_clean.json')
    args = p.parse_args()
    data = parse_file(args.inp)
    with open(args.out, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    print(f'Wrote {len(data["attackers"])} attackers and {len(data["defenders"])} defenders to {args.out}')
