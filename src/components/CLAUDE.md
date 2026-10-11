# src/components

The panes of the TUI and the shortcut overlay. Plain Astro components without a client framework.

## Files

- `ParentPane.astro` — left pane (`#parent`): parent directory as a link list; the current folder
  carries `.sel` + `aria-current="true"`. Props: `entries` (`ParentEntry[]` from
  `lib/panes.ts`), `label` (path in the frame title).
- `FileList.astro` — middle pane (`#filepanel` / `#filelist`): exports the `EntryVM` type.
  Every row is a real `<a>`, optionally with a `<template>` for the preview.
- `PreviewPane.astro` — right pane (`#preview` / `#preview-body`): content via `html` prop
  (tree pages) or slot (file pages).
- `ShortcutOverlay.astro` — native `<dialog id="shortcuts">`.
- `Prompt.astro` — `user@host ~ $ <cmd>` above opened documents (handle from `site.config.ts`).

## Patterns

- Structure of every pane: `.pane` > `.pane-title` + exactly one `.pane-body` (the scroller).
- `keynav.ts` hooks onto fixed IDs: `#filelist li[data-name]`, `#preview-body`,
  `#preview-title`, `#shortcuts`. The parent list deliberately has its own ID.
- `data-size`, `data-date`, `data-note` on the `<li>` feed the status line — when changing
  `EntryVM`, take them along.

## Pitfalls

- The key hint texts live in `layouts/TUIShell.astro`, the complete list in
  `ShortcutOverlay.astro` — when adding new keys, update both plus the header comment of
  `keynav.ts`.

- `<template>` contents are inert: images inside them only load once keynav clones them into
  the preview.

- Do not set `tabindex` on the panes (Biome `noNoninteractiveTabindex`); scrolling happens via
  `J/K` or through the browser making scrollable areas focusable.
- Preview HTML arrives escaped from `lib/preview.ts` and is rendered via `set:html` — never
  pass raw user data through.