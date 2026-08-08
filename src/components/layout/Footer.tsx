import styled from 'styled-components';

const Bar = styled.footer`
  padding: 1.5rem 6vw;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.78rem;

  @media (max-width: 760px) {
    padding: 1.25rem 1rem;
  }
`;

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <Bar>
      <span>© {year} Kevin Lam · San Francisco</span>
      <span>Built with React + TypeScript + styled-components</span>
    </Bar>
  );
}
