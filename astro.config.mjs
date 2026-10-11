import { satteri } from "@astrojs/markdown-satteri";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { mermaidGuard, mermaidPlugin } from "./src/lib/mermaid.ts";

// https://astro.build/config
export default defineConfig({
  integrations: [mermaidGuard()],
  markdown: {
    // mermaid nicht einfärben: der Block wird vom Plugin durch ein SVG ersetzt.
    syntaxHighlight: { type: "shiki", excludeLangs: ["mermaid", "math"] },
    processor: satteri({ hastPlugins: [mermaidPlugin()] }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
