# src/styles

Globale Stylesheets. Hier liegt der Tailwind-Einstieg, die Farbpalette („Flavor") und das
TUI-Layout.

## Dateien

- `global.css` – `@import "tailwindcss"`, die `@font-face`-Deklarationen für das selbst gehostete
  JetBrains Mono (`public/fonts/`), die Flavor-Variablen in `:root` und der `@theme`-Block, der
  sie als Tailwind-Tokens veröffentlicht (inkl. `--green/--yellow/--red` für Statusfarben).
- `tui.css` – die Shell: Vollbild-Grid (`.tui`, `100dvh`), Header, Segment-Pills (`.seg-*`),
  die drei Panes (`.panes`, `.pane`, `.pane-title`, scrollende `.pane-body`), Statuszeile,
  Breakpoints (ohne Parent-Spalte unter 64rem, Single-Pane unter 48rem).
- `list.css` – Listenzeilen (`.entry`) für Parent- und Dateiliste, Ordner-Preview (`.pv-ls`),
  Auswahl-/Hover-/Fokus-States.
- `doc.css` – Preview-Bausteine (`.pv-*`), Dokumente (`.doc`, `.doc-prompt`), Skill-Bars,
  Bilder. Nahe am 300-Zeilen-Limit – Neues in eine eigene Datei.
- `dialog.css` – Shortcut-Overlay.
- `fetch.css` – Steckbrief der Startseite (`.fetch`, ASCII-Logo mit Verlauf, Farbleiste).
- `mermaid.css` – `.mermaid`: Rahmen, Skalierung und die Abbildung der Diagramm-Variablen
  (`--line/--muted/--surface/--border`) auf den Flavor.
- `fx.css` – der Dr460nized-Look: Neon-Wolken (`body::before`), Glas (`--glass` +
  `backdrop-filter`), Neon-Ring am aktiven Pane, Auswahl-Verlauf, Glow. Zuletzt importiert.

Alle sieben werden von `layouts/TUIShell.astro` importiert.

## Muster

- Zwei Ebenen: `:root` hält die rohen Flavor-Werte (`--bg`, `--dir`, …), `@theme inline` bildet
  sie auf `--color-*` ab. Daraus entstehen die Utilities `bg-bg`, `text-dir`, `border-border` usw.
- Neue Farbe = eine Variable in `:root` **und** ein `--color-*`-Eintrag in `@theme`.
- Ein Flavor-Wechsel tauscht nur den `:root`-Block; `@theme`, die übrigen Stylesheets und die Komponenten
  bleiben unverändert.
- `--font-mono` ist die einzige Schriftdefinition; im CSS per `var(--font-mono)`, in Klassen per
  `font-mono` verwenden.

## Stolpersteine

- Tailwind v4 wird in CSS konfiguriert – es gibt keine `tailwind.config.js`, und es soll keine
  angelegt werden.
- `@theme inline` ist nötig, weil die Tokens auf andere Variablen verweisen; ohne `inline` lösen
  die Utilities den Wert an der falschen Stelle auf.
- Preflight setzt Abstände von `p`, `h*`, `ul` und die Link-Unterstreichung zurück. Die
  Stylesheets hier sind unlayered und schlagen Tailwinds Layer deshalb – absichtlich.
- Biome parst `@theme`/`@apply` nur, weil `css.parser.tailwindDirectives` in `biome.json` aktiv
  ist.
- Die Grid-Spalten der Liste sind `[icon 2ch] [name 1fr] [size auto]`; auf File-Seiten
  (`.tui[data-kind="file"]`) entfällt die Größe. Datum und Note stehen in der Statuszeile.
- `.pane` darf kein `overflow` bekommen – der `.pane-title` sitzt auf dem Rahmen und würde
  abgeschnitten. Gescrollt wird nur in `.pane-body`.
- Der aktuelle Flavor ist „sweet" (Garuda Dr460nized). `--magenta` ist nur Fläche/Verlauf, als
  Textfarbe zu kontrastarm – dafür `--accent`.
- `.tui` braucht `grid-template-columns: minmax(0, 1fr)` – ohne das weitet die `nowrap`-
  Statuszeile das Layout über den Viewport.
- `fx.css`: `--glass` nicht unter ~70 % Deckkraft senken (Kontrast von `--dim`); Fallbacks für
  fehlendes `backdrop-filter` und `prefers-reduced-transparency` stehen am Dateiende.
