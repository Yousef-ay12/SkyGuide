# Sky Guide: source

The site at https://yousef-ay12.github.io/SkyGuide/ is built from these files.

- `src/head.html`, `src/body.html`: the page itself
- `src/css/`: styling, joined in name order (`03-backgrounds.css` is made by `tools/mkbg.js`)
- `src/js/`: the code, one file per part of the site, joined in name order:
  core, tour, quiz, install, nav, sky engine, visibility, calendar, science, deep-sky,
  Stellarium links, Plan a night, saved lists, feedback, For guides, render and start-up
- `src/sw.js`: the offline helper (the build fills in the file list)
- `data/`: stories and charts (`lore.json`), star positions, calendar places, constellation patterns
- icons, fonts and app manifests are the ones in the site folder above (`../icons`, `../fonts`, `../*.webmanifest`)

Build: `python3 build.py` makes `out/site/`: `index.html`, fingerprinted files in `assets/`,
and `sw.js`, which saves every file when the app is installed, so all tabs work offline.
