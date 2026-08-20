import { ArrowLeft } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router';
import styled from 'styled-components';
import { getDemoBySlug } from '../features/playground/registry';
import { DemoFrame } from '../features/playground/DemoFrame';

const Section = styled.section`
  padding: 4rem 6vw 7rem;

  @media (max-width: 760px) {
    padding: 3rem 1rem 5rem;
  }
`;

const Wrap = styled.div`
  max-width: 780px;
  margin: 0 auto;
`;

const Back = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  font-weight: 700;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Title = styled.h1`
  margin: 0 0 0.5rem;
  font-size: clamp(1.8rem, 3.5vw, 2.4rem);
`;

const Description = styled.p`
  margin: 0 0 2rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function PlaygroundDemoPage() {
  const { slug } = useParams<{ slug: string }>();
  const demo = slug ? getDemoBySlug(slug) : undefined;

  if (!demo) {
    return <Navigate to="/playground" replace />;
  }

  return (
    <Section>
      <Wrap>
        <Back to="/playground">
          <ArrowLeft size={15} /> Back to playground
        </Back>
        <Title>{demo.title}</Title>
        <Description>{demo.description}</Description>
        <DemoFrame demo={demo} showHeading={false} />
      </Wrap>
    </Section>
  );
}
