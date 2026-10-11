/**
 * Central site configuration and persona details.
 * Anyone adopting this theme starts here (contains sample data for Max Mustermann).
 */
export const SITE = {
  /** Canonical base URL of the deployed site — feeds sitemap, canonical links, OG tags, RSS */
  url: "https://mustermann.example",
  /** Appears as `user@host` in the homepage bio and prompt */
  user: "max",
  host: "mustermann",
  name: "Max Mustermann",
  role: "Senior Software Engineer",
  location: "Berlin, Germany",
  email: "max@mustermann.example",
  github: "https://github.com/mustermann",
  linkedin: "https://linkedin.com/in/mustermann",
  matrix: "@maxm:matrix.example",
  stack: ["Go", "TypeScript", "Rust"],
  /** Freeform text for the `uptime` bio field */
  uptime: "10 years in software",
  flavor: "sweet (Dr460nized)",
  /** Optional privacy-friendly analytics via Simple Analytics (false = 0 external requests). */
  simpleAnalytics: false,
} as const;

/** `user@host`: Breadcrumb root, page title suffix, and shell prompt. */
export const HANDLE = `${SITE.user}@${SITE.host}`;
