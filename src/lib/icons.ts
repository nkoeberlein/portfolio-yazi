/** Unicode-Glyphen für den Dateibaum — kein Icon-Paket. Nur Zeichen, die das selbst
 * gehostete JetBrains Mono enthält (kein Nerd Font, keine Private-Use-Codepoints). */

export function iconFor(entryName: string): string {
  switch (true) {
    case entryName.endsWith("/"):
      return "▸";
    case /\.(svg|png|jpe?g|webp|avif|gif)$/.test(entryName):
      return "▣";
    case entryName.endsWith(".mmd"):
      return "◇";
    case entryName.endsWith(".txt"):
    case entryName.endsWith(".md"):
      return "≡";
    default:
      return "·";
  }
}

/** Box-Drawing-Bausteine für Panes und Statuszeilen. */
export const box = {
  vertical: "│",
  horizontal: "─",
  topLeft: "┌",
  topRight: "┐",
  bottomLeft: "└",
  bottomRight: "┘",
  cross: "┼",
} as const;
