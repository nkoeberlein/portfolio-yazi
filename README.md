# Portfolio im Yazi-Stil

Portfolio-Website, die aussieht und sich anfühlt wie der Terminal-Dateimanager [Yazi](https://github.com/sxyazi/yazi) — gebaut mit [Astro](https://astro.build).

## Konzept

- **Dateimanager-Metapher:** Portfolio als Verzeichnisbaum — Sektionen sind "Ordner", Inhalte "Dateien"
- **Yazi-Ästhetik:** Monospace-Font, Flavor-Farbschema, Breadcrumb-Statuszeile, Doppel-Pane (Einträge links, Preview rechts), Keyhint-Bar unten
- **Keyboard-First:** j/k-Navigation, Enter öffnen, ? für Shortcuts — wie in der TUI
- **Astro statisch:** schnelle SSG-Seiten; Interaktion als kleines Vanilla-JS, HTML bleibt zugänglich (SEO-/no-JS-Fallback)

## Quickstart

```bash
npm install
npm run dev    # http://localhost:4321
npm run build  # statischer Output in dist/
```

## Status

🟡 Skeleton angelegt am 2026-10-10: Astro-Scaffold + erster statischer Draft der TUI-Optik (`src/pages/index.astro`, Flavor "tokyo-night" als Startpunkt). Interaktion & Content-Struktur offen.

## Nächste Schritte

- [ ] Flavor-Wahl (tokyo-night, catppuccin, eigenes?) + Font final (JetBrains Mono)
- [ ] Content-Struktur: Sektionen als "Ordner" festlegen (Projekte, CV, Blog, Kontakt)
- [ ] Tastatur-Navigation + Selection-State (Vanilla JS, deep-linkable URLs)
- [ ] Routes als Verzeichnisse abbilden (`projekte/`, `blog/`) via Astro Content Collections
- [ ] Mobile-Fallback (Touch ohne Tastatur, Single-Pane)
- [ ] Deployment-Ziel klären (Cloudflare Pages? eigener Server? parallel zur bestehenden Hauptwebsite?)

## Dokumentation

- [`docs/PROJEKTBRIEF.md`](docs/PROJEKTBRIEF.md) — Konzept & Roadmap im Detail