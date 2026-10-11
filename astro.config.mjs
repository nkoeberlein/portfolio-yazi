import { satteri } from "@astrojs/markdown-satteri";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { mermaidGuard, mermaidPlugin } from "./src/lib/mermaid.ts";
import { SITE } from "./src/site.config.ts";

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  integrations: [
    mermaidGuard(),
    // Legal pages carry noindex — keep them out of the sitemap as well.
    sitemap({ filter: (page) => !page.includes("/legal/") }),
  ],
  markdown: {
    // Do not syntax-highlight mermaid: the code block is replaced with an SVG by the plugin.
    syntaxHighlight: { type: "shiki", excludeLangs: ["mermaid", "math"] },
    processor: satteri({ hastPlugins: [mermaidPlugin()] }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
