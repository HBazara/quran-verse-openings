# Text cross-check: QUL KFGQPC Hafs (script 312) against Tanzil Uthmani 1.1, and against the print

BUILDER wrote this report in phase 2. DOCU copied it here from `tmp/phase2/CROSSCHECK.md` so it stays in the repo, because `tmp/` is ignored by git. The image close-ups and JSON evidence it is based on stay in `tmp/phase2/`. A short summary is in `docs/DATA-SOURCES.md`.

Date: 2026-10-31. BUILDER, Phase 2. Rule 1 in PROJECT.md: compare the full text of every verse against Tanzil and report any difference.

## Sources

- Our text: QUL quran-script 312 "KFGQPC Hafs script - Word by word" (`qpc-hafs-word-by-word.db`, export 2025-05-28), 83,668 tokens (77,432 words and 6,236 verse numbers).
- Tanzil: Uthmani 1.1 (`quran-uthmani.txt`), split with the PROJECT.md rules (pause marks join the previous word, Bismillah removed from verse 1 except Al-Fatiha, the hizb sign joins the next word).
- The print: the V2 glyph data (QUL script 61), traced from the 1421H print, plus close-ups of the PDF for every case that needed a decision.

## Results

### 1. Word counts

All 6,236 verses have the same number of words, except **37:130**. QPC keeps "إِلۡ يَاسِينَ" as one word; Tanzil splits it in two. Our layout and V2 glyphs follow QPC (one word), so an opening of 3 or more words shows "إِلۡ يَاسِينَ" whole.

### 2. Letters

Letters (Unicode letters only) are identical in every word, after three spelling conventions applied to both texts:

| Convention                    | QPC writes    | Tanzil writes               |
| ----------------------------- | ------------- | --------------------------- |
| Dotless final yeh             | U+064A yeh    | U+0649 alef maksura         |
| Hamza followed by a long a    | U+0623 U+0653 | U+0640 U+0654 U+064E U+0627 |
| Yeh with hamza in a few words | U+064A U+0655 | U+0626                      |

Two words still differ, both in how the hamza is encoded:

- **2:72:4**: QPC writes the hamza as the letter U+0621; Tanzil as the mark U+0654. Same spelling.
- **56:23:2**: QPC writes the hamza below the waw (U+0648 U+0655); Tanzil writes ؤ (hamza above). **The print has the hamza below, as QPC does.**

### 3. Marks (vowels and signs)

Encoding conventions (same text, different code points), applied before comparing:

| Mark in the print                          | QPC                      | Tanzil               | QPC count      |
| ------------------------------------------ | ------------------------ | -------------------- | -------------- |
| Sukun                                      | U+06E1                   | U+0652               | 37,148         |
| Round zero (silent letter)                 | U+0652                   | U+06DF               | 3,988 (Tanzil) |
| Staggered fathatan                         | U+0657                   | U+064B               | 2,901          |
| Staggered dammatan                         | U+065E                   | U+064C               | 1,807          |
| Staggered kasratan                         | U+0656                   | U+064D               | 1,935          |
| Iqlab tanween (one vowel and a small meem) | vowel + U+06E2 or U+06ED | tanween + small meem | 339 words      |

Other mark differences, each checked against the print:

| Word                                             | QPC           | Tanzil              | Print                    |
| ------------------------------------------------ | ------------- | ------------------- | ------------------------ |
| Sajda overline (26 words in the 15 sajda verses) | U+06E4        | none                | line above the word: QPC |
| 12:11:6 ishmam dot                               | U+06EC filled | U+06EB hollow       | filled: QPC              |
| 17:7:12                                          | no small waw  | small waw and madda | none: QPC                |
| 52:37:7 small seen                               | U+06DC above  | U+06E3 below        | **below: Tanzil**        |
| 34 words with a tatweel in QPC                   | U+0640        | none                | typographic only         |

### 4. Pause signs (waqf)

- QPC and Tanzil differ in **352 words** (for example ۚ against ۗ, or a ۙ that only Tanzil has).
- Against the print, for the whole Quran (each sign glyph in the V2 data classified by shape, every disagreement inspected): **QPC differs in 8 words, Tanzil in about 400.**
- The 8 QPC words, all confirmed on the PDF: **2:61:44, 2:61:54, 3:80:7, 3:144:24, 3:176:11, 4:141:29, 6:128:31** (the print has ۗ, QPC has ۚ) and **3:78:23** (QPC has ۖ, the print has none).
- The hizb sign ۞ and the sajda sign ۩ are identical in all three.

### 5. Hizb quarter starts

Added after the report was first written. The quarter starts in `data/quran.json` come from the print: the 199 verses whose first word carries the hizb sign ۞, plus the 41 quarters that begin a surah. Compared with Tanzil's metadata:

- The juz starts are identical.
- The quarter starts differ in one place: the print has the hizb sign at **15:49** (page 264, line 14, with the margin marker "ربع الحزب ٢٧"). Tanzil lists **15:50**. We follow the print. AUD confirmed it on the print page.

`build-data` fails if any other quarter difference appears, and `validate` checks in CI that every quarter starts at a hizb sign or a new surah.

## What this means

- **What readers see is the print.** Pages are drawn with the V2 glyphs, which are traced from the 1421H print, so none of these differences appear on screen.
- **Our Unicode text (QUL 312) matches the print except for marks on 9 words**: 52:37:7 and the 8 pause-sign words above. None of them is among the first 5 words of its verse, so no opening is affected. The Unicode text is used for word boundaries, checks and screen-reader text only.
- **QUL 312 matches the print far better than Tanzil**, so it stays the text source. Following Rule 1, nothing was retyped or edited by hand.
- `node scripts/validate.mjs` repeats this cross-check on every run, in CI too. The reviewed differences are listed by location in `data/tanzil-differences.json`, and validate fails if any difference is new or missing (see `docs/DATA-FORMAT.md`, checks 19 and 20).
