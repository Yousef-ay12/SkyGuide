# Sky Guide: source

The site at https://yousef-ay12.github.io/SkyGuide/ is built from these files.

- `src/head.html`, `src/body.html`: the page itself
- `src/css/`: styling, joined in name order: fonts, site, guides, backgrounds (`03-backgrounds.css` is made by `tools/mkbg.js`),
  weather, the frame (top bar, sections, bottom bar on phones), overview pages, and Science extras (moons, Cosmology)
- `src/js/`: the code, one file per part of the site, joined in name order:
  core, tour, quiz, install, navigation (three sections and their pages), welcome doors, search, poem meanings, Poems and the star calendar (Arab sources), sky engine, visibility,
  weather, calendar, science, deep-sky, moons, Cosmology (three text files, the page with its drawings, the Science
  overview, the pictures, extra quiz questions, the glossary, the kids versions), Stellarium links, Point at the sky, connected stories, Plan a night,
  My night (saved lists), the Culture and AstroGuide overviews, Save pictures for offline, sharing, feedback,
  For guides, render and start-up
- `src/sw.js`: the offline helper (the build fills in the file list); it also serves the pictures saved with
  Save pictures for offline (Settings)
- `data/`: stories and charts (`lore.json`), star positions, calendar places, constellation patterns, and the
  Point at the sky stars, lines and art positions (`pointsky.json`)
- `art/`: constellation drawings for Point at the sky: `w/` by Johan Meuris for Stellarium (Free Art License),
  `s/` al-Sufi's figures (public domain). `tools/mk_pointsky.py` makes `data/pointsky.json` and `art/` from d3-celestial's
  Hipparcos stars (BSD) and the Stellarium sky cultures (western lines CC BY-SA; al-Sufi data CC BY-ND 4.0, used unchanged)
- icons, fonts and app manifests are the ones in the site folder above (`../icons`, `../fonts`, `../*.webmanifest`)

Build: `python3 build.py` makes `out/site/`: `index.html`, fingerprinted files in `assets/`,
and `sw.js`, which saves every file when the app is installed, so all tabs work offline.
