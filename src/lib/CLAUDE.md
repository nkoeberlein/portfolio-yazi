# src/lib

Datenaufbereitung für die Seiten: aus Baum und Content Collections werden View-Models und
Preview-HTML. Kein DOM-Code (der liegt in `scripts/`).

## Dateien

- `tree.ts` — `ROOT`, der Baum `~/` (Single Source of Truth), `findEntry()`.
- `panes.ts` — `homeParent()`, `rootParent(href)` für die Parent-Spalte, `statusOf(entries)`
  für die Statuszeile. Rein, ohne `astro:content`.
- `rootview.ts` — `rootVMs(href, opened?)`: EntryVMs für `~/` inkl. Preview-HTML.
- `listing.ts` — `projectVMs()` / `postVMs()` (async, wegen Cover) und `legalVMs()`:
  Collection → EntryVMs, Sortierung.
- `pictures.ts` — `pictureVMs()` für `~/pictures/` (Name `<id>.<format>`, Größe = Pixelmaße).
- `images.ts` — `figureFor()` / `coverFor()`: `getImage()` + `figure()`; einziger Ort, der
  `astro:assets` in `lib/` anfasst.
- `preview.ts` — escapende HTML-Bausteine (`heading`, `p`, `bullets`, `kv`, `keyHint`,
  `listing` für Ordner-Previews, `figure` für Bilder). Rein und getestet.
- `mermaid.ts` — `mermaidFigure()` (Mermaid → `<figure class="mermaid">` mit Inline-SVG),
  `mermaidPlugin()` (Sätteri-hast-Plugin) und `mermaidGuard()` (Integration, die den Build bei
  fehlgeschlagenen Diagrammen abbricht). Wird von `astro.config.mjs` importiert.
- `fetch.ts` — `ASTRO_LOGO` + `fetchHTML()`: Steckbrief der Startseite. Rein und getestet.
- `diagram-files.ts` — `parseDiagramFile()` / `readDiagrams()`: `.mmd`-Dateien mit
  `%% key: value`-Kopf lesen (Loader der Collection `diagrams`). `diagrams.ts` — `diagramVMs()`.
- `format.ts` — `sizeOf`, `dateOf`, `esc`. `icons.ts` — `iconFor()`.
- `*.test.ts` — Tests neben dem jeweiligen Modul (`npm test`, `node --test`).

## Muster

- Neue Tests neben das Modul als `*.test.ts`. Testbar ist nur, was weder `astro:content` noch
  `.astro`-Laufzeitcode importiert; solche Module importieren relativ **mit** `.ts`-Endung
  (Node löst sonst nicht auf).
- `opened=true` heißt „File-Seite": der selektierte Eintrag bekommt leeres `previewHTML`.
- Unbekannte Routen/Einträge werfen – Tippfehler sollen den Build stoppen.

## Stolpersteine

- `mermaid.ts`: Der Renderer baut einen Google-Fonts-`@import` und Inline-Farben ins SVG;
  `detheme()` entfernt beides (Test sichert das ab). Nicht `var(--bg)` o. Ä. als Option
  übergeben – das ergäbe `--bg: var(--bg)` am SVG, einen Zyklus. Farben kommen aus `doc.css`.
- Astro rendert Markdown mit Sätteri, nicht remark/rehype: Plugins sind hast-Visitor
  (`defineHastPlugin`), HTML wird als `{ type: "raw", value }` zurückgegeben.

- Alles, was in `previewHTML` landet, muss durch `esc()`; einzige Ausnahme ist `keyHint`.
- `iconFor()` nur mit Zeichen füllen, die JetBrains Mono enthält (kein Nerd Font).
