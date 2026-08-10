import { useState } from 'react';
import styled from 'styled-components';
import type { ExperienceItem } from '../../data/experience';

const Item = styled.article`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  background: ${({ theme }) => theme.colors.bg};
  overflow: hidden;
`;

const Trigger = styled.button`
  width: 100%;
  display: grid;
  grid-template-columns: minmax(14rem, 0.42fr) 1fr auto;
  gap: 2rem;
  align-items: center;
  padding: 1.25rem;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.bgMuted};
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr auto;
  }
`;

const Meta = styled.div`
  span {
    color: ${({ theme }) => theme.palette.missionOrange};
    font-size: 0.78rem;
    font-weight: 900;
    text-transform: uppercase;
  }

  h3 {
    margin: 0.35rem 0 0.2rem;
    font-size: 1.45rem;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 750;
  }
`;

const Summary = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};

  @media (max-width: 760px) {
    display: none;
  }
`;

const Indicator = styled.span<{ $open: boolean }>`
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  transform: rotate(${({ $open }) => ($open ? '45deg' : '0deg')});
  transition: transform 0.2s ease;
`;

const Highlights = styled.ul`
  display: grid;
  gap: 0.7rem;
  margin: 0;
  padding: 0 1.25rem 1.25rem calc(1.25rem + 1.1rem);
  color: ${({ theme }) => theme.colors.textMuted};

  li::marker {
    color: ${({ theme }) => theme.palette.goldRush};
  }
`;

export function ExperienceRow({ item }: { item: ExperienceItem }) {
  const [open, setOpen] = useState(false);
  const panelId = `experience-${item.company.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <Item>
      <Trigger type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={panelId}>
        <Meta>
          <span>{item.dates}</span>
          <h3>{item.company}</h3>
          <p>{item.role}</p>
        </Meta>
        <Summary>{item.highlights[0]}</Summary>
        {/* TODO: use the + icon from lucide-react instead of just a + */}
        <Indicator $open={open} aria-hidden="true">
          +
        </Indicator>
      </Trigger>
      {open && (
        <Highlights id={panelId}>
          {item.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </Highlights>
      )}
    </Item>
  );
}
