# src/assets

Bilder, die über `astro:assets` laufen (Optimierung, Hash im Dateinamen, feste Maße gegen
Layout-Sprünge). Statisches ohne Verarbeitung (Fonts, Favicon) liegt in `public/`.

## Ordner

- `pictures/` — Bilder für `~/pictures/`; je Datei ein Eintrag in `src/content/pictures/`.
- `covers/` — Titelbilder für Projekte und Posts (`cover:` im Frontmatter).

## Muster

- Die aktuellen SVGs sind generierte Platzhalter in den Flavor-Farben. Echte Bilder als JPG/PNG
  ablegen und im Frontmatter verlinken – Astro erzeugt daraus WebP in den nötigen Breiten.
- Cover im Querformat (ca. 5:2); sie werden auf 16rem Höhe beschnitten (`.doc-cover`).
- Empfohlen: Bilder ≤ 2400 px Kantenlänge, Alt-Text immer im Frontmatter pflegen.

## Stolpersteine

- SVGs werden nicht umgerechnet, sondern unverändert ausgeliefert.
- Hex-Farben sind hier erlaubt (Bilddateien), in Komponenten und CSS weiterhin nicht.
