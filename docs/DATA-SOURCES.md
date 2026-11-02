# Data sources

The exact source, version or download date, license and checksum of every source file.

## Status

**Phase 1 (done):** BUILDER downloaded trial copies, used only to check the PDF edition and line layout. They are in `tmp/downloads/` (ignored by git) and are not part of the site.

**Phase 2 (in progress):** Hassan made the official QUL downloads on 2026-10-31 into `tmp/downloads/qul/`, with a free QUL account and BUILDER's instructions (D25). These are the files the site is built from. See "Official QUL downloads (phase 2)" below.

Checksums are SHA-256. The full checksum lists are kept in `docs/checksums/` (copied from BUILDER's lists in `tmp/`, which git ignores). Run `sha256sum -c docs/checksums/<file>` from the project root to check the files. DOCU re-ran all three lists on 2026-10-31 and all 1,263 entries matched.

| List                                  | Covers                                                      | Entries |
| ------------------------------------- | ----------------------------------------------------------- | ------- |
| `docs/checksums/qul-downloads.sha256` | The 5 official QUL archives and the 3 databases inside them | 8       |
| `docs/checksums/qul-fonts-v2.sha256`  | The 604 QPC V2 page fonts, as `.woff2` and as `.ttf`        | 1,208   |
| `docs/checksums/phase1-trial.sha256`  | The PDF and the phase 1 trial downloads                     | 47      |

## Reference PDF (not a text source)

| Field   | Value                                                                                                                                                                                                                                                                   |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File    | `standard1-quran.pdf` (project root)                                                                                                                                                                                                                                    |
| Size    | 165,957,337 bytes, 625 pages                                                                                                                                                                                                                                            |
| SHA-256 | `be0091b2fac87706c240f27398e00e7848daebbd69f7ec437859f66fca15d562`                                                                                                                                                                                                      |
| Added   | 2026-10-31, by Hassan                                                                                                                                                                                                                                                   |
| Format  | Every page is one scanned JPEG image (750 px wide), no text layer. Made with Nitro PDF Professional 6, modified 2011-06-21.                                                                                                                                             |
| Edition | **Confirmed by BUILDER:** King Fahd Glorious Quran Printing Complex (KFGQPC) Madinah mushaf, Hafs from Asim, script by Uthman Taha. The "1421H print": approved by the Complex's board on 26/1/1420 AH, decision 5/1420 (PDF page 620). Printed 1429 AH (PDF page 624). |
| Pages   | Mushaf pages 1 to 604 are PDF pages 4 to 607 (**mushaf page = PDF page minus 3**). PDF pages 1 to 3 and 608 to 625 are front and back matter. All 112 PDF bookmarks agree.                                                                                              |
| Lines   | 15 per page. Pages 1 and 2 have 8 lines inside a round frame.                                                                                                                                                                                                           |
| Use     | Only to confirm the edition and page layout. Never used as a source for the Arabic text.                                                                                                                                                                                |
| In repo | No. Ignored by git.                                                                                                                                                                                                                                                     |

## Sources picked by BUILDER (phase 1)

All of these come from QUL, the Quranic Universal Library (qul.tarteel.ai), except Tanzil.

| Piece            | What it is                                                                          | QUL resource     | Status                                            |
| ---------------- | ----------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------- |
| Layout           | KFGQPC V2 layout (1421H print), 604 pages, 15 lines                                 | mushaf-layout 10 | Picked. Downloaded (phase 2).                     |
| Words to draw    | QPC V2 Glyph script, word by word                                                   | quran-script 61  | Picked. Downloaded (phase 2).                     |
| Font             | QPC V2 page fonts (KFGQPC "QCF2"), one font per page, QCF2001 to QCF2604            | font 249         | **Picked by Hassan** (D23). Downloaded (phase 2). |
| Unicode text     | KFGQPC Hafs script, word by word. The source of truth for opening words and checks. | quran-script 312 | Picked. Downloaded (phase 2).                     |
| Cross-check text | Tanzil Uthmani 1.1                                                                  | (tanzil.net)     | Downloaded.                                       |

## Official QUL downloads (phase 2)

Downloaded by Hassan on 2026-10-31 (17:51 to 17:52) from qul.tarteel.ai into `tmp/downloads/qul/`, with a free QUL account. QUL shows no version numbers, so "Version" is the export date stored inside each archive (as reported by BUILDER). BUILDER unpacked the archives into `tmp/downloads/qul/x/`.

| File                           | QUL resource                                          | Version    | Contents                                                                                                           | SHA-256                                                            |
| ------------------------------ | ----------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `qpc-v2-15-lines.db.zip`       | mushaf-layout 10, "KFGQPC V2 layout (1421H print)"    | 2025-11-18 | `qpc-v2-15-lines.db`: table `pages` (9,046 lines) and table `info` ("QCF V2 ( 1421H print )", 604 pages, 15 lines) | `697cbc7f16db1f56b6d95c4d11a9eea074ad4759babd2d75abcad5738e2fdf96` |
| `qpc-v2.db.zip`                | quran-script 61, "QPC V2 Glyph - Word by Word"        | 2025-05-28 | `qpc-v2.db`: table `words`, 83,668 rows (glyph codes)                                                              | `a766a033cad47b36f00f493f5f0541d5f07e1336857eaa6feba92465af3f68bb` |
| `qpc-hafs-word-by-word.db.zip` | quran-script 312, "KFGQPC Hafs script - Word by word" | 2025-05-28 | `qpc-hafs-word-by-word.db`: table `words`, 83,668 rows (Unicode text)                                              | `64b59c7ae3dae32f3650c534cb5a40c91089e0a6319372ded9500181a3cc6a47` |
| `QPC V2 Font.ttf.bz2`          | font 249, "QPC V2 Font", TTF                          | 2024-10-15 | 604 fonts, `p1.ttf` to `p604.ttf`                                                                                  | `9ead3836904f22324b5805c079c2911e13f384f2ca820254a36b8a22c28de555` |
| `QPC V2 Font.woff2.bz2`        | font 249, "QPC V2 Font", WOFF2                        | 2024-10-15 | 604 fonts, `p1.woff2` to `p604.woff2`                                                                              | `e535df82da643151e9d566691250a4a7d9ce9f8e887af89e90ec9417e070587a` |

The unpacked databases:

| File                                             | SHA-256                                                            |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| `x/layout-v2/qpc-v2-15-lines.db`                 | `e4df98f35dd3b8927ff096337c8739e0f0b12c8ba622834c345eaa4c3e28dd8c` |
| `x/script-v2-glyph/qpc-v2.db`                    | `4bf9549dfcfd367d4d4b151bd58b51af63b677d1c980cf5e52541c2f981d7e6d` |
| `x/script-hafs-unicode/qpc-hafs-word-by-word.db` | `e1cf266ed47a56e58100c08f69499f635f84c97233318cc53daf17200fb9048e` |

Notes:

- The two `.bz2` font files are really ZIP archives. That is QUL's naming.
- The `.woff2` fonts are QUL's own subsets of the `.ttf` fonts: each one has only the glyphs its page uses. BUILDER checked that every glyph the text uses is present and looks the same.
- The checksums of all 1,208 unpacked font files are in `docs/checksums/qul-fonts-v2.sha256`.
- License: QUL lists none for these resources. The QCF2 fonts have no published license, and Hassan accepted using them with credit to KFGQPC and QUL (D24).
- Not downloaded yet: the surah banner font (QUL font 458). It is needed in phase 3.
- Not in git (Hassan, D29): the QUL databases are never committed. Tanzil's two files are committed in `data/sources/` byte for byte, with `data/sources/SHA256SUMS` for 8 source files (2 Tanzil files, 3 QUL databases, and since phase 3 the surah banner font, its `ligatures.json` and the Bismillah font). Its hashes are the same as those above and in `docs/checksums/`. QUL is credited in `README.md`.

## Fonts in the repo (phase 3)

The site self-hosts these fonts from `assets/fonts/`. They are committed to git.

### QPC V2 page fonts: `assets/fonts/qcf2/`

`p1.woff2` to `p604.woff2`, one per page, copied by ORG from the official QUL download (QUL font 249, export 2024-10-15, see above). DOCU checked all 604 files against `docs/checksums/qul-fonts-v2.sha256` on 2026-10-31: all match. License: none published. Hassan accepted using them with credit to KFGQPC and QUL (D24).

### Surah banner font: `assets/fonts/surah-header/`

| Field      | Value                                                                                                                                                                                                                                                                               |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File       | `QCF_SurahHeader_COLOR-Regular.woff2` (118,424 bytes)                                                                                                                                                                                                                               |
| Source     | QUL font 458, "Surah header font", from qul.tarteel.ai                                                                                                                                                                                                                              |
| Downloaded | 2026-10-31, by Hassan, as `tmp/downloads/qul/QCF_SurahHeader_COLOR-Regular.woff2.zip`. The archive also has `ligatures.json` (the character that draws each surah banner). It is not committed; `build-data` copies its 114 characters into `data/quran.json` as `surahs[].banner`. |
| Version    | Version 1.000, October 9, 2024 (from the font's name records)                                                                                                                                                                                                                       |
| Made by    | King Fahad Complex (KFGQPC). It is a color font: each surah name is one glyph.                                                                                                                                                                                                      |
| SHA-256    | `46bd0a3672870743bbfef161d352731423e5e53e9b45eee6a4f0fdeba69ff6dd`                                                                                                                                                                                                                  |
| License    | **Approved by Hassan (2026-10-31, relayed by BUILDER): use it, credit KFGQPC and QUL (D33). Kept after comparing other options (D44).** QUL says "We don't have copyright information for this resource". The font itself says "King Fahad Complex, All rights reserved."           |

All checksums for this download are in `docs/checksums/qul-surah-header.sha256`.

### Bismillah font: `assets/fonts/bismillah/`

| Field        | Value                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| File         | `QCF2BSML.ttf` (327,564 bytes), committed as downloaded, not converted                                                                                                                                                                                                                                                                                                                     |
| What it is   | KFGQPC's Bismillah font for the QCF2 (V2) page fonts. The reader draws each Bismillah line with one glyph, U+FC21, a complete Bismillah. BUILDER compared it with the print's Bismillah on page 545.                                                                                                                                                                                       |
| Source       | GitHub mirror `nuqayah/qpc-fonts`, folder `mushaf-v2`, pinned to commit `76caf007eb341c43ceda23ad0ee61efaa6e4f080`: https://raw.githubusercontent.com/nuqayah/qpc-fonts/76caf007eb341c43ceda23ad0ee61efaa6e4f080/mushaf-v2/QCF2BSML.ttf. The last commit touching the file is from 2018-03-29. Not from KFGQPC directly: its own path (qurancomplex.gov.sa/TTF/) returned 404. Not on QUL. |
| Downloaded   | 2026-10-31, by BUILDER, as `tmp/downloads/bismillah/QCF2BSML.ttf`                                                                                                                                                                                                                                                                                                                          |
| Name records | Copyright "King Fahad Complex, All rights reserved."; name "QCF2BSML"; version "version 5.10"; trademark "All rights researved" (their spelling); designer "Harf Information Technology". No license text.                                                                                                                                                                                 |
| SHA-256      | `457cd1bf2174e9c10b31eab25bc5eda20c12abbafe5f47bdea473c64036f411e` (also in `data/sources/SHA256SUMS` and `docs/checksums/bismillah.sha256`)                                                                                                                                                                                                                                               |
| License      | None published. The mirror repo declares none; its README "License" link points to dm.qurancomplex.gov.sa/copyright-2/, which returned 404. Kept by Hassan after comparing other options (D44). Used under Hassan's D34 (option 1: KFGQPC's Bismillah font, from KFGQPC or this mirror).                                                                                                   |

## What each source is used for in `data/quran.json`

| Data                                                       | Source                                                                                                                   |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Pages, lines, line type, centering, surah banners          | QUL layout 10 (V2)                                                                                                       |
| How each word is drawn (glyph codes)                       | QUL quran-script 61 (V2 glyphs)                                                                                          |
| Each word's Unicode text, used for openings and checks     | QUL quran-script 312 (KFGQPC Hafs)                                                                                       |
| Arabic surah names                                         | Tanzil metadata 1.0 (`quran-data.js`)                                                                                    |
| English surah names (`surahs[].transliteration`)           | Typed for this project by BUILDER in the Quran.com spelling, `scripts/lib/surah-names.mjs`. No third-party source (D45). |
| Character that draws each surah banner (`surahs[].banner`) | QUL `ligatures.json` from the surah banner font download (QUL 458)                                                       |
| First verse of each quarter, hizb and juz                  | The print: the hizb signs ۞ in QUL 312 and the V2 glyphs, plus surah starts (D26)                                        |
| Cross-check of juz and quarter starts                      | Tanzil metadata 1.0 (one reviewed difference: 15:49 in the print, 15:50 in Tanzil)                                       |
| Page and line of every surah, juz, hizb and quarter start  | QUL layout 10, never Tanzil (D26)                                                                                        |
| Text cross-check                                           | Tanzil Uthmani 1.1 (`quran-uthmani.txt`)                                                                                 |

## Text cross-check: QUL 312 against Tanzil and the print (phase 2)

`PROJECT.md` Rule 1 asks for every verse to be compared with Tanzil and every difference reported. BUILDER did this on 2026-10-31. The full report is `docs/TEXT-CROSSCHECK.md`; this is a summary. Inputs: QUL quran-script 312 (export 2025-05-28, 83,668 tokens: 77,432 words and 6,236 verse numbers), Tanzil Uthmani 1.1 split with the Rule 1 rules, and the print (the V2 glyph data plus close-ups of the PDF). Full evidence is in `tmp/phase2/`.

How the two QUL scripts line up: QUL 312 (Unicode text) and QUL 61 (V2 glyphs) have the same word ids and verse:word locations for all 83,668 words. Each word takes its text from 312 and its drawing from 61. QUL 312 already attaches pause marks to words, keeps disjointed letters like الٓمٓ as one word, and keeps the Bismillah out of verse 1.

**Word counts.** Same in all 6,236 verses except **37:130**: QUL 312 has إِلۡ يَاسِينَ as one word, Tanzil as two. The layout and glyphs follow QUL (one word).

**Letters.** Identical in every word after three spelling conventions (dotless final yeh, hamza before a long a, yeh with hamza in a few words). Two words differ only in how the hamza is encoded: **2:72:4** (same spelling) and **56:23:2** (the print has the hamza below the waw, as QUL 312 does).

**Marks.** After encoding conventions (sukun, round zero, staggered tanween, iqlab), the remaining differences were checked against the print:

| Word                                             | QUL 312      | Tanzil              | Print follows    |
| ------------------------------------------------ | ------------ | ------------------- | ---------------- |
| Sajda overline (26 words in the 15 sajda verses) | has it       | none                | QUL 312          |
| 12:11:6, ishmam dot                              | filled       | hollow              | QUL 312          |
| 17:7:12                                          | no small waw | small waw and madda | QUL 312          |
| **52:37:7**, small seen                          | above        | below               | **Tanzil**       |
| 34 words with a tatweel                          | has it       | none                | typographic only |

**Pause signs.** QUL 312 and Tanzil differ in 352 words. Against the print, QUL 312 differs in **8 words** and Tanzil in about 400. The 8 words: **2:61:44, 2:61:54, 3:80:7, 3:144:24, 3:176:11, 4:141:29, 6:128:31** (the print has ۗ, QUL 312 has ۚ) and **3:78:23** (QUL 312 has ۖ, the print has none). The hizb sign ۞ and sajda sign ۩ match in all three.

**Result.** QUL 312 differs from the print only in the marks of 9 words (52:37:7 and the 8 pause-sign words). Each is word 7 or later in its verse, so no opening (words 1 to 5) is affected. The pages on screen are drawn from the V2 glyphs, which follow the print, so none of these differences are visible. The Unicode text is used for word boundaries, checks and screen-reader text. QUL 312 stays the text source (D31), and nothing was edited by hand. `data/tanzil-differences.json` lists every reviewed difference by location: 1 verse split differently (37:130), 2 words differing in letters, 352 in pause signs, 0 in hizb or sajda signs, and 404 in other marks (this count includes the encoding conventions above, such as the 339 iqlab words). `validate` repeats the whole comparison on every run, in CI too, and fails if any difference is new or missing.

## Files downloaded in phase 1 (trial copies)

Downloaded 2026-10-31 by BUILDER into `tmp/downloads/`.

### Tanzil

Source: tanzil.net. License: **Creative Commons Attribution 3.0 (CC BY 3.0)**. Copies must be verbatim, and Tanzil must be credited with a link to tanzil.net.

| File                       | Version      | SHA-256                                                            |
| -------------------------- | ------------ | ------------------------------------------------------------------ |
| `tanzil/quran-uthmani.txt` | Uthmani 1.1  | `4b91f9e6e8ac645d039e4ed85b3be492e795232a31cd22d668ac58238722e26f` |
| `tanzil/quran-uthmani.xml` | Uthmani 1.1  | `33f4113df84c1bab0ee2eb69616139fda619bdd56fc163a72532daaf0431bf57` |
| `tanzil/quran-data.js`     | Metadata 1.0 | `9e9930c592aaa34b5c7a79ff4e99ffdc782263a266090bfe2c49e4ed4bac4ca4` |

Warning: Tanzil's page map in `quran-data.js` follows the older 1405H print on some pages (in the sample, pages 576, 596 and 600 start at different verses). **Do not use it for page, surah, juz or hizb starts.** Take those from the V2 layout.

### QPC Hafs font (not picked, D23)

Source: QUL's CDN. KFGQPC HAFS Uthmanic Script, version 2.2. License text inside the font (copyright 2010 KFGQPC): free to use, copy and distribute. It may not be sold, modified, altered, translated, reverse engineered or decompiled.

| File                                 | SHA-256                                                            |
| ------------------------------------ | ------------------------------------------------------------------ |
| `qul-font-hafs/UthmanicHafs_V22.ttf` | `aa68bffce289b4c0ebac68e90502eb69e42356abcd1603cb2b8e99c2c723f145` |

This is QUL font 245, the font `PROJECT.md` suggested (`qpc-hafs`). It would draw the Unicode script (QUL quran-script 312) on the same V2 layout, so the line breaks would be the same. BUILDER measured that it moves words by up to 47.6 px inside a 475 px line compared with the print, so it is not recommended. See `docs/DECISIONS.md` D23.

### QPC V2 page fonts (QCF2), 42 sample pages

Source: QUL's CDN (QUL font 249), by KFGQPC. **License: none published.** The font name records say "Test Font, KFGQPC" and the fonts contain no license text. QUL lists none. KFGQPC's copyright page (dm.qurancomplex.gov.sa/copyright-2/) returned 404. KFGQPC's other fonts allow free use, copying and distribution, and forbid selling or modifying. Hassan accepted using them without a published license, with credit to KFGQPC and QUL (D24). KFGQPC still owns them.

Files `qul-fonts-v2/pN.ttf` for pages 1, 2, 3, 22, 50, 76, 77, 106, 128, 151, 177, 187, 208, 235, 249, 255, 262, 267, 282, 293, 305, 312, 332, 350, 377, 404, 415, 440, 467, 484, 502, 528, 545, 562, 576, 582, 587, 591, 596, 600, 602, 604.

| File       | SHA-256                                                            |
| ---------- | ------------------------------------------------------------------ |
| `p1.ttf`   | `1686695486474b88a24a05cd4578f5295961bc9516885309ec95be574f213c27` |
| `p2.ttf`   | `305ca9b7aaf39b47551a7b9b73501b761068052e3f51bdf7d2b37d4e39177ece` |
| `p3.ttf`   | `90184ad1d7ed6f5e2d9cc8e456635bce66a8ee3ad5ff54f4856faa71f809ffef` |
| `p22.ttf`  | `78016a6aea84fd067116b9b86dcebceab476068defc366638c9a90cba7bc278d` |
| `p50.ttf`  | `80b3b3df1c02460f54ab9ef0279ab2487f20db40d8a5248b383c724a6ccb76be` |
| `p76.ttf`  | `8bda9afb9f66f289c67334999e2ab4ec9fdcda63ce9a89f3042ceda0691b9b97` |
| `p77.ttf`  | `80c0d3eacaa974094c256f47f6e2eaa9351b3dbdeea9aa5736aff500faeef097` |
| `p106.ttf` | `8848be8f85595d9549184a67fea0086700e5607fe2dcdcc544c41720eaf3f641` |
| `p128.ttf` | `df9a54789ee7d4c84861fa16c47bcd6e649cb381b8a91e91bb8abf31f8d31294` |
| `p151.ttf` | `057d0b9d6f38e2e2346b6b22674fa37740e8c8b6bbd9150bb85d0eb7c664ee0f` |
| `p177.ttf` | `44d9e1bca80b3bca04dc327183ad641141774e375404b9d8963c0d72408c8d90` |
| `p187.ttf` | `fd21044c22055ff8e4133f4298844aedcc392b7342d65abc086f029dbf073b51` |
| `p208.ttf` | `817366b586f283dd0ee64bc17429f2b2834cdac5b383980c602c826546a797a5` |
| `p235.ttf` | `1a1c9a40cc4b1877a30c3ed46e8739fe0dda6526674ec0031c895e5dc60ecfff` |
| `p249.ttf` | `02ce3a6ff27bd41e576f29a3e4ae473fe4dc472e7ac96d6d931f845c1e9658e6` |
| `p255.ttf` | `aa34c1a6e098daabe5395b9d3afab78897c4d8a901c85c06ea98fdc58c9983fb` |
| `p262.ttf` | `222642957bafd1666201364d835e5a4e99c21aafa43d7de5b31e44b9c570aa54` |
| `p267.ttf` | `6edd2095acb7fbad0a74228421f0e47cc9467a48e1fb77174d9e996cca013180` |
| `p282.ttf` | `0399520238d077faa3481d245e3a66be100da1fec67243b50694d3e025e21ac7` |
| `p293.ttf` | `e4d9f2b9e3947e2dee619adad908826e007d152d813cd3d86640ceb59729bf22` |
| `p305.ttf` | `663286590f5b41cd08bafaf78267811ca276ff2300e34d8e58b04ce57aeedbd9` |
| `p312.ttf` | `1d9b4c5454d86e14702759772075c1491aa1b1bc33bdce5bb5437ca32517e51c` |
| `p332.ttf` | `fec116520fdc37faa349957f9af8aff9469365b1d31b6fab9469163ecb7a8efc` |
| `p350.ttf` | `25334d894e10aeb0da19c98e362d05d5e493cc6500eba672cd96642f4035becd` |
| `p377.ttf` | `b50bdb2ee86beb285c6dcffbd234466f8d14f2a0647346ed0d8498ae29427912` |
| `p404.ttf` | `7a5ebae6f6acda050c2ca6d75a3ae62986bea076b885d6fef14933b1e4ce325c` |
| `p415.ttf` | `964830733e0d1b84df1a5e2210832ffa550a46abcc93e6bcc724f216050cf0a9` |
| `p440.ttf` | `01f2bb774db4787194970e64cf63a4181119d486c22dd8b4ab07a23d136304e8` |
| `p467.ttf` | `ecfda82140e835621451d072c7f94a1cf1b92b3ee98d4c4749b3a5fa1eca8c42` |
| `p484.ttf` | `70125fdac6a8774d709d56a46e6c491be467b9ca5cbfed5abf440a084b5c5cc8` |
| `p502.ttf` | `f539c818a268c79d7be17d82a48c18e5dd32fe58883c82b5ae292d71cd0c8cb0` |
| `p528.ttf` | `cbb6889d7fc1df75e310404ef83c94d11a1a0d7fec0c3508dfe4d6990e741df3` |
| `p545.ttf` | `1fbf59bec44ec0649e03a2e7a381665f900012f7a70efacae4daf4e166563dc4` |
| `p562.ttf` | `bf500e81ec9d05d4216619e5923e85843ace2b5f90052a683c6d353f7604d6ea` |
| `p576.ttf` | `eaf99d0355def5f25327c59623268ef720b116afa82a3caa6e0430d6394e0648` |
| `p582.ttf` | `e445dfc1b2063f631724d71291c119086032bf7aac083eeafe6fa44d29298ba5` |
| `p587.ttf` | `5fcb3b47363dc46bb3442cb0e2fad2154cb450d413fdd6f6870fb7ca8562fc1d` |
| `p591.ttf` | `e3cdfebafe475fdd3022a8d7d99bd774904349b609d0eca869c22da36b04baf6` |
| `p596.ttf` | `66c2bd896606718d797b704698528700c3a77e19a726b6a50053fd9dbb947052` |
| `p600.ttf` | `6a80cb7e70e69496ee9aba2dcc7f130e7c45d154754a599b65fed35dbef73994` |
| `p602.ttf` | `7d6f601e783cc60c42f5f17d9813c835c43ae63608ef3db5bb496e1c3a99cc2d` |
| `p604.ttf` | `9e5705d1aae6a02bce46bca026d1048f19f76bac013c28d5934806390493c43a` |

### Reference web pages (no checksums)

Saved copies of public pages, used only for reading. They are not data and are not checksummed.

- `qul-preview/`: QUL layout preview pages for layouts 10 (V2), 15 and 19 (the V1 and V4 comparisons) on the sample pages. 131 files.
- `qul-html/`: QUL documentation, FAQ, credits and resource pages. 45 files.
- `tarteel/terms.html`: Tarteel's terms of use.

## QUL terms

Each QUL resource page says "We don't have copyright information for this resource". The QUL FAQ says commercial use is allowed, each resource's license should be checked, and some need attribution. Downloads need a free QUL account. We will credit QUL (Tarteel). Tarteel's terms of use do not mention QUL.

## Not used

- **Quran Foundation API:** not used. It needs an API key, so Hassan must approve it first.
- **Text from the PDF:** never used. The PDF has no text layer anyway (scanned images).

## Existing open-source renderers

`PROJECT.md` asks for this check before the renderer is built. BUILDER found none that renders Madani pages in JavaScript with words hidden in place. The closest:

| Project           | What it is           | License                                                            |
| ----------------- | -------------------- | ------------------------------------------------------------------ |
| qcf_quran         | Flutter package      | Code MIT. The bundled QCF fonts are marked not for commercial use. |
| Irsaa             | Web app              | Uses page images of a different mushaf.                            |
| quran.com web app | Renders QCF V2 pages | No hide-in-place mode. License not confirmed.                      |
