// Registered by the Lightbox component (built in the portfolio step).
// Until then, clicking a project card is a harmless no-op.
let handler: ((index: number) => void) | null = null;

export function setLightboxHandler(fn: ((index: number) => void) | null) {
  handler = fn;
}

export function openLightbox(index: number) {
  handler?.(index);
}
