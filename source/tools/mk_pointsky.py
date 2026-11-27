#!/usr/bin/env python3
"""Make the data for "Point at the sky" (data/pointsky.json) and copy the constellation art (art/).

Sources, downloaded into ../work (not part of the site):
  - stars: d3-celestial by Olaf Frohn (BSD 3-clause), data/stars.6.json and stars.8.json (Hipparcos), starnames.json
  - lines and art: Stellarium sky cultures (github.com/Stellarium/stellarium-skycultures)
      western: lines CC BY-SA, illustrations by Johan Meuris, Free Art License
      arabic_al-sufi: lines and anchors CC BY-ND 4.0 (Khalid al-Ajaji), illustrations public domain; used unchanged
Usage: python3 tools/mk_pointsky.py <d3-celestial data dir> <stellarium-skycultures dir>
"""
import json, os, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D3, SC = sys.argv[1], sys.argv[2]
MAG = 6.0          # naked-eye limit

feat = lambda f: json.load(open(os.path.join(D3, f)))['features']
s6 = {f['id']: f for f in feat('stars.6.json')}
s8 = {f['id']: f for f in feat('stars.8.json')}
names = json.load(open(os.path.join(D3, 'starnames.json')))

cultures = {}
need = set()
for cid, folder in (('w', 'western'), ('s', 'arabic_al-sufi')):
    idx = json.load(open(os.path.join(SC, folder, 'index.json')))
    cons = {}
    for c in idx['constellations']:
        key = c.get('iau') or c['id'].split()[-1]
        lines = [[h for h in l if isinstance(h, int)] for l in c.get('lines', [])]
        for l in lines: need.update(l)
        o = {'l': [l for l in lines if len(l) > 1]}
        im = c.get('image')
        if im:
            fn = os.path.basename(im['file'])
            o['a'] = {'f': f'{cid}/{fn}', 'sz': im['size'], 'p': [[a['pos'][0], a['pos'][1], a['hip']] for a in im['anchors']]}
            need.update(a['hip'] for a in im['anchors'])
            dst = os.path.join(ROOT, 'art', cid)
            os.makedirs(dst, exist_ok=True)
            shutil.copy(os.path.join(SC, folder, im['file']), os.path.join(dst, fn))
        cons[key] = o
    cultures[cid] = cons

# stars: every naked-eye star, plus any fainter one a line or a drawing needs
ids = sorted({i for i, f in s6.items() if f['properties']['mag'] <= MAG} | {h for h in need if h in s8})
stars = []
for i in ids:
    f = s6.get(i) or s8[i]
    ra, dec = f['geometry']['coordinates']
    bv = f['properties'].get('bv')
    try: bv = round(float(bv), 1)
    except (TypeError, ValueError): bv = 0.6
    stars.append([i, round(ra % 360, 3), round(dec, 3), round(f['properties']['mag'], 2), bv])
missing = need - set(ids)

# names for the brighter named stars, in English and Arabic
nm = {}
for i in ids:
    n = names.get(str(i))
    if not n or not n.get('name'): continue
    mag = (s6.get(i) or s8[i])['properties']['mag']
    if mag > 3.2: continue
    ar = (n.get('ar') or '').replace('‎', '').replace('‏', '').strip()
    nm[i] = [n['name'], ar] if ar else [n['name']]

out = {'stars': stars, 'names': nm, 'cul': cultures}
with open(os.path.join(ROOT, 'data', 'pointsky.json'), 'w') as f:
    json.dump(out, f, ensure_ascii=False, separators=(',', ':'))
print(len(stars), 'stars,', len(nm), 'names,', {k: len(v) for k, v in cultures.items()}, 'constellations; missing', missing or 'none')
