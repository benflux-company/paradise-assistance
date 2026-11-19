import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  lenisInstance = l;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function scrollToTop(duration?: number) {
  if (lenisInstance) {
    if (duration) lenisInstance.scrollTo(0, { duration });
    else lenisInstance.scrollTo(0, { immediate: true });
  } else if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: duration ? "smooth" : "auto" });
  }
}

export function isReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isTouchViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 900;
}

export function isFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches && window.innerWidth > 900;
}
