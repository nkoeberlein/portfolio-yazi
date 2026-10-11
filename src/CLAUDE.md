# src

Quellcode der Astro-Seite. Überblick: Root-`CLAUDE.md`.

## Struktur

- `layouts/TUIShell.astro` — zentrales Layout: Header (Breadcrumb), `<slot/>` für die drei
  Panes, Footer (Statuszeile aus `status`-Prop + Keyhints), Shortcut-Dialog, lädt `keynav.ts`.
- `components/ParentPane.astro` — linke Pane; übergeordnetes Verzeichnis, reine Links.
- `components/FileList.astro` — mittlere Pane; EntryVMs → ch-ausgerichtete Grid-Zeilen, jeder
  Eintrag echter `<a>` + optionales `<template>` mit Preview-HTML.
- `components/PreviewPane.astro` — rechte Pane; initialer Inhalt via `html`-Prop oder Slot,
  keynav tauscht per `<template>`.
- `components/ShortcutOverlay.astro` — natives `<dialog>` (Taste `?`).
- `site.config.ts` — Angaben zur Person; erste Anlaufstelle für Theme-Nutzer.
- `pages/` — `index.astro` (Root), `projects/`, `blog/`, `pictures/`, `diagrams/`, `legal/`
  (Ordner + `[slug]`-Seiten), `welcome/about/now/cv/skills/contact` (Leaf-Seiten), `404.astro`.
  Hier liegt bewusst kein `CLAUDE.md`: Astro würde daraus die Route `/CLAUDE/` bauen.
- `lib/` — `tree.ts` (Root-Baum), `panes.ts` (Parent-Spalte + Statuszeile), `rootview.ts`
  (Root-VMs), `listing.ts` (Collection-VMs), `pictures.ts` + `images.ts` (Bilder),
  `preview.ts` (escapete Preview-HTML-Bausteine), `format.ts` (size/date/esc), `icons.ts`.
- `scripts/keynav.ts` — Vanilla-Keynav (Progressive Enhancement, kein Framework).
- `content.config.ts` + `content/` — Collections `projects`, `blog`, `pictures`, `legal`,
  `diagrams`.
- `assets/` — Bilder für `astro:assets` (`pictures/`, `covers/`).

## Muster

- EntryVM: `{ name, kind: "dir" | "file", href, note, size, date, selected, previewTitle, previewHTML }`.
- Selected serverseitig via `aria-current="page"` + `.sel`; keynav respektiert den Hash
  `#sel=<name>` (deep-linkable, schlägt die Server-Vorauswahl).
- File-Seiten listen dieselben Geschwister mit `opened=true` — die eigene Datei bekommt kein
  Template; keynav merkt sich das Dokument und stellt es bei Rückkehr wieder her.
- Jede Seite rendert drei Slot-Kinder: `<ParentPane>` (`homeParent()` bzw. `rootParent(href)`),
  `<FileList>`, `<PreviewPane>` und übergibt `status={statusOf(entries)}` an die Shell.
- Auf `pages/`-Stufe nichts kopieren: Shell und Panes kommen aus dem Layout bzw. den Komponenten.
- Neue Seiten gehören NICHT nach `pages/`, wenn sie keine Route sind (`lib/`, `scripts/`).