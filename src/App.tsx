import styled from 'styled-components';
import { ContactSection } from './components/contact/ContactSection';
import { ExperienceSection } from './components/experience/ExperienceSection';
import { Hero } from './components/hero/Hero';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { SkillsSection } from './components/skills/SkillsSection';
import { WorkSection } from './components/work/WorkSection';
import type { ThemeName } from './theme/theme';

const Shell = styled.div`
  min-height: 100vh;
`;

type AppProps = {
  theme: ThemeName;
  onToggleTheme: () => void;
};

export default function App({ theme, onToggleTheme }: AppProps) {
  return (
    <Shell>
      <Header theme={theme} onToggleTheme={onToggleTheme} />
      <main id="top">
        <Hero />
        <WorkSection />
        <ExperienceSection />
        <SkillsSection />
        <ContactSection />
      </main>
      <Footer />
    </Shell>
  );
}
