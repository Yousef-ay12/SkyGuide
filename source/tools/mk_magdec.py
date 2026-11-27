"""Adds 'md', the magnetic declination in degrees (east +), to each place in data/cal.json.
A phone compass points to magnetic north; the sky view adds this to get true north.
Model: World Magnetic Model 2025 (NOAA / BGS, public domain), computed with pygeomag (MIT,
https://github.com/boxpet/pygeomag). Run: python3 tools/mk_magdec.py /path/to/pygeomag
Declination drifts by about 0.1 degree a year, so a re-run every few years is plenty."""
import json, sys
sys.path.insert(0, sys.argv[1] if len(sys.argv) > 1 else 'pygeomag')
from pygeomag import GeoMag
EPOCH = 2027.0
g = GeoMag(coefficients_file='wmm/WMM_2025.COF')
p = 'data/cal.json'; d = json.load(open(p, encoding='utf-8'))
for pl in d['places']:
    pl['md'] = round(g.calculate(glat=pl['lat'], glon=pl['lon'], alt=0, time=EPOCH).d, 1)
json.dump(d, open(p, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(len(d['places']), 'places;', 'Johannesburg', next(x['md'] for x in d['places'] if x['en'] == 'Johannesburg'))
