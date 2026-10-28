# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

## Project

Portfolio website that looks and behaves like the terminal file manager
[Yazi](https://github.com/sxyazi/yazi). A static Astro 5 site; code comments and docs are in
English, page content is in English as well. **Current content is sample data (Max Mustermann)** —
before the real go-live, replace it with real content in `src/lib/tree.ts` (root tree) and
`src/content/` (projects/blog).

State: complete initial build (2026-10-11). TUI shell, keyboard navigation, content collections,
and all pages are implemented; the target vision in `docs/PROJEKTBRIEF.md` is essentially done.
Decisions on open questions are recorded there under "Historie".

## Commands

```bash
npm install
npm run dev      # dev server on http://localhost:4321
npm run build    # static output into dist/ (35 pages)
npm run preview  # serve the built dist/ locally
npm run check    # astro check: type checking for .astro/.ts
npm test         # node --test: pure lib modules (src/**/*.test.ts)
npm run lint     # Biome: lint + format check (read-only)
npm run format   # Biome: format and write safe fixes
```

Biome replaces ESLint and Prettier — do not add either. `.astro` files go through Biome's
experimental HTML support (`html.experimentalFullSupportEnabled` in `biome.json`); type errors
are only found by `astro check`. TypeScript runs with `astro/tsconfigs/strict`.

## Architecture

**File manager metaphor:** every route is an entry in the file tree. The layout has three zones:
header (breadcrumb), three panes like Yazi (parent · current list · preview of the highlighted
entry), footer (status line of the highlighted entry + key hints). Ratio 1:4:3, on file pages
1:2:5. Two page types:

- `tree` pages (root, `/projects/`, `/blog/`, `/pictures/`, `/diagrams/`, `/legal/`): selection
  lives in the hash as `#sel=<name>`; the preview follows the selection server-side (initial
  preselection) and client-side (via `<template>` swap).
- `file` pages (`/cv/`, `/projects/loadsmith/`, …): the opened file is selected; siblings appear
  on the left, the full document on the right. Preview swap then shows summaries.

**Data flow (single source of truth):**

- `src/lib/tree.ts` — the root tree `~/` (folders + core metadata), `findEntry()`.
- `src/lib/panes.ts` — parent column (`homeParent()`, `rootParent()`) and `statusOf()` for the
  status line; pure, covered by `npm test`.
- `src/lib/rootview.ts` — `rootVMs(href, opened?)`: root EntryVMs incl. preview HTML; used by
  `index.astro` and the four leaf pages (about/cv/skills/contact).
- `src/lib/listing.ts` — `projectVMs()/postVMs()`: collection → EntryVMs (featured first / newest
  first, summaries as preview, `opened=true` for file pages → no template for the own file, keynav
  restores the document). `postVMs()` also appends the synthetic `feed.xml` entry — the RSS feed
  (`src/pages/blog/feed.xml.ts`) is itself a file in `~/blog/`.
- `src/site.config.ts` — personal details (name, role, location, stack …), `HANDLE`
  (`user@host`), and `url` (canonical base URL — feeds `site` in `astro.config.mjs`, sitemap,
  canonical/OG tags and the RSS feed); `TUIShell` sets the handle crumb and the title suffix
  itself, `Prompt.astro` the shell prompt — pages only pass the path from `~` and the page title.
  License: MIT. **The goal is publication as a theme on Astro Themes**: personal data belongs
  here, not hard-coded into pages or components.
- `src/lib/fetch.ts` — the home page spec sheet in fastfetch style (ASCII Astro logo + lines);
  `welcome.txt` is preselected on `/`.
- `src/lib/diagrams.ts` + `src/lib/diagram-files.ts` — `~/diagrams/`: real `.mmd` files with a
  `%% key: value` header, loaded as the `diagrams` collection via an inline loader.
- `src/lib/pictures.ts` — `pictureVMs()` for `~/pictures/`; `src/lib/images.ts` optimizes images
  via `astro:assets` and provides the `<figure>` HTML for previews and covers.
- Content collections (`src/content.config.ts`): `projects`, `blog` (both with optional `cover`),
  `pictures` (one markdown per image, `image` points into `src/assets/pictures/`) and `legal`
  (imprint, privacy). Schema with zod from `astro/zod`.

**Progressive enhancement:** without JS every page is a plain link page (SEO fallback).
`src/scripts/keynav.ts` is purely an add-on: `↑/↓` or `j/k` move the selection (preview follows
via `<template>` cloning, hash via `history.replaceState`), `→/Enter/l` open, `←/h` go up, `q`
goes to `~`, `Home/End` or `g/G` jump to start/end, `J/K` scroll the preview, `?` opens a native
`<dialog>` overlay. No UI framework.

## Guidelines

- **Colors only via the flavor variables** (`--bg`, `--fg`, `--dir`, `--sel`, `--accent`, …) in
  `src/styles/global.css`, available in Tailwind as `bg-bg`, `text-dir`, `border-border` etc. Do
  not use Tailwind's default palette (`text-blue-500`). The palette is a Yazi "flavor" ("sweet",
  Garuda Dr460nized) and stays swappable as a whole — no hex values in components.
- **Monospace grid:** list rows are a CSS grid in `ch` (`.entry`: icon 2ch · name · size). No
  proportional fonts, no padding tricks that break the grid.
- **Full screen:** `.tui` is `100dvh` tall; only the `.pane-body` elements scroll. Below 64rem the
  parent column is dropped, below 48rem single pane with normal page scrolling.
- **Icons:** inline SVGs from the `material-icon-theme` Iconify dataset, built at build time in
  `src/lib/icons.ts` and recolored to flavor variables (`currentColor` per file type, two-tone
  folder badges via `--icon-badge`) — the file-type coloring mirrors Yazi flavor `[filetype]`
  rules. Directories render a closed **and** an open variant; CSS swaps them on the selected row
  (`li.sel`). No icon runtime, no client JS, no Nerd Font / private-use codepoints. Specialized
  folders per directory name live in `FOLDER_ICONS`; changing an icon shape fails the build.
- **Accessibility:** `aria-label`/`aria-current` on panes and entries, visible focus states
  (`.entry:focus-visible`), `prefers-reduced-motion`, native `<dialog>`.
- **Effects separated:** gradient, glass, and glow live only in `src/styles/fx.css` and use
  flavor variables exclusively. Never make layout depend on `fx.css`.
- **Images:** always via `astro:assets` (`image()` in the schema, `<Image>`/`figureFor()`), never
  from `public/`. The current SVGs are placeholders.
- **Legal:** `legal/*` are templates with `TODO` markers and `noindex`; the footer links in
  `TUIShell.astro` must stay on every page.
- **Diagrams:** ```` ```mermaid ```` blocks are turned into inline SVG at build time
  (`src/lib/mermaid.ts`, Sätteri plugin in `astro.config.mjs`) — no mermaid.js in the browser.
  Only flowchart, sequence, class, ER, state, and XY charts; anything else fails the build.
  After plugin changes run `npx astro build --force` (the content cache does not notice them).
- **No `.md` in `src/pages/`** (no `CLAUDE.md` either) — Astro would build a route from it.
- **New page = tree + list + preview:** page in `pages/`, entry in `tree.ts`/collection if
  needed, always with a preview template — otherwise the right pane stays empty.

## History (summary)

- 2026-10-10: Astro skeleton + first visual draft.
- 2026-10-11: Full build-out — TUI shell, collections, keynav, deep links, mobile single-pane,
  sample data (Max Mustermann, English content), 404 `zsh: no such file or directory`.
- 2026-10-11: Redesign — three columns in fullscreen (parent/current/preview), flavor "sweet"
  (Garuda Dr460nized), status line with segments, folder preview as file list, `J/K`.
- 2026-10-11: Fully Dr460nized (`fx.css`), images (`~/pictures/` + covers), `now.md`,
  `~/legal/` (imprint, privacy) with footer links.
- 2026-10-11: Mermaid diagrams as build-time SVG in flavor colors.
- 2026-10-11: SVG file-type/folder icons (material-icon-theme data, flavor-recolored, open state
  on selection).
- 2026-10-11: SEO & feeds — `site` from `site.config.ts` (`url`), canonical + OG/Twitter tags,
  `@astrojs/sitemap` (without `/legal/`), RSS at `/blog/feed.xml`, `public/og.png` (1200×630),
  `OFL.txt` next to the fonts, README screenshots regenerated via headless Chrome.
- 2026-10-11: Arrow keys (←/→, Home/End), home page `welcome.txt` with ASCII Astro logo in
  fetch style, sample folder `~/diagrams/`, `src/site.config.ts`.