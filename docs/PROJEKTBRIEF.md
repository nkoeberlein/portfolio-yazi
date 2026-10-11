# Projektbrief — Portfolio im Yazi-Stil

**Ursprung:** Anfrage von Nikolaus Köberlein, 2026-10-10 · **Projekt angelegt:** 2026-10-10 (Volume `/projects` = Host `/root/projects`)

---

## Auftrag (1:1)

> Neues Projekt anlegen: Portfolio Website im Terminal Yazi Stil vorzugsweise mit Astro. https://github.com/sxyazi/yazi

## Was ist Yazi?

- TUI-Dateimanager in Rust ([sxyazi/yazi](https://github.com/sxyazi/yazi)): Dateiliste + Preview-Pane, Header-Statuszeile/Breadcrumb, Footer mit Keybind-Hints, Theme-"Flavors", Monospace-Typografie, sehr schnell
- Flavors (Theme-Paletten): [yazi-rs/flavors](https://github.com/yazi-rs/flavors) — z. B. tokyo-night, catppuccin, dracula, osaka

## Übersetzung ins Web (Konzept)

### Design-Sprache

- Farbschema über **CSS-Variablen**; Startpunkt Flavor "tokyo-night" (Palette bereits in `src/pages/index.astro` dokumentiert), austauschbar via Flavor-/Theme-Datei
- Monospace-Font: JetBrains Mono oder Fira Code (selbst hosten, `font-display: swap`)
- Layout: Header (Pfad/Breadcrumb) · zwei Panes (links Einträge, rechts Preview) · Footer (Keyhints)

### Interaktion

- Selection-State per Vanilla JS (kein Framework nötig): `j/k` + Pfeiltasten, `Enter` öffnen, `h/l` Verzeichnis hoch/runter, `?` Shortcut-Overlay, `q` → Home statt "Browser schließen" 😉
- **URL-Sync:** Selection/Ordner als echte Astro-Static-Routes (`/projekte/`, `/projekte/foo/`) — deep-linkable, teilerbar
- **Progressive Enhancement:** Basis-HTML ohne JS nutzbar (normale Links), Keyboard als Enhancement; aria-labels, Fokus-States, `prefers-reduced-motion`
- Preview-Pane zeigt Inhalt des markierten Eintrags (Projekt-Detail, CV-Abschnitt …)

### Astro-Umsetzung

- Static Output; **Content Collections** für Projekte & Blog ("Ordner" im Dateibaum)
- `TUIShell.astro` als zentrales Layout (Header/Panes/Footer)
- Icons: Unicode-/Nerd-Font-Glyphen oder SVG-Sprites — kein Icon-Paket-Bloat

## Offene Fragen

- [x] Flavor: **sweet (Garuda Dr460nized), Dark-only** — löst tokyo-night ab (2026-10-11) · Fonts **self-hosted** (`public/fonts/`, JetBrains Mono woff2)
- [x] Sektionen: `projects/`, `blog/` (Collections) + `about/cv/skills/contact` als Root-Dateien
- [x] Mobile: **Single-Pane** (Liste oben, Preview darunter); Tastaturhint bleibt sichtbar
- [x] Inhaltssprache: **Englisch** (Site-Copy), Code und Doku auf Deutsch
- [x] Nur Dark (TUI-typisch), kein Light-Toggle
- [ ] Deployment-Ziel & Domain — offen (Astro-Output neutral statisch)

## Historie

- 2026-10-10: Astro-Skeleton + erster optischer Draft (`index.astro`) angelegt, Repo initialisiert.
- 2026-10-11: Vollausbau mit **Musterdaten (Max Mustermann)**: `TUIShell.astro` (Header/Panes/
  Footer), Content Collections `projects` + `blog`, Routes `/projects/[slug]` & `/blog/[slug]`,
  Vanilla-Keynav (`j/k`, `⏎/l`, `h`, `g/G`, `q`, `?`) mit URL-Sync (`#sel=`) und
  `<template>`-Preview-Swap, Shortcut-Dialog, 404 als `zsh: no such file or directory`,
  self-hosted JetBrains Mono, Mobile-Single-Pane. Entscheidungen zu Flavor/Sektionen/Sprache
  siehe oben.
- 2026-10-11: Redesign auf Wunsch „drei Spalten wie Yazi, Theme wie Garuda Linux": Vollbild-TUI
  mit Parent/Current/Preview (1:4:3, File-Seiten 1:2:5), Flavor **sweet** (Sweet-Palette des
  Dr460nized-Looks), runde Pane-Rahmen, Statuszeile mit Segmenten, Ordner-Preview als
  Dateiliste, `J/K` scrollt die Preview. Dezent gehalten: kein Hintergrundverlauf, kein Blur.
- 2026-10-11: Ausbau „voll Dr460nized": Neon-Verlauf, Glas/Blur, Glow (`src/styles/fx.css`).
  Bilder über `astro:assets` – Ordner `~/pictures/` und optionale Cover für Projekte/Posts
  (derzeit generierte SVG-Platzhalter). Neu: `now.md`, `~/legal/` mit `imprint.md` und
  `privacy.md` (englische Vorlagen mit `TODO`-Markern, `noindex`, Links in jeder Fußzeile).
  **Vor Go-live:** Legal-Texte mit echten Angaben füllen und prüfen lassen.
- 2026-10-11: Mermaid-Diagramme: ```` ```mermaid ````-Blöcke werden beim Build mit
  `beautiful-mermaid` zu Inline-SVG in Flavor-Farben (kein JS im Browser). Unterstützt sind
  Flowchart, Sequenz-, Klassen-, ER-, Zustands- und XY-Diagramme.
- 2026-10-11: **Ziel: Veröffentlichung als Theme auf Astro Themes.** Dazu `src/site.config.ts`
  als zentrale Stelle für Personenangaben. Außerdem: Pfeiltasten-Steuerung (←/→, Home/End),
  Startseite `welcome.txt` mit ASCII-Astro-Logo im fastfetch-Stil, Beispielordner `~/diagrams/`
  mit sechs `.mmd`-Dateien. Offen für die Einreichung: englische README für Theme-Nutzer,
  Lizenz, Screenshots, restliche fest verdrahtete `max@mustermann`-Angaben nach `site.config.ts`.
- 2026-10-11: Lizenz **MIT** (`LICENSE`), englische README mit Screenshots, Handle zentral in
  `site.config.ts` (`HANDLE`). Noch offen: `OFL.txt` zu den Schriftdateien legen.