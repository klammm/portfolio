import { ArrowUpRight } from 'lucide-react';
import styled from 'styled-components';
import { projects, type Project } from '../../data/projects';
import { Reveal } from '../shared/Reveal';
import { SectionHeading } from '../shared/SectionHeading';

const Section = styled.section`
  padding: 5.5rem 6vw;
  background: ${({ theme }) => theme.colors.bg};

  @media (max-width: 760px) {
    padding: 4rem 1rem;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (max-width: 1040px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  display: flex;
  min-height: 286px;
  flex-direction: column;
  padding: 1.2rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  background: ${({ theme }) => theme.colors.bgElevated};
  box-shadow: ${({ theme }) => theme.colors.shadow};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &[href]:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(16, 24, 32, 0.14);
  }

  @media (max-width: 760px) {
    min-height: 260px;
  }
`;

const Topline = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.palette.missionOrange};
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
`;

const Title = styled.h3`
  margin: 1.2rem 0 0.55rem;
  font-size: 1.35rem;
`;

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Impact = styled.strong`
  margin-top: auto;
  color: ${({ theme }) => theme.palette.bayTeal};
  font-size: 0.9rem;
  font-weight: 760;
`;

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card as={project.url ? 'a' : 'article'} href={project.url}>
      <Topline>
        <span>{project.tag}</span>
        {project.url && <ArrowUpRight size={18} />}
      </Topline>
      <Title>{project.title}</Title>
      <Description>{project.description}</Description>
      <Impact>{project.impact}</Impact>
    </Card>
  );
}

export function WorkSection() {
  return (
    <Section id="work" aria-labelledby="work-title">
      <Reveal>
        <SectionHeading eyebrow="Selected Work" title="A few things I have worked on recently." id="work-title" />
      </Reveal>
      <Grid>
        {projects.map((project, i) => (
          <Reveal key={project.title} delay={(i + 1) * 0.1}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </Grid>
    </Section>
  );
}
