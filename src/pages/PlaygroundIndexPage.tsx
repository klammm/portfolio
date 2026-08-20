import { Link } from 'react-router';
import styled from 'styled-components';
import { demos } from '../features/playground/registry';
import { Eyebrow, Heading2 } from '../components/shared/SectionHeading';

const Section = styled.section`
  padding: 5.5rem 6vw 7rem;
  max-width: 900px;
  margin: 0 auto;

  @media (max-width: 760px) {
    padding: 4rem 1rem 5rem;
  }
`;

const Intro = styled.div`
  margin-bottom: 3rem;
`;

const DemoGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
`;

const DemoCard = styled(Link)`
  display: block;
  padding: 1.4rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  background: ${({ theme }) => theme.colors.bgElevated};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.colors.shadow};
  }
`;

const DemoTitle = styled.h3`
  margin: 0 0 0.4rem;
  font-size: 1.15rem;
`;

const DemoDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.92rem;
`;

export function PlaygroundIndexPage() {
  return (
    <Section aria-labelledby="playground-title">
      <Intro>
        <Eyebrow $variant="orange">Playground</Eyebrow>
        <Heading2 id="playground-title">Things I've built, live.</Heading2>
      </Intro>

      <DemoGrid>
        {demos.map((demo) => (
          <DemoCard key={demo.slug} to={`/playground/${demo.slug}`}>
            <DemoTitle>{demo.title}</DemoTitle>
            <DemoDescription>{demo.description}</DemoDescription>
          </DemoCard>
        ))}
      </DemoGrid>
    </Section>
  );
}
