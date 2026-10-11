# src/assets

Images that go through `astro:assets` (optimization, hash in the file name, fixed dimensions
against layout shifts). Static assets without processing (fonts, favicon) live in `public/`.

## Folders

- `pictures/` — images for `~/pictures/`; one entry per file in `src/content/pictures/`.
- `covers/` — title images for projects and posts (`cover:` in the frontmatter).

## Patterns

- The current SVGs are generated placeholders in the flavor colors. Put real images as JPG/PNG
  here and link them in the frontmatter — Astro generates WebP at the required widths.
- Covers in landscape (approx. 5:2); they are cropped to 16rem height (`.doc-cover`).
- Recommended: images ≤ 2400 px on the longest edge; always maintain alt text in the frontmatter.

## Pitfalls

- SVGs are not transformed but served as-is.
- Hex colors are allowed here (image files); in components and CSS they still are not.