// Registered by the Lightbox component (mounted once, shared across pages).
let handler: ((index: number) => void) | null = null;
// Set by the portfolio page to scope prev/next navigation to the filtered,
// currently-visible subset. Null means "all projects" (home page behavior).
let scope: number[] | null = null;

export function setLightboxHandler(fn: ((index: number) => void) | null) {
  handler = fn;
}

export function openLightbox(index: number) {
  handler?.(index);
}

export function setLightboxScope(indices: number[] | null) {
  scope = indices;
}

export function getLightboxScope(): number[] | null {
  return scope;
}
