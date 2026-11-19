import RevealMain from "@/components/RevealMain";
import Hero from "@/components/home/Hero";
import IntroSection from "@/components/home/IntroSection";
import HorizontalProjects from "@/components/home/HorizontalProjects";
import ExpertiseList from "@/components/home/ExpertiseList";
import Marquee from "@/components/home/Marquee";
import ProcessSteps from "@/components/home/ProcessSteps";
import BlogPreview from "@/components/home/BlogPreview";
import { getHeroSlides, getFeaturedProjects, getServices, getMethodSteps, getHomeBlogPreview } from "@/lib/queries";

export default async function AccueilPage() {
  const [heroSlides, projects, services, steps, posts] = await Promise.all([
    getHeroSlides(),
    getFeaturedProjects(),
    getServices(),
    getMethodSteps(),
    getHomeBlogPreview(),
  ]);

  return (
    <RevealMain id="p-accueil" dataT="Accueil" dataDark>
      <Hero slides={heroSlides} />
      <IntroSection />
      <HorizontalProjects projects={projects} />
      <ExpertiseList services={services} />
      <Marquee />
      <ProcessSteps steps={steps} />
      <BlogPreview posts={posts} />
    </RevealMain>
  );
}
