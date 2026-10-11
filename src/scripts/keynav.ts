/**
 * Keyboard navigation — layered directly on top of native links (progressive
 * enhancement). Without JS, the site remains fully navigable.
 *
 *   ↑/↓, j/k  Move selection (preview + status bar update)
 *   J/K       Scroll preview pane (also PageDown/PageUp/Space)
 *   g / G     First / last entry (also Home/End)
 *   →, ⏎, l   Open selection (real navigation)
 *   ←, h      Go to parent directory
 *   q         Back to ~
 *   ?         Shortcut overlay
 */
type Kind = "tree" | "file";

interface Ctx {
  kind: Kind;
  parent: string;
  home: string;
  items: HTMLLIElement[];
  current: number;
  /** Server-rendered preview — on file pages this holds the opened document,
   * which is restored when returning to its own entry. */
  original: { title: string; nodes: Node[] };
}

/** Line height × 5 — scroll delta per J/K like Yazi. */
const SEEK_PX = 120;

function boot(): void {
  const shell = document.querySelector<HTMLElement>("[data-kind]");
  if (!shell) return;

  const items = Array.from(document.querySelectorAll<HTMLLIElement>("#filelist li[data-name]"));
  const previewBody = document.getElementById("preview-body");
  const previewTitle = document.getElementById("preview-title");
  if (items.length === 0 || !previewBody || !previewTitle) return;

  const ctx: Ctx = {
    kind: shell.dataset.kind === "file" ? "file" : "tree",
    parent: shell.dataset.parent ?? "",
    home: shell.dataset.home ?? "/",
    items,
    current: Math.max(
      0,
      items.findIndex((item) => item.classList.contains("sel")),
    ),
    original: {
      title: previewTitle.textContent ?? "",
      nodes: Array.from(previewBody.childNodes),
    },
  };

  // Fragment (#sel=name) overrides server-side preselection — enables deep-linking.
  const hashName = parseHashSelection(window.location.hash);
  const hashIndex = items.findIndex((item) => item.dataset.name === hashName);
  if (hashName && hashIndex >= 0) select(ctx, hashIndex, false);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("keydown", (event) => {
    if (event.isComposing || event.ctrlKey || event.metaKey || event.altKey) return;

    const dialog = document.getElementById("shortcuts");
    if (dialog instanceof HTMLDialogElement && dialog.open) {
      if (event.key === "?") {
        event.preventDefault();
        dialog.close();
      }
      return; // Escape closes the dialog natively.
    }

    switch (event.key) {
      case "j":
      case "ArrowDown": {
        event.preventDefault();
        move(ctx, +1, reducedMotion);
        break;
      }
      case "k":
      case "ArrowUp": {
        event.preventDefault();
        move(ctx, -1, reducedMotion);
        break;
      }
      case "J":
      case "K": {
        event.preventDefault();
        const delta = event.key === "J" ? SEEK_PX : -SEEK_PX;
        if (!scrollPreview(delta, reducedMotion)) window.scrollBy({ top: delta });
        break;
      }
      case " ":
      case "PageDown":
      case "PageUp": {
        // Only intercept if the pane scrolls itself — otherwise let the window scroll (mobile).
        const page = previewBody.clientHeight * (event.key === "PageUp" ? -0.9 : 0.9);
        if (event.shiftKey || !scrollPreview(page, reducedMotion)) return;
        event.preventDefault();
        break;
      }
      case "Home":
      case "g": {
        if (isModified(event)) return;
        select(ctx, 0, true, reducedMotion);
        break;
      }
      case "End":
      case "G": {
        if (isModified(event)) return;
        select(ctx, ctx.items.length - 1, true, reducedMotion);
        break;
      }
      case "ArrowRight":
      case "Enter":
      case "l": {
        if (isModified(event)) return;
        // Enter / activation on a focused link or button outside the list belongs to the browser.
        if (isForeignControl(event.target)) return;
        openCurrent(ctx);
        break;
      }
      case "ArrowLeft":
      case "h": {
        if (isModified(event) || !ctx.parent) return;
        window.location.href = ctx.parent;
        break;
      }
      case "q": {
        if (isModified(event) || window.location.pathname === ctx.home) return;
        window.location.href = ctx.home;
        break;
      }
      case "?": {
        if (!(dialog instanceof HTMLDialogElement)) return;
        event.preventDefault();
        dialog.showModal();
        break;
      }
      default:
        return;
    }
  });

  // Close button & backdrop click inside the overlay dialog
  const shortcutsDialog = document.getElementById("shortcuts");
  if (shortcutsDialog instanceof HTMLDialogElement) {
    shortcutsDialog
      .querySelector<HTMLButtonElement>("[data-close]")
      ?.addEventListener("click", () => {
        shortcutsDialog.close();
      });
    shortcutsDialog.addEventListener("click", (event) => {
      if (event.target === shortcutsDialog) shortcutsDialog.close();
    });
  }
}

/**
 * Extracts entry name from a URL fragment (`#sel=<name>`).
 * Ignores other fragments and catches malformed percent-encoding.
 */
export function parseHashSelection(rawHash: string): string {
  if (!/^#sel=/.test(rawHash)) return "";
  try {
    return decodeURIComponent(rawHash.slice("#sel=".length));
  } catch {
    return "";
  }
}

function isForeignControl(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return target.closest("a, button") !== null && target.closest("#filelist") === null;
}

function isModified(event: KeyboardEvent): boolean {
  return event.shiftKey && event.key !== "G";
}

function move(ctx: Ctx, delta: number, reducedMotion: boolean): void {
  select(
    ctx,
    Math.min(ctx.items.length - 1, Math.max(0, ctx.current + delta)),
    true,
    reducedMotion,
  );
}

function select(ctx: Ctx, next: number, scroll: boolean, reducedMotion = true): void {
  if (next === ctx.current) return;
  const current = ctx.items[ctx.current];
  const target = ctx.items[next];
  const currentLink = current.querySelector<HTMLAnchorElement>("a.entry");
  const targetLink = target?.querySelector<HTMLAnchorElement>("a.entry");
  if (!currentLink || !targetLink || !target) return;

  current.classList.remove("sel");
  currentLink.removeAttribute("aria-current");

  target.classList.add("sel");
  targetLink.setAttribute("aria-current", "page");
  ctx.current = next;

  // Clone preview from the entry's <template> (no network request).
  // Without a template, this is the opened file: restore original document.
  const tpl = target.querySelector<HTMLTemplateElement>("template");
  if (tpl) {
    previewSwap(tpl.dataset.title ?? "", [tpl.content.cloneNode(true)]);
  } else {
    previewSwap(ctx.original.title, ctx.original.nodes);
  }
  syncStatus(target, next, ctx.items.length);
  if (scroll) {
    targetLink.scrollIntoView({ block: "nearest", behavior: reducedMotion ? "auto" : "smooth" });
  }

  // Keep fragment in sync without creating a history entry — refresh stays deep-linked.
  const hash = `#sel=${encodeURIComponent(target.dataset.name ?? "")}`;
  window.history.replaceState(null, "", hash);
}

function previewSwap(title: string, nodes: Node[]): void {
  const previewBody = document.getElementById("preview-body");
  const previewTitle = document.getElementById("preview-title");
  if (!previewBody || !previewTitle) return;
  previewTitle.textContent = title.endsWith(" ") ? title : `${title} `;
  previewBody.replaceChildren(...nodes);
  previewBody.scrollTop = 0;
}

/** Update status line for the highlighted entry (data attributes from FileList). */
function syncStatus(item: HTMLLIElement, index: number, total: number): void {
  const values: Record<string, string> = {
    "st-name": item.dataset.name ?? "",
    "st-note": item.dataset.note ?? "",
    "st-size": item.dataset.size ?? "",
    "st-date": item.dataset.date ?? "",
    "st-perms": item.classList.contains("dir") ? "drwxr-xr-x" : "-rw-r--r--",
    "st-pos": `${index + 1}/${total}`,
  };
  for (const [id, text] of Object.entries(values)) {
    const node = document.getElementById(id);
    if (node) node.textContent = text;
  }
}

/** Scroll the preview pane; returns `false` if the pane cannot scroll itself (single-pane view). */
function scrollPreview(delta: number, reducedMotion: boolean): boolean {
  const body = document.getElementById("preview-body");
  if (!body || body.scrollHeight <= body.clientHeight) return false;
  body.scrollBy({ top: delta, behavior: reducedMotion ? "auto" : "smooth" });
  return true;
}

function openCurrent(ctx: Ctx): void {
  const link = ctx.items[ctx.current]?.querySelector<HTMLAnchorElement>("a.entry");
  const href = link?.getAttribute("href");
  if (!href) return;
  if (href === window.location.pathname) return; // Already on opened file: no-op
  window.location.href = href;
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
}
