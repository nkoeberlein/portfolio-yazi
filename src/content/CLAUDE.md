# src/content

Die Inhalte der vier Content Collections (Schema: `src/content.config.ts`). Aktuell
**Musterdaten** (Max Mustermann) – vor Go-live austauschen.

## Ordner

- `projects/` — ein Markdown je Projekt. Pflicht: `title`, `summary`, `period`, `role`,
  `updated`; optional `stack`, `repo`, `demo`, `featured`, `cover` + `coverAlt`.
- `blog/` — Posts: `title`, `summary`, `published`, `tags`; optional `cover` + `coverAlt`.
- `pictures/` — ein Markdown je Bild: `title`, `alt`, `caption`, `taken`, `image`. Der Body ist
  die Beschreibung unter dem Bild.
- `diagrams/` — Mermaid-Beispiele als echte `.mmd`-Dateien. Die ersten Zeilen sind Pflicht:
  `%% title: …`, `%% summary: …`, `%% updated: YYYY-MM-DD`, danach der Diagramm-Quelltext.
- `legal/` — `imprint.md`, `privacy.md`: `title`, `summary`, `updated`.

## Muster

- Der Dateiname ist die ID und damit Route und Listenname (`loadsmith.md` → `/projects/loadsmith/`).
- Bildpfade (`cover`, `image`) relativ zur Markdown-Datei nach `src/assets/…`, z. B.
  `../../assets/covers/loadsmith.svg`. Das Schema prüft, dass die Datei existiert.
- Inhaltssprache Englisch.
- Diagramme als Codeblock mit Sprache `mermaid`, optional mit Beschreibung für Screenreader:
  ```` ```mermaid alt="Replay pipeline" ````. Unterstützt: `graph`/`flowchart`,
  `sequenceDiagram`, `classDiagram`, `erDiagram`, `stateDiagram-v2`, `xychart-beta`.
  Beispiele: `projects/loadsmith.md`, `blog/taming-the-tail.md`.

## Stolpersteine

- Kein `gantt`, `pie`, `mindmap`, `gitGraph` – der Build bricht mit einer Meldung ab.
- Breite Flowcharts (`LR` mit vielen Knoten) werden im Pane verkleinert; ab etwa sieben Knoten
  lieber `TD` oder aufteilen.

- Neue oder geänderte `.mmd`-Dateien erkennt der Dev-Server nicht von selbst (Inline-Loader ohne
  Watcher) – Dev-Server neu starten bzw. `npx astro build --force`.
- Diese Datei wird nicht eingelesen: die Loader erfassen nur die Unterordner.
- Zeilenumbrüche in Adressen brauchen ein `\` am Zeilenende, sonst fließt alles in eine Zeile.
- `legal/*` sind Vorlagen, keine Rechtsberatung. `TODO`-Marker vor Veröffentlichung auflösen;
  `privacy.md` muss zum tatsächlichen Hosting passen.
