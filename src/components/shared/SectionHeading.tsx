/* eslint-disable react-refresh/only-export-components */
import styled from 'styled-components';

export const Eyebrow = styled.p<{ $variant?: 'gold' | 'orange' }>`
  margin: 0 0 0.85rem;
  color: ${({ theme, $variant }) =>
    $variant === 'orange' ? theme.palette.missionOrange : theme.palette.goldRush};
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const Heading2 = styled.h2`
  margin: 0;
  max-width: 760px;
  line-height: 0.98;
  letter-spacing: 0;
  font-size: clamp(2rem, 4.2vw, 4rem);
  font-family: ${({ theme }) => theme.font.body};
`;

const Wrap = styled.div`
  display: grid;
  gap: 0.45rem;
  margin-bottom: 2rem;
`;

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  id: string;
  variant?: 'gold' | 'orange';
};

export function SectionHeading({ eyebrow, title, id, variant = 'orange' }: SectionHeadingProps) {
  return (
    <Wrap>
      <Eyebrow $variant={variant}>{eyebrow}</Eyebrow>
      <Heading2 id={id}>{title}</Heading2>
    </Wrap>
  );
}
