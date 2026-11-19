import RevealMain from "@/components/RevealMain";
import Hero from "@/components/home/Hero";
import IntroSection from "@/components/home/IntroSection";
import HorizontalProjects from "@/components/home/HorizontalProjects";
import ExpertiseList from "@/components/home/ExpertiseList";
import Marquee from "@/components/home/Marquee";
import ProcessSteps from "@/components/home/ProcessSteps";
import BlogPreview from "@/components/home/BlogPreview";
import { getHeroSlides, getFeaturedProjects, getServices, getMethodSteps, getHomeBlogPreview } from "@/lib/queries";
import { getSiteContent, contentList } from "@/lib/siteContent";

export default async function AccueilPage() {
  const [heroSlides, projects, services, steps, posts, content] = await Promise.all([
    getHeroSlides(),
    getFeaturedProjects(),
    getServices(),
    getMethodSteps(),
    getHomeBlogPreview(),
    getSiteContent(),
  ]);

  return (
    <RevealMain id="p-accueil" dataT="Accueil" dataDark>
      <Hero
        slides={heroSlides}
        eyebrow={content.hero_eyebrow}
        titleLine1={content.hero_title_line1}
        titleLine2={content.hero_title_line2}
        intro={content.hero_intro}
      />
      <IntroSection
        label={content.intro_label}
        text={content.intro_text}
        image1={content.intro_image_1}
        image2={content.intro_image_2}
      />
      <HorizontalProjects projects={projects} />
      <ExpertiseList services={services} />
      <Marquee items={contentList(content.marquee_items)} />
      <ProcessSteps steps={steps} />
      <BlogPreview posts={posts} />
    </RevealMain>
  );
}
