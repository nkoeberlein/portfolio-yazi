# src

Source code of the Astro site. Overview: root `CLAUDE.md`.

## Structure

- `layouts/TUIShell.astro` — central layout: header (breadcrumb), `<slot/>` for the three panes,
  footer (status line from the `status` prop + key hints), shortcut dialog, loads `keynav.ts`.
- `components/ParentPane.astro` — left pane; parent directory, plain links.
- `components/FileList.astro` — middle pane; EntryVMs → ch-aligned grid rows, each entry a real
  `<a>` plus an optional `<template>` with preview HTML.
- `components/PreviewPane.astro` — right pane; initial content via `html` prop or slot, keynav
  swaps it via `<template>`.
- `components/ShortcutOverlay.astro` — native `<dialog>` (key `?`).
- `site.config.ts` — personal details; first stop for theme users.
- `pages/` — `index.astro` (root), `projects/`, `blog/`, `pictures/`, `diagrams/`, `legal/`
  (folders + `[slug]` pages), `welcome/about/now/cv/skills/contact` (leaf pages), `404.astro`.
  No `CLAUDE.md` lives here on purpose: Astro would build the route `/CLAUDE/` from it.
- `lib/` — `tree.ts` (root tree), `panes.ts` (parent column + status line), `rootview.ts`
  (root VMs), `listing.ts` (collection VMs), `pictures.ts` + `images.ts` (images),
  `preview.ts` (escaped preview HTML building blocks), `format.ts` (size/date/esc), `icons.ts`.
- `scripts/keynav.ts` — vanilla keynav (progressive enhancement, no framework).
- `content.config.ts` + `content/` — collections `projects`, `blog`, `pictures`, `legal`,
  `diagrams`.
- `assets/` — images for `astro:assets` (`pictures/`, `covers/`).

## Patterns

- EntryVM: `{ name, kind: "dir" | "file", href, note, size, date, selected, previewTitle, previewHTML }`.
- Selected server-side via `aria-current="page"` + `.sel`; keynav respects the hash
  `#sel=<name>` (deep-linkable, overrides the server-side preselection).
- File pages list the same siblings with `opened=true` — the own file gets no template; keynav
  remembers the document and restores it when returning.
- Every page renders three slot children: `<ParentPane>` (`homeParent()` or `rootParent(href)`),
  `<FileList>`, `<PreviewPane>` and passes `status={statusOf(entries)}` to the shell.
- Don't copy anything at the `pages/` level: shell and panes come from the layout and components.
- New files that are not routes do NOT belong in `pages/` (`lib/`, `scripts/`).