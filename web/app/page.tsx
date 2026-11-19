"use client";

import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";
import Hero from "@/components/home/Hero";
import IntroSection from "@/components/home/IntroSection";
import HorizontalProjects from "@/components/home/HorizontalProjects";
import ExpertiseList from "@/components/home/ExpertiseList";
import Marquee from "@/components/home/Marquee";
import ProcessSteps from "@/components/home/ProcessSteps";
import BlogPreview from "@/components/home/BlogPreview";

export default function AccueilPage() {
  const mainRef = useRef<HTMLElement>(null);
  useReveal(mainRef);

  return (
    <main id="p-accueil" className="pg on" data-t="Accueil" data-dark="1" ref={mainRef}>
      <Hero />
      <IntroSection />
      <HorizontalProjects />
      <ExpertiseList />
      <Marquee />
      <ProcessSteps />
      <BlogPreview />
    </main>
  );
}
