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
        cn = c.get('common_name') or {}
        o = {'l': [l for l in lines if len(l) > 1], 'n': [cn.get('english') or key, cn.get('native') or '']}
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

# the site's own stars and deep-sky objects, so the view can point to the one a card is about
import re
GREEK = {'alpha': 'α', 'beta': 'β', 'gamma': 'γ', 'delta': 'δ', 'epsilon': 'ε', 'zeta': 'ζ', 'eta': 'η', 'theta': 'θ', 'iota': 'ι', 'kappa': 'κ', 'lambda': 'λ', 'mu': 'μ',
         'nu': 'ν', 'xi': 'ξ', 'omicron': 'ο', 'pi': 'π', 'rho': 'ρ', 'sigma': 'σ', 'tau': 'τ', 'upsilon': 'υ', 'phi': 'φ', 'chi': 'χ', 'psi': 'ψ', 'omega': 'ω'}
lore = json.load(open(os.path.join(ROOT, 'data', 'lore.json')))
byname, bybayer, byflam, byhd = {}, {}, {}, {}
for h, n in names.items():
    h = int(h)
    if n.get('name'): byname.setdefault(n['name'].lower(), h)
    if n.get('bayer') and n.get('c'): bybayer.setdefault((n['bayer'], n['c']), h)
    if n.get('flam') and n.get('c'): byflam.setdefault((n['flam'], n['c']), h)
    if n.get('hd'): byhd.setdefault(n['hd'].replace(' ', '').upper(), h)
sn, miss_s = {}, []
dso_ids = {}
for key, sc in lore['sci'].items():
    for part in sc.get('parts') or []:
        ab = part.get('abbr')
        for st in part.get('stars') or []:
            h = byname.get(st['name'].lower())
            m = re.match(r'^HIP\s*(\d+)$', st['name'])
            if not h and m: h = int(m.group(1))
            if not h and st['name'].upper().startswith('HD'): h = byhd.get(st['name'].replace(' ', '').upper())
            for label in (st.get('bayer') or '', st['name']):
                if h: break
                m = re.match(r'^([A-Za-z]+)([¹²³\d]?)\s', label)
                if m and m.group(1).lower() in GREEK:
                    sup = {'¹': '1', '²': '2', '³': '3'}.get(m.group(2), m.group(2))
                    h = bybayer.get((GREEK[m.group(1).lower()] + sup, ab)) or bybayer.get((GREEK[m.group(1).lower()], ab))
                m = re.match(r'^(\d+)\s', label)
                if not h and m: h = byflam.get((m.group(1), ab))
            if h and h in s8: sn[st['name']] = h
            else: miss_s.append(st['name'])
        for d in part.get('dsos') or []: dso_ids[d['id']] = d
core = open(os.path.join(ROOT, 'src', 'js', '00-core.js')).read()
for d in json.loads(re.search(r'const DSO_EXTRA = (\[.*?\]);', core).group(1)): dso_ids[d['id']] = d
# deep-sky positions: d3-celestial's lists, matched by catalogue number
pos = {}
for fn in ('dsos.14.json', 'dsos.6.json', 'dsos.bright.json', 'messier.json'):
    for f in feat(fn):
        pr = f['properties']; ra, dec = f['geometry']['coordinates']
        for lab in (f.get('id'), pr.get('desig'), pr.get('name')):
            if lab: pos[re.sub(r'\s+', '', str(lab)).upper()] = [round(ra % 360, 3), round(dec, 3)]
# objects these lists name differently: positions (J2000, degrees) from SIMBAD / the NGC catalogue
pos.update({'C014': [35.0, 57.13], 'C041': [66.75, 15.87], 'B033': [85.25, -2.46], 'C099': [192.5, -62.5], 'ESO056-115': [80.89, -69.76],
            'ESO356-004': [40.0, -34.45], 'NGC2074': [84.76, -69.5], 'NGC2237': [98.44, 4.98], 'NGC2239': [98.0, 5.0], 'CL399': [291.35, 20.18],
            'NGC7234': [333.1, 57.27]})
dso, miss_d = {}, []
for i, d in dso_ids.items():
    p = None
    for lab in (i, d.get('cat')):
        if lab and not p: p = pos.get(re.sub(r'\s+', '', str(lab)).upper())
    if p: dso[i] = p + [d.get('cat') or i]
    else: miss_d.append(i)
print('site stars matched', len(sn), 'missing', miss_s[:12], '| deep-sky matched', len(dso), 'missing', miss_d)
out = {'stars': stars, 'names': nm, 'cul': cultures, 'sn': sn, 'dso': dso}
with open(os.path.join(ROOT, 'data', 'pointsky.json'), 'w') as f:
    json.dump(out, f, ensure_ascii=False, separators=(',', ':'))
print(len(stars), 'stars,', len(nm), 'names,', {k: len(v) for k, v in cultures.items()}, 'constellations; missing', missing or 'none')
