# src/lib

Data preparation for the pages: view models and preview HTML are built from the tree and the
content collections. No DOM code (that lives in `scripts/`).

## Files

- `tree.ts` — `ROOT`, the `~/` tree (single source of truth), `findEntry()`.
- `panes.ts` — `homeParent()`, `rootParent(href)` for the parent column, `statusOf(entries)`
  for the status line. Pure, no `astro:content`.
- `rootview.ts` — `rootVMs(href, opened?)`: EntryVMs for `~/` incl. preview HTML.
- `listing.ts` — `projectVMs()` / `postVMs()` (async, because of covers) and `legalVMs()`:
  collection → EntryVMs, sorting.
- `pictures.ts` — `pictureVMs()` for `~/pictures/` (name `<id>.<format>`, size = pixel dimensions).
- `images.ts` — `figureFor()` / `coverFor()`: `getImage()` + `figure()`; the only place in `lib/`
  that touches `astro:assets`.
- `preview.ts` — escaping HTML building blocks (`heading`, `p`, `bullets`, `kv`, `keyHint`,
  `listing` for folder previews, `figure` for images). Pure and tested.
- `mermaid.ts` — `mermaidFigure()` (mermaid → `<figure class="mermaid">` with inline SVG),
  `mermaidPlugin()` (Sätteri hast plugin) and `mermaidGuard()` (integration that aborts the
  build on failed diagrams). Imported by `astro.config.mjs`.
- `fetch.ts` — `ASTRO_LOGO` + `fetchHTML()`: the home page spec sheet. Pure and tested.
- `diagram-files.ts` — `parseDiagramFile()` / `readDiagrams()`: reads `.mmd` files with a
  `%% key: value` header (loader of the `diagrams` collection). `diagrams.ts` — `diagramVMs()`.
- `format.ts` — `sizeOf`, `dateOf`, `esc`. `icons.ts` — `iconFor()`.
- `*.test.ts` — tests next to each module (`npm test`, `node --test`).

## Patterns

- New tests go next to the module as `*.test.ts`. Only modules that import neither `astro:content`
  nor `.astro` runtime code are testable; such modules import relatively **with** a `.ts`
  extension (Node otherwise fails to resolve).
- `opened=true` means "file page": the selected entry gets an empty `previewHTML`.
- Unknown routes/entries throw — typos should stop the build.

## Pitfalls

- `mermaid.ts`: the renderer bakes a Google Fonts `@import` and inline colors into the SVG;
  `detheme()` removes both (a test secures this). Do not pass `var(--bg)` or similar as an
  option — that would produce `--bg: var(--bg)` on the SVG, a cycle. Colors come from `doc.css`.
- Astro renders markdown with Sätteri, not remark/rehype: plugins are hast visitors
  (`defineHastPlugin`), HTML is returned as `{ type: "raw", value }`.

- Everything that ends up in `previewHTML` must go through `esc()`; the only exception is `keyHint`.
- `iconFor()` must be filled only with glyphs that JetBrains Mono contains (no Nerd Font).