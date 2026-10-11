# src/components

Die Panes der TUI und das Shortcut-Overlay. Reine Astro-Komponenten ohne Client-Framework.

## Dateien

- `ParentPane.astro` — linke Pane (`#parent`): übergeordnetes Verzeichnis als Linkliste, der
  aktuelle Ordner trägt `.sel` + `aria-current="true"`. Props: `entries` (`ParentEntry[]` aus
  `lib/panes.ts`), `label` (Pfad im Rahmentitel).
- `FileList.astro` — mittlere Pane (`#filepanel` / `#filelist`): exportiert den Typ `EntryVM`.
  Jede Zeile ist ein echter `<a>`, optional mit `<template>` für die Preview.
- `PreviewPane.astro` — rechte Pane (`#preview` / `#preview-body`): Inhalt per `html`-Prop
  (Tree-Seiten) oder Slot (File-Seiten).
- `ShortcutOverlay.astro` — natives `<dialog id="shortcuts">`.
- `Prompt.astro` — `user@host ~ $ <cmd>` über geöffneten Dokumenten (Handle aus `site.config.ts`).

## Muster

- Aufbau jeder Pane: `.pane` > `.pane-title` + genau ein `.pane-body` (der Scroller).
- `keynav.ts` hängt an festen IDs: `#filelist li[data-name]`, `#preview-body`,
  `#preview-title`, `#shortcuts`. Die Parent-Liste hat bewusst eine eigene ID.
- `data-size`, `data-date`, `data-note` am `<li>` speisen die Statuszeile – beim Ändern von
  `EntryVM` mitziehen.

## Stolpersteine

- Texte der Keyhints stehen in `layouts/TUIShell.astro`, die vollständige Liste in
  `ShortcutOverlay.astro` – bei neuen Tasten beide und den Kopfkommentar von `keynav.ts` pflegen.

- `<template>`-Inhalte sind inert: Bilder darin laden erst, wenn keynav sie in die Preview klont.

- Kein `tabindex` auf die Panes setzen (Biome `noNoninteractiveTabindex`); gescrollt wird per
  `J/K` bzw. über den Browser-Fokus scrollbarer Bereiche.
- Preview-HTML kommt escaped aus `lib/preview.ts` und wird per `set:html` gerendert – keine
  rohen Nutzerdaten durchreichen.
