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

- [ ] Flavor endgültig (tokyo-night vs. catppuccin vs. eigene Palette) + Fonts selbst hosten?
- [ ] Sektionen/Ordner final: Projekte, CV, Blog, Kontakt — etwas fehlt?
- [ ] Mobile: Touch-Gesten? Kollaps auf Single-Pane? Emulation auf Desktop only?
- [ ] Deployment-Ziel & Domain (parallel zur bestehenden Hauptwebsite? Cloudflare Pages?)
- [ ] Inhaltssprache (de/en/mixed)?
- [ ] Nur Dark oder Dark/Light-Toggle? (TUI-typisch wäre Dark-only)

## Historie

- 2026-10-10: Astro-Skeleton + erster optischer Draft (`index.astro`) angelegt, Repo initialisiert.