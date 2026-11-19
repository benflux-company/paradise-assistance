"use client";

import { useEffect, type RefObject } from "react";
import { ensureGsap } from "@/lib/gsap";
import { isReducedMotion, isTouchViewport } from "@/lib/motion";
import { setupPageReveal } from "@/lib/animations";

export function useReveal(scopeRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || isReducedMotion()) return;
    ensureGsap();
    return setupPageReveal(scope, isTouchViewport());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
