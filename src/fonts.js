// Fonts. Each mushaf page has its own QCF2 page font (KFGQPC, QUL font 249), loaded on demand.
// The surah banner font and the Bismillah font are declared in styles.css.
// Paths are relative, because GitHub Pages serves the site under /quran-verse-openings/.

const pageFonts = new Map();

export function pageFontFamily(page) {
  return `qcf2-p${page}`;
}

export function loadPageFont(page) {
  if (!pageFonts.has(page)) {
    const face = new FontFace(pageFontFamily(page), `url(assets/fonts/qcf2/p${page}.woff2)`, {
      display: 'block',
    });
    pageFonts.set(
      page,
      face.load().then((loaded) => {
        document.fonts.add(loaded);
        return loaded;
      }),
    );
  }
  return pageFonts.get(page);
}

// The banner and Bismillah fonts are only fetched when first used, so wait for them explicitly.
export function loadFrameFonts(bannerSample, bismillahGlyph) {
  return Promise.all([
    document.fonts.load(`60px surah-header`, bannerSample),
    document.fonts.load(`60px bismillah`, bismillahGlyph),
  ]);
}
