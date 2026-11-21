"""Build the Sky Guide site from src/ and data/ into out/site/.

  src/head.html, src/body.html     page markup
  src/css/*.css                    styling, joined in name order
  src/js/*.js                      code, joined in name order (one script, so the order matters)
  data/*.json                      stories, star positions, calendar places and patterns
  pwa/ (or the site folder above)  manifests, icons, fonts (copied as they are)

Output (out/site/): index.html, assets/site.<hash>.css, assets/app.<hash>.js,
assets/stories.<hash>.js, assets/sky.<hash>.js, and sw.js with the list of files the
installed app saves for offline use. Run: python3 build.py
"""
import glob, hashlib, json, os, shutil, subprocess

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, 'out', 'site')
ESBUILD = '/opt/npm-tools/node_modules/esbuild/bin/esbuild'


def read(p):
    with open(os.path.join(ROOT, p), encoding='utf-8') as f:
        return f.read()


def minify(code, loader):
    if os.environ.get('SKY_DEBUG'):   # readable output, for finding problems
        return code
    r = subprocess.run([ESBUILD, f'--loader={loader}', '--minify', '--charset=utf8', '--log-level=error'],
                       input=code.encode('utf-8'), capture_output=True)
    if r.returncode:
        raise SystemExit(r.stderr.decode())
    return r.stdout.decode('utf-8')


def compact(p):
    return json.dumps(json.loads(read(p)), ensure_ascii=False, separators=(',', ':'))


def emit(name, ext, text):
    h = hashlib.sha1(text.encode('utf-8')).hexdigest()[:8]
    fn = f'assets/{name}.{h}.{ext}'
    with open(os.path.join(OUT, fn), 'w', encoding='utf-8') as f:
        f.write(text)
    return fn


def main():
    # backgrounds are generated (star fields, dunes, patterns)
    css_bg = subprocess.run(['node', os.path.join(ROOT, 'tools', 'mkbg.js')], capture_output=True, check=True).stdout.decode('utf-8')
    with open(os.path.join(ROOT, 'src', 'css', '03-backgrounds.css'), 'w', encoding='utf-8') as f:
        f.write(css_bg)

    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(os.path.join(OUT, 'assets'))
    # icons, fonts and app manifests: from pwa/ here, or (in the GitHub repo) from the site folder above
    pwa = os.path.join(ROOT, 'pwa') if os.path.isdir(os.path.join(ROOT, 'pwa')) else os.path.dirname(ROOT)
    for item in ['fonts', 'icons'] + sorted(f for f in os.listdir(pwa) if f.endswith('.webmanifest')):
        s, d = os.path.join(pwa, item), os.path.join(OUT, item)
        (shutil.copytree if os.path.isdir(s) else shutil.copy)(s, d)

    css = ''.join(read(os.path.relpath(p, ROOT)) for p in sorted(glob.glob(os.path.join(ROOT, 'src', 'css', '*.css'))))
    css = css.replace('url(fonts/', 'url(../fonts/')
    js = ''.join(read(os.path.relpath(p, ROOT)) for p in sorted(glob.glob(os.path.join(ROOT, 'src', 'js', '*.js'))))
    stories = f'const DATA = {compact("data/lore.json")};\n'
    sky = f'const POS = {compact("data/positions.json")};\nconst CALD = {compact("data/cal.json")};\nconst CALP = {compact("data/patterns.json")};\n'

    f_css = emit('site', 'css', minify(css, 'css'))
    f_stories = emit('stories', 'js', stories)
    f_sky = emit('sky', 'js', sky)
    f_app = emit('app', 'js', minify(js, 'js'))

    html = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
            + read('src/head.html') + f'<link rel="stylesheet" href="{f_css}">\n' + read('src/font-fallback.html')
            + '</head>\n<body>\n' + read('src/body.html')
            + '<script>\n' + read('src/error-handler.js') + '</script>\n'
            + ''.join(f'<script src="{f}" defer></script>\n' for f in (f_stories, f_sky, f_app))
            + '</body>\n</html>\n')
    with open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(html)

    # offline helper: everything the app needs, saved when it is installed
    keep = ['./', f_css, f_stories, f_sky, f_app]
    keep += sorted(os.path.relpath(p, OUT) for p in glob.glob(os.path.join(OUT, '*.webmanifest')))
    keep += sorted(os.path.relpath(p, OUT) for p in glob.glob(os.path.join(OUT, 'icons', '*.png')))
    keep += sorted(os.path.relpath(p, OUT) for p in glob.glob(os.path.join(OUT, 'fonts', '*.woff')))
    version = hashlib.sha1(''.join(keep).encode()).hexdigest()[:8]
    sw = read('src/sw.js').replace('__VERSION__', version).replace('__FILES__', json.dumps(keep, indent=1))
    with open(os.path.join(OUT, 'sw.js'), 'w', encoding='utf-8') as f:
        f.write(sw)

    total = sum(os.path.getsize(os.path.join(OUT, p)) for p in ['index.html', f_css, f_stories, f_sky, f_app])
    print(f'built out/site: {total:,} bytes (index {os.path.getsize(os.path.join(OUT, "index.html")):,}, '
          f'css {os.path.getsize(os.path.join(OUT, f_css)):,}, app {os.path.getsize(os.path.join(OUT, f_app)):,}, '
          f'stories {os.path.getsize(os.path.join(OUT, f_stories)):,}, sky {os.path.getsize(os.path.join(OUT, f_sky)):,}), offline files: {len(keep)}')


if __name__ == '__main__':
    main()
