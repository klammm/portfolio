import { ExternalLink, FileText, GitFork, Mail } from 'lucide-react';
import styled from 'styled-components';
import { profile } from '../../data/profile';
import { Button } from '../shared/Button';
import { Reveal } from '../shared/Reveal';
import { Eyebrow, Heading2 } from '../shared/SectionHeading';

const Section = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 5.5rem 6vw;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgElevated};

  @media (max-width: 760px) {
    align-items: flex-start;
    flex-direction: column;
    padding: 4rem 1rem;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

export function ContactSection() {
  return (
    <Section id="contact" aria-labelledby="contact-title">
      <Reveal>
        <div>
          <Eyebrow $variant="orange">Contact</Eyebrow>
          <Heading2 id="contact-title">Say hi.</Heading2>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <Actions>
          <Button as="a" href={`mailto:${profile.email}`} $variant="primary">
            <Mail size={17} /> Email
          </Button>
          <Button as="a" href={profile.linkedin} $variant="secondary" target="_blank" rel="noreferrer">
            <ExternalLink size={17} /> LinkedIn
          </Button>
          <Button as="a" href={profile.github} $variant="secondary" target="_blank" rel="noreferrer">
            <GitFork size={17} /> GitHub
          </Button>
          <Button as="a" href={profile.resumeUrl} $variant="secondary" download>
            <FileText size={17} /> Resume
          </Button>
        </Actions>
      </Reveal>
    </Section>
  );
}
