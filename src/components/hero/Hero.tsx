import { ArrowUpRight, Mail } from 'lucide-react';
import styled from 'styled-components';
import { profile } from '../../data/profile';
import { Button } from '../shared/Button';
import { FogCanvas } from './FogCanvas';

const Section = styled.section`
  position: relative;
  display: grid;
  min-height: calc(100vh - 72px);
  padding: 7rem 6vw 6rem;
  isolation: isolate;

  @media (max-width: 760px) {
    min-height: 760px;
    padding: 5rem 1rem 4rem;
  }
`;

const HeroImage = styled.div`
  position: absolute;
  inset: 0;
  z-index: -2;
  background:
    linear-gradient(90deg, rgba(4, 8, 14, 0.28), rgba(4, 8, 14, 0.02)),
    url('/sf-hero.webp') center / cover no-repeat;

  @media (max-width: 760px) {
    background:
      linear-gradient(90deg, rgba(4, 8, 14, 0.18), rgba(4, 8, 14, 0.08)),
      url('/sf-hero.webp') 45% center / cover no-repeat;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  background: ${({ theme }) => theme.colors.heroOverlay};
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  align-self: center;
  max-width: 820px;
  color: white;
`;

const Eyebrow = styled.p`
  margin: 0 0 0.85rem;
  color: ${({ theme }) => theme.palette.goldRush};
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const Heading1 = styled.h1`
  margin: 0;
  max-width: 12ch;
  line-height: 0.98;
  font-size: clamp(3.5rem, 9.8vw, 7.6rem);

  @media (max-width: 760px) {
    font-size: clamp(3.4rem, 19vw, 5.7rem);
  }
`;

const Copy = styled.p`
  max-width: 740px;
  margin: 1.5rem 0 0;
  color: rgba(247, 244, 234, 0.86);
  font-size: clamp(1.05rem, 1.7vw, 1.24rem);
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 2rem;
`;

export function Hero() {
  return (
    <Section>
      <HeroImage aria-hidden="true" />
      <Overlay aria-hidden="true" />
      <FogCanvas parallax />

      <Content>
        <Eyebrow>{profile.location}</Eyebrow>
        <Heading1>{profile.role}</Heading1>
        <Copy>{profile.summary}</Copy>
        <Actions>
          <Button as="a" href="#work" $variant="primary">
            Work <ArrowUpRight size={17} />
          </Button>
          <Button as="a" href={`mailto:${profile.email}`} $variant="secondary" $onDark>
            Contact <Mail size={17} />
          </Button>
        </Actions>
      </Content>
    </Section>
  );
}
