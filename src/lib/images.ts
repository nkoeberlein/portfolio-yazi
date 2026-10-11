/**
 * Bridge between `astro:assets` and preview components: optimizes a
 * collection image for the preview pane and generates the final `<figure>` HTML.
 */
import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";
import { figure } from "./preview";

/** Width of the preview variant in px (preview pane ≈ 3/8 of viewport, retina 2x). */
const PREVIEW_WIDTH = 960;

export async function figureFor(
  image: ImageMetadata,
  alt: string,
  caption?: string,
): Promise<string> {
  const optimized = await getImage({ src: image, width: Math.min(PREVIEW_WIDTH, image.width) });
  return figure({ src: optimized.src, width: image.width, height: image.height, alt, caption });
}

/** Like `figureFor`, but returns an empty string if no image is provided (optional covers). */
export const coverFor = async (image: ImageMetadata | undefined, alt: string): Promise<string> =>
  image ? figureFor(image, alt) : "";
