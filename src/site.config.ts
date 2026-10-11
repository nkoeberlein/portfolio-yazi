/**
 * Zentrale Angaben zur Person hinter der Site. Wer das Theme übernimmt,
 * beginnt hier — aktuell Musterdaten (Max Mustermann).
 */
export const SITE = {
  /** Erscheint als `user@host` im Steckbrief der Startseite */
  user: "max",
  host: "mustermann",
  name: "Max Mustermann",
  role: "Senior Software Engineer",
  location: "Berlin, Germany",
  stack: ["Go", "TypeScript", "Rust"],
  /** Freitext für die Zeile `uptime` */
  uptime: "10 years in software",
  flavor: "sweet (Dr460nized)",
} as const;

/** `user@host`: Breadcrumb, Seitentitel und Shell-Prompt. */
export const HANDLE = `${SITE.user}@${SITE.host}`;
