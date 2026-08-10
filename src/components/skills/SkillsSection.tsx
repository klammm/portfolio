import styled from 'styled-components';
import { skillGroups } from '../../data/skills';
import { Reveal } from '../shared/Reveal';
import { Eyebrow, Heading2 } from '../shared/SectionHeading';

const Section = styled.section`
  display: grid;
  grid-template-columns: minmax(18rem, 0.9fr) 1.1fr;
  gap: 3rem;
  align-items: center;
  padding: 5.5rem 6vw;
  background:
    linear-gradient(90deg, color-mix(in srgb, ${({ theme }) => theme.palette.bayTeal} 9%, transparent), transparent 54%),
    ${({ theme }) => theme.colors.bgMuted};

  @media (max-width: 1040px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 760px) {
    padding: 4rem 1rem;
  }
`;

const Intro = styled.div`
  max-width: 660px;

  p {
    max-width: 620px;
    margin-top: 1.1rem;
    font-size: 1.05rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Groups = styled.div`
  display: grid;
  gap: 1.4rem;
`;

const GroupLabel = styled.p`
  margin: 0 0 0.6rem;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const PillRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Pill = styled.span`
  min-height: 48px;
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  background: ${({ theme }) => theme.colors.bgElevated};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 760;
`;

export function SkillsSection() {
  return (
    <Section id="skills" aria-labelledby="skills-title">
      <Reveal>
        <Intro>
          <Eyebrow $variant="orange">Capabilities</Eyebrow>
          <Heading2 id="skills-title">Tools I reach for often.</Heading2>
          <p>
            Most of my work sits somewhere between product UI and frontend infrastructure:
            components, tables, flows, tests, accessibility, and keeping the codebase
            understandable.
          </p>
        </Intro>
      </Reveal>

      <Reveal delay={0.1}>
        <Groups>
          {skillGroups.map((group) => (
            <div key={group.label}>
              <GroupLabel>{group.label}</GroupLabel>
              <PillRow>
                {group.items.map((skill) => (
                  <Pill key={skill}>{skill}</Pill>
                ))}
              </PillRow>
            </div>
          ))}
        </Groups>
      </Reveal>
    </Section>
  );
}
