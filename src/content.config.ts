import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { readDiagrams } from "./lib/diagram-files.ts";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      period: z.string(),
      role: z.string(),
      stack: z.array(z.string()).default([]),
      repo: z.url().optional(),
      demo: z.url().optional(),
      updated: z.coerce.date(),
      featured: z.boolean().default(false),
      /** Optional cover image, path relative to the markdown file (`src/assets/covers/`) */
      cover: image().optional(),
      coverAlt: z.string().default(""),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      published: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().default(""),
    }),
});

/** Pictures in ~/pictures/: one markdown file per image, body = description. */
const pictures = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pictures" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      alt: z.string(),
      caption: z.string(),
      taken: z.coerce.date(),
      image: image(),
    }),
});

const legal = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/legal" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    updated: z.coerce.date(),
  }),
});

/** Mermaid examples in ~/diagrams/: raw `.mmd` files parsed via custom loader. */
const diagrams = defineCollection({
  loader: () => readDiagrams("./src/content/diagrams"),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    updated: z.coerce.date(),
    code: z.string(),
  }),
});

export const collections = { projects, blog, pictures, legal, diagrams };
