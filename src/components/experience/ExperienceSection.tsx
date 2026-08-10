import styled from 'styled-components';
import { experience } from '../../data/experience';
import { Reveal } from '../shared/Reveal';
import { SectionHeading } from '../shared/SectionHeading';
import { ExperienceRow } from './ExperienceRow';

const Section = styled.section`
  padding: 5.5rem 6vw;
  background: ${({ theme }) => theme.colors.bgElevated};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 760px) {
    padding: 4rem 1rem;
  }
`;

const Timeline = styled.div`
  display: grid;
  gap: 1rem;
`;

export function ExperienceSection() {
  return (
    <Section id="experience" aria-labelledby="experience-title">
      <Reveal>
        <SectionHeading
          eyebrow="Experience"
          title="Frontend work across automation, ecommerce, and internal tooling."
          id="experience-title"
        />
      </Reveal>
      <Timeline>
        {experience.map((item, i) => (
          <Reveal key={item.company} delay={(i + 1) * 0.1}>
            <ExperienceRow item={item} />
          </Reveal>
        ))}
      </Timeline>
    </Section>
  );
}
