/**
 * Brücke zwischen `astro:assets` und den Preview-Bausteinen: optimiert ein
 * Collection-Bild auf Preview-Breite und liefert das fertige <figure>-HTML.
 */
import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";
import { figure } from "./preview";

/** Breite der Preview-Variante in px (Pane ≈ 3/8 des Viewports, 2x-Displays). */
const PREVIEW_WIDTH = 960;

export async function figureFor(
  image: ImageMetadata,
  alt: string,
  caption?: string,
): Promise<string> {
  const optimized = await getImage({ src: image, width: Math.min(PREVIEW_WIDTH, image.width) });
  return figure({ src: optimized.src, width: image.width, height: image.height, alt, caption });
}

/** Wie `figureFor`, aber leer, wenn der Eintrag kein Bild hat (optionale Cover). */
export const coverFor = async (image: ImageMetadata | undefined, alt: string): Promise<string> =>
  image ? figureFor(image, alt) : "";
