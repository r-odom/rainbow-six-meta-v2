#!/usr/bin/env python3
"""
Generate worker/seed.ts from operators_clean.json
"""
import json, re, argparse
from pathlib import Path

def attachments_list(attach_str):
    if not attach_str:
        return []
    parts = [p.strip() for p in re.split(r'[;,]', attach_str) if p.strip()]
    return parts

def load_operators(path):
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data.get('attackers', []), data.get('defenders', [])

def operator_to_ts(op, role):
    prim = op.get('primary') or {}
    sec = op.get('secondary') or {}
    id_ = op.get('id')
    name = op.get('name')
    ts = []
    ts.append('  {')
    ts.append(f"    id: '{id_}',")
    ts.append(f"    name: '{name}',")
    ts.append(f"    role: '{role}',")
    ts.append(f"    category: 'General',")
    ts.append('    bestLoadout: {')
    ts.append(f"      primary: '{prim.get('weapon','')}',")
    ts.append(f"      primaryAttachments: {json.dumps(attachments_list(prim.get('attachments','')))},")
    ts.append(f"      secondary: '{sec.get('weapon','')}',")
    ts.append(f"      secondaryAttachments: {json.dumps(attachments_list(sec.get('attachments','')))},")
    ts.append(f"      gadgets: {json.dumps(op.get('gadgets',[]))},")
    ts.append(f"      notes: ''")
    ts.append('    }')
    ts.append('  },')
    return '\n'.join(ts)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--in', dest='inp', default='operators_clean.json')
    parser.add_argument('--out', dest='out', default='worker/seed.ts')
    args = parser.parse_args()

    attackers, defenders = load_operators(args.inp)
    lines = []
    lines.append('export const OPERATORS = [')
    for op in attackers:
        lines.append(operator_to_ts(op, 'Attacker'))
    for op in defenders:
        lines.append(operator_to_ts(op, 'Defender'))
    lines.append('];')
    lines.append('')
    lines.append("export const MAPS = ['Bank','Border','Clubhouse','Coastline','Consulate','Kafe Dostoyevsky','Oregon','Skyscraper','Theme Park'];")
    lines.append('')
    lines.append('export const SITES = {')
    lines.append("  Bank: ['Kilo','Mira','Vault','Lobby'],")
    lines.append("  Border: ['White','Blue','Vault','Kitchen'],")
    lines.append("  Clubhouse: ['A','B','C'],")
    lines.append('};')

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text('\n'.join(lines), encoding='utf-8')
    print(f'Wrote {len(attackers)+len(defenders)} operators to {args.out}')

if __name__ == '__main__':
    main()
