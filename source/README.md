# Sky Guide: source

The site at https://yousef-ay12.github.io/SkyGuide/ is built from these files.

- `src/head.html`, `src/body.html`: the page itself
- `src/css/`: styling, joined in name order: fonts, site, guides, backgrounds (`03-backgrounds.css` is made by `tools/mkbg.js`),
  weather, the frame (top bar, sections, bottom bar on phones), overview pages, and Science extras (moons, Cosmology)
- `src/js/`: the code, one file per part of the site, joined in name order:
  core, tour, quiz, install, navigation (three sections and their pages), welcome doors, sky engine, visibility,
  weather, calendar, science, deep-sky, moons, Cosmology (three text files, the page with its drawings, the Science
  overview, the pictures), Stellarium links, connected stories, Plan a night, My night (saved lists), the Culture and
  AstroGuide overviews, feedback, For guides, render and start-up
- `src/sw.js`: the offline helper (the build fills in the file list)
- `data/`: stories and charts (`lore.json`), star positions, calendar places, constellation patterns
- icons, fonts and app manifests are the ones in the site folder above (`../icons`, `../fonts`, `../*.webmanifest`)

Build: `python3 build.py` makes `out/site/`: `index.html`, fingerprinted files in `assets/`,
and `sw.js`, which saves every file when the app is installed, so all tabs work offline.
