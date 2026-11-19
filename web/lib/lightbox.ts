// Registered by the Lightbox component (mounted once, shared across pages).
let handler: ((slug: string) => void) | null = null;
// Set by the portfolio page to scope prev/next navigation to the filtered,
// currently-visible subset. Null means "all projects" (home page behavior).
let scope: string[] | null = null;

export function setLightboxHandler(fn: ((slug: string) => void) | null) {
  handler = fn;
}

export function openLightbox(slug: string) {
  handler?.(slug);
}

export function setLightboxScope(slugs: string[] | null) {
  scope = slugs;
}

export function getLightboxScope(): string[] | null {
  return scope;
}
