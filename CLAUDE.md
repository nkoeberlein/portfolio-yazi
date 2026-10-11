# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projekt

Portfolio-Website, die aussieht und sich bedient wie der Terminal-Dateimanager
[Yazi](https://github.com/sxyazi/yazi). Statische Astro-5-Seite, Code-Kommentare und Doku auf
Deutsch, Seiteninhalte auf Englisch. **Aktueller Inhalt sind Musterdaten (Max Mustermann)** —
beim echten Go-live gegen echte Inhalte austauschen: `src/lib/tree.ts` (Root-Baum) und
`src/content/` (Projekte/Blog).

Stand: vollständiger Erstbuild (2026-10-11). TUI-Shell, Keyboard-Navigation, Content Collections
und alle Seiten sind implementiert; das Zielbild aus `docs/PROJEKTBRIEF.md` ist im Wesentlichen
umgesetzt. Entscheide der offenen Fragen sind dort unter „Historie" festgehalten.

## Befehle

```bash
npm install
npm run dev      # Dev-Server auf http://localhost:4321
npm run build    # statischer Output nach dist/ (35 Seiten)
npm run preview  # gebautes dist/ lokal ausliefern
npm run check    # astro check: Typprüfung für .astro/.ts
npm test         # node --test: reine lib-Module (src/**/*.test.ts)
npm run lint     # Biome: Lint + Format-Prüfung (nur lesen)
npm run format   # Biome: Format und sichere Fixes schreiben
```

Biome ersetzt ESLint und Prettier – keins von beiden hinzufügen. `.astro`-Dateien laufen über
Biomes experimentellen HTML-Support (`html.experimentalFullSupportEnabled` in `biome.json`);
Typfehler findet nur `astro check`. TypeScript läuft mit `astro/tsconfigs/strict`.

## Architektur

**Dateimanager-Metapher:** Jede Route ist ein Eintrag im Dateibaum. Das Layout hat drei Zonen:
Header (Breadcrumb), drei Panes wie in Yazi (Parent · aktuelle Liste · Preview des markierten
Eintrags), Footer (Statuszeile des markierten Eintrags + Keyhints). Verhältnis 1:4:3, auf
File-Seiten 1:2:5. Zwei Seitenarten:

- `tree`-Seiten (Root, `/projects/`, `/blog/`, `/pictures/`, `/diagrams/`, `/legal/`): Auswahl im Hash nach `#sel=<name>`, preview folgt
  der Auswahl serverseitig (erste Vorauswahl) und clientseitig (per `<template>`-Austausch).
- `file`-Seiten (`/cv/`, `/projects/loadsmith/`, …): die geöffnete Datei ist selektiert; links
  erscheinen die Geschwister, rechts das vollständige Dokument. Preview-Swap zeigt dann Summaries.

**Datenfluss (Single Source of Truth):**

- `src/lib/tree.ts` — der Root-Baum `~/` (Ordner + Stammdaten), `findEntry()`.
- `src/lib/panes.ts` — Parent-Spalte (`homeParent()`, `rootParent()`) und `statusOf()` für die
  Statuszeile; rein, per `npm test` geprüft.
- `src/lib/rootview.ts` — `rootVMs(href, opened?)`: Root-EntryVMs inkl. Preview-HTML; genutzt von
  `index.astro` und den vier Leaf-Seiten (about/cv/skills/contact).
- `src/lib/listing.ts` — `projectVMs()/postVMs()`: Collection → EntryVMs (Sortierung featured
  zuerst/neueste zuerst, Summaries als Preview, `opened=true` für File-Seiten → kein Template
  für die eigene Datei, keynav stellt das Dokument wieder her).
- `src/site.config.ts` — Angaben zur Person (Name, Rolle, Ort, Stack …) und `HANDLE`
  (`user@host`); `TUIShell` setzt Handle-Crumb und Titel-Suffix selbst, `Prompt.astro` den
  Shell-Prompt – Seiten übergeben nur den Pfad ab `~` und den Seitentitel. Lizenz: MIT. **Ziel ist die
  Veröffentlichung als Theme auf Astro Themes**: Personenbezogenes gehört hierher, nicht fest in
  Seiten oder Komponenten.
- `src/lib/fetch.ts` — Steckbrief der Startseite im fastfetch-Stil (ASCII-Astro-Logo + Zeilen);
  `welcome.txt` ist auf `/` vorausgewählt.
- `src/lib/diagrams.ts` + `src/lib/diagram-files.ts` — `~/diagrams/`: echte `.mmd`-Dateien mit
  `%% key: value`-Kopf, über einen Inline-Loader als Collection `diagrams`.
- `src/lib/pictures.ts` — `pictureVMs()` für `~/pictures/`; `src/lib/images.ts` optimiert Bilder
  über `astro:assets` und liefert das `<figure>`-HTML für Previews und Cover.
- Content Collections (`src/content.config.ts`): `projects`, `blog` (beide mit optionalem
  `cover`), `pictures` (ein Markdown je Bild, `image` zeigt nach `src/assets/pictures/`) und
  `legal` (imprint, privacy). Schema mit zod aus `astro/zod`.

**Progressive Enhancement:** Ohne JS ist jede Seite eine normale Link-Seite (SEO-Fallback).
`src/scripts/keynav.ts` ist nur Aufsatz: `↑/↓` bzw. `j/k` bewegen die Auswahl (Preview folgt via
`<template>`-Klon, Hash via `history.replaceState`), `→/Enter/l` öffnen, `←/h` hoch, `q` nach `~`,
`Home/End` bzw. `g/G` an den Anfang/das Ende, `J/K` scrollt die Preview, `?` öffnet ein natives `<dialog>`-Overlay. Kein UI-Framework.

## Leitplanken

- **Farben nur über die Flavor-Variablen** (`--bg`, `--fg`, `--dir`, `--sel`, `--accent`, …) in
  `src/styles/global.css`, in Tailwind als `bg-bg`, `text-dir`, `border-border` usw. verfügbar.
  Nicht Tailwinds Standardpalette (`text-blue-500`) verwenden. Die Palette ist ein Yazi-„Flavor"
  („sweet", Garuda Dr460nized) und bleibt als Ganzes austauschbar – keine Hex-Werte in Komponenten.
- **Monospace-Raster:** Listenzeilen sind ein CSS-Grid in `ch` (`.entry`: Icon 2ch · Name ·
  Größe). Keine proportionalen Schriften, keine Padding-Tricks, die das Raster brechen.
- **Vollbild:** `.tui` ist `100dvh` hoch, nur die `.pane-body`-Elemente scrollen. Unter 64rem
  entfällt die Parent-Spalte, unter 48rem Single-Pane mit normalem Seiten-Scrollen.
- **Icons:** reine Unicode-Glyphen (`src/lib/icons.ts`), kein Icon-Paket. Keine Nerd-Font-/
  Private-Use-Codepoints – das selbst gehostete JetBrains Mono enthält sie nicht.
- **Zugänglichkeit:** `aria-label`/`aria-current` an den Panes und Einträgen, sichtbare
  Fokus-States (`.entry:focus-visible`), `prefers-reduced-motion`, native `<dialog>`.
- **Effekte getrennt:** Verlauf, Glas, Glow liegen nur in `src/styles/fx.css` und nutzen
  ausschließlich Flavor-Variablen. Layout nie von `fx.css` abhängig machen.
- **Bilder:** immer über `astro:assets` (`image()` im Schema, `<Image>`/`figureFor()`), nie aus
  `public/`. Die jetzigen SVGs sind Platzhalter.
- **Rechtliches:** `legal/*` sind Vorlagen mit `TODO`-Markern und `noindex`; die Fußzeilen-Links
  in `TUIShell.astro` müssen auf jeder Seite bleiben.
- **Diagramme:** ```` ```mermaid ````-Blöcke werden beim Build zu Inline-SVG (`src/lib/mermaid.ts`,
  Sätteri-Plugin in `astro.config.mjs`) – kein mermaid.js im Browser. Nur Flowchart, Sequenz-,
  Klassen-, ER-, Zustands- und XY-Diagramme; alles andere lässt den Build scheitern.
  Nach Änderungen am Plugin `npx astro build --force` (der Content-Cache merkt sie nicht).
- **Kein `.md` in `src/pages/`** (auch kein `CLAUDE.md`) – Astro baut daraus eine Route.
- **Neue Seite = Baum + Liste + Preview:** Seite in `pages/`, ggf. Eintrag in `tree.ts`/Collection,
  stets mit Preview-Template — sonst bleibt der rechte Pane leer.

## Historie (Kurzfassung)

- 2026-10-10: Astro-Skeleton + erster optischer Draft.
- 2026-10-11: Vollausbau — TUI-Shell, Collections, Keynav, Deep-Links, Mobile-Single-Pane,
  Musterdaten (Max Mustermann, englische Inhalte), 404 `zsh: no such file or directory`.
- 2026-10-11: Redesign — drei Spalten im Vollbild (Parent/Current/Preview), Flavor „sweet"
  (Garuda Dr460nized), Statuszeile mit Segmenten, Ordner-Preview als Dateiliste, `J/K`.
- 2026-10-11: Voll Dr460nized (`fx.css`), Bilder (`~/pictures/` + Cover), `now.md`,
  `~/legal/` (imprint, privacy) mit Fußzeilen-Links.
- 2026-10-11: Mermaid-Diagramme als Build-Zeit-SVG in Flavor-Farben.
- 2026-10-11: Pfeiltasten (←/→, Home/End), Startseite `welcome.txt` mit ASCII-Astro-Logo im
  Fetch-Stil, Beispielordner `~/diagrams/`, `src/site.config.ts`.