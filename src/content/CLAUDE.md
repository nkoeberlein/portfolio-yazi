# src/content

The contents of the content collections (schema: `src/content.config.ts`). Currently
**sample data** (Max Mustermann) — replace before go-live.

## Folders

- `projects/` — one markdown per project. Required: `title`, `summary`, `period`, `role`,
  `updated`; optional: `stack`, `repo`, `demo`, `featured`, `cover` + `coverAlt`.
- `blog/` — posts: `title`, `summary`, `published`, `tags`; optional: `cover` + `coverAlt`.
- `pictures/` — one markdown per image: `title`, `alt`, `caption`, `taken`, `image`. The body is
  the description below the image.
- `diagrams/` — mermaid examples as real `.mmd` files. The first lines are required:
  `%% title: …`, `%% summary: …`, `%% updated: YYYY-MM-DD`, then the diagram source.
- `legal/` — `imprint.md`, `privacy.md`: `title`, `summary`, `updated`.

## Patterns

- The file name is the ID and therefore the route and list name (`loadsmith.md` → `/projects/loadsmith/`).
- Image paths (`cover`, `image`) are relative to the markdown file into `src/assets/…`, e.g.
  `../../assets/covers/loadsmith.svg`. The schema verifies that the file exists.
- Content language is English.
- Diagrams as a code block with language `mermaid`, optionally with a description for screen
  readers: ```` ```mermaid alt="Replay pipeline" ````. Supported: `graph`/`flowchart`,
  `sequenceDiagram`, `classDiagram`, `erDiagram`, `stateDiagram-v2`, `xychart-beta`.
  Examples: `projects/loadsmith.md`, `blog/taming-the-tail.md`.

## Pitfalls

- No `gantt`, `pie`, `mindmap`, `gitGraph` — the build fails with a message.
- Wide flowcharts (`LR` with many nodes) are scaled down in the pane; from about seven nodes
  prefer `TD` or split them.

- The dev server does not pick up new or changed `.mmd` files on its own (inline loader without
  a watcher) — restart the dev server or run `npx astro build --force`.
- This file is not ingested: the loaders only scan the subfolders.
- Line breaks in addresses need a `\` at the end of the line, otherwise everything flows into
  one line.
- `legal/*` are templates, not legal advice. Resolve the `TODO` markers before publishing;
  `privacy.md` must match the actual hosting.