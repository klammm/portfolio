import { ContactSection } from '../components/contact/ContactSection';
import { ExperienceSection } from '../components/experience/ExperienceSection';
import { Hero } from '../components/hero/Hero';
import { SkillsSection } from '../components/skills/SkillsSection';
import { WorkSection } from '../components/work/WorkSection';
import { useScrollToHash } from '../hooks/useScrollToHash';

export function HomePage() {
  useScrollToHash();

  return (
    <>
      <Hero />
      <WorkSection />
      <ExperienceSection />
      <SkillsSection />
      <ContactSection />
    </>
  );
}
