# src/styles

Global stylesheets. This is where the Tailwind entry point, the color palette ("flavor") and the
TUI layout live.

## Files

- `global.css` – `@import "tailwindcss"`, the `@font-face` declarations for the self-hosted
  JetBrains Mono (`public/fonts/`), the flavor variables in `:root` and the `@theme` block that
  exposes them as Tailwind tokens (incl. `--green/--yellow/--red` for status colors).
- `tui.css` – the shell: fullscreen grid (`.tui`, `100dvh`), header, segment pills (`.seg-*`),
  the three panes (`.panes`, `.pane`, `.pane-title`, scrolling `.pane-body`), status line,
  breakpoints (no parent column below 64rem, single pane below 48rem).
- `list.css` – list rows (`.entry`) for the parent and file lists, folder preview (`.pv-ls`),
  selection/hover/focus states.
- `doc.css` – preview building blocks (`.pv-*`), documents (`.doc`, `.doc-prompt`), skill bars,
  images. Close to the 300-line limit — put additions in a new file.
- `dialog.css` – shortcut overlay.
- `fetch.css` – the home page spec sheet (`.fetch`, ASCII logo with gradient, color bar).
- `mermaid.css` – `.mermaid`: frame, scaling, and the mapping of the diagram variables
  (`--line/--muted/--surface/--border`) onto the flavor.
- `fx.css` – the Dr460nized look: neon clouds (`body::before`), glass (`--glass` +
  `backdrop-filter`), neon ring on the active pane, selection gradient, glow. Imported last.

All seven are imported by `layouts/TUIShell.astro`.

## Patterns

- Two levels: `:root` holds the raw flavor values (`--bg`, `--dir`, …), `@theme inline` maps
  them onto `--color-*`. This yields the utilities `bg-bg`, `text-dir`, `border-border` etc.
- New color = one variable in `:root` **and** one `--color-*` entry in `@theme`.
- A flavor swap only replaces the `:root` block; `@theme`, the other stylesheets and the
  components stay unchanged.
- `--font-mono` is the single font definition; use it in CSS via `var(--font-mono)` and in
  classes via `font-mono`.

## Pitfalls

- Tailwind v4 is configured in CSS — there is no `tailwind.config.js` and none should be added.
- `@theme inline` is necessary because the tokens reference other variables; without `inline`
  the utilities resolve the value in the wrong place.
- Preflight resets the spacing of `p`, `h*`, `ul` and the link underline. The stylesheets here
  are unlayered and therefore beat Tailwind's layers — on purpose.
- Biome only parses `@theme`/`@apply` because `css.parser.tailwindDirectives` is enabled in
  `biome.json`.
- The grid columns of the list are `[icon 2ch] [name 1fr] [size auto]`; on file pages
  (`.tui[data-kind="file"]`) the size is dropped. Date and note live in the status line.
- `.pane` must not get an `overflow` — the `.pane-title` sits on the frame and would be cut off.
  Only `.pane-body` scrolls.
- The current flavor is "sweet" (Garuda Dr460nized). `--magenta` is background/gradient only; as
  a text color it lacks contrast — use `--accent` instead.
- `.tui` needs `grid-template-columns: minmax(0, 1fr)` — without it the `nowrap` status line
  stretches the layout beyond the viewport.
- `fx.css`: do not lower `--glass` below ~70% opacity (contrast of `--dim`); fallbacks for a
  missing `backdrop-filter` and `prefers-reduced-transparency` are at the end of the file.