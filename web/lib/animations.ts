import { gsap, ScrollTrigger } from "@/lib/gsap";

// Immediate on-load reveal for .ph/.hero headers (data-split title lines
// and data-hi elements) — matches the original's heads(scope).
function runHeadReveal(scope: Element): () => void {
  const splitSpans = Array.from(scope.querySelectorAll<HTMLElement>("[data-split] .ln>span"));
  const hiEls = Array.from(scope.querySelectorAll<HTMLElement>("[data-hi]"));
  if (splitSpans.length) gsap.set(splitSpans, { yPercent: 110 });
  if (hiEls.length) gsap.set(hiEls, { opacity: 0, y: 30 });
  const headSplitSpans = splitSpans.filter((s) => s.closest(".ph,.hero"));
  const headTween = headSplitSpans.length
    ? gsap.to(headSplitSpans, { yPercent: 0, duration: 1.4, stagger: 0.1, ease: "expo.out", delay: 0.15 })
    : null;
  const hiTween = hiEls.length
    ? gsap.to(hiEls, { opacity: 1, y: 0, duration: 1.2, stagger: 0.1, ease: "expo.out", delay: 0.5 })
    : null;

  return () => {
    headTween?.kill();
    hiTween?.kill();
  };
}

// Scroll-triggered reveal for everything else (data-split titles outside
// .ph/.hero, data-up, .par, .phimg img, .bcard/.pitem, .sitem) — matches
// the original's scrollAnims(scope).
function runScrollReveal(scope: Element, touch: boolean): () => void {
  const triggers: ScrollTrigger[] = [];

  scope.querySelectorAll<HTMLElement>("[data-split]").forEach((h) => {
    if (h.closest(".ph,.hero")) return;
    const spans = h.querySelectorAll<HTMLElement>(".ln>span");
    const tw = gsap.fromTo(
      spans,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 1.4,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: h, start: "top 92%", once: true },
      }
    );
    if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
  });

  scope.querySelectorAll<HTMLElement>("[data-up]").forEach((el) => {
    const tw = gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 95%", once: true } }
    );
    if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
  });

  scope.querySelectorAll<HTMLElement>(".par").forEach((p) => {
    const im = p.querySelector<HTMLImageElement>("img");
    if (!im) return;
    const tw = gsap.fromTo(
      p,
      { clipPath: "inset(100% 0 0 0)" },
      { clipPath: "inset(0% 0 0 0)", duration: 1.5, ease: "expo.inOut", scrollTrigger: { trigger: p, start: "top 95%", once: true } }
    );
    if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
    if (!touch) {
      const tw2 = gsap.fromTo(
        im,
        { yPercent: -8 },
        { yPercent: 8, ease: "none", scrollTrigger: { trigger: p, start: "top bottom", end: "bottom top", scrub: true } }
      );
      if (tw2.scrollTrigger) triggers.push(tw2.scrollTrigger);
    }
  });

  if (!touch) {
    scope.querySelectorAll<HTMLImageElement>(".phimg img").forEach((im) => {
      const parent = im.parentElement;
      if (!parent) return;
      const tw = gsap.fromTo(
        im,
        { yPercent: -6, scale: 1.1 },
        { yPercent: 6, scale: 1, ease: "none", scrollTrigger: { trigger: parent, start: "top bottom", end: "bottom top", scrub: true } }
      );
      if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
    });
  }

  scope.querySelectorAll<HTMLElement>(".bcard,.pitem:not([hidden])").forEach((c, k) => {
    const tw = gsap.fromTo(
      c,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "expo.out",
        delay: (k % 3) * 0.08,
        scrollTrigger: { trigger: c, start: "top 96%", once: true },
      }
    );
    if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
  });

  scope.querySelectorAll<HTMLElement>(".sitem").forEach((c) => {
    const tw = gsap.fromTo(
      c,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: c, start: "top 96%", once: true } }
    );
    if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
  });

  return () => triggers.forEach((t) => t.kill());
}

// Used by each page's <main> scope — matches the original's
// `heads(sc); scrollAnims(sc);` pair run together on every page swap.
export function setupPageReveal(scope: Element, touch: boolean): () => void {
  const cleanupHead = runHeadReveal(scope);
  const cleanupScroll = runScrollReveal(scope, touch);
  return () => {
    cleanupHead();
    cleanupScroll();
  };
}

// The CTA and footer are rendered once by the Chrome layout (shared across
// routes), outside each page's own <main> scope, so they need their own
// setup re-run on every navigation. The original only ever calls
// scrollAnims() (not heads()) on these two — matches sharedAnims().
export function setupSharedAnims(touch: boolean): () => void {
  const cleanups: (() => void)[] = [];
  const cta = document.getElementById("cta");
  const ft = document.querySelector<HTMLElement>(".ft");

  if (!touch && cta) {
    const bg = cta.querySelector(".bg");
    if (bg) {
      const tw = gsap.fromTo(
        bg,
        { yPercent: -10 },
        { yPercent: 10, ease: "none", scrollTrigger: { trigger: cta, start: "top bottom", end: "bottom top", scrub: true } }
      );
      cleanups.push(() => tw.scrollTrigger?.kill());
    }
  }
  if (!touch && ft) {
    const huge = ft.querySelector("#huge");
    if (huge) {
      const tw = gsap.fromTo(
        huge,
        { xPercent: 12 },
        { xPercent: -6, ease: "none", scrollTrigger: { trigger: ft, start: "top bottom", end: "bottom bottom", scrub: true } }
      );
      cleanups.push(() => tw.scrollTrigger?.kill());
    }
  }
  if (cta) cleanups.push(runScrollReveal(cta, touch));
  if (ft) cleanups.push(runScrollReveal(ft, touch));

  return () => cleanups.forEach((fn) => fn());
}
