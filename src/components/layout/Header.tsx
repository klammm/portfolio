import { useMemo, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import styled from 'styled-components';
import { profile } from '../../data/profile';
import type { ThemeName } from '../../theme/theme';

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 72px;
  padding: 0 6vw;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: color-mix(in srgb, ${({ theme }) => theme.colors.bg} 88%, transparent);
  backdrop-filter: blur(18px);
  box-shadow: 0 8px 24px rgba(16, 24, 32, 0.06);

  @media (max-width: 760px) {
    padding: 0 1rem;
  }
`;

const Brand = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 800;
`;

const BrandMark = styled.span`
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.palette.bayBlue},
    ${({ theme }) => theme.palette.bayTeal} 48%,
    ${({ theme }) => theme.palette.goldRush} 49%,
    ${({ theme }) => theme.palette.missionOrange}
  );
  color: white;
  font-size: 0.78rem;
`;

const Nav = styled.nav<{ $open: boolean }>`
  display: flex;
  gap: 0.35rem;

  @media (max-width: 760px) {
    position: absolute;
    top: calc(100% + 1px);
    right: 1rem;
    left: 1rem;
    display: ${({ $open }) => ($open ? 'flex' : 'none')};
    flex-direction: column;
    align-items: stretch;
    padding: 0.5rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius};
    background: ${({ theme }) => theme.colors.bgElevated};
    box-shadow: ${({ theme }) => theme.colors.shadow};
  }
`;

const NavLink = styled.a`
  min-height: 40px;
  display: flex;
  align-items: center;
  padding: 0.58rem 0.85rem;
  border-radius: ${({ theme }) => theme.radius};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.93rem;
  font-weight: 700;

  &:hover {
    background: ${({ theme }) => theme.colors.bgMuted};
    color: ${({ theme }) => theme.colors.text};
  }

  @media (max-width: 760px) {
    width: 100%;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  background: ${({ theme }) => theme.colors.bgElevated};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`;

const NavToggle = styled(IconButton)`
  display: none;

  @media (max-width: 760px) {
    display: grid;
  }
`;

const navItems: [string, string][] = [
  ['Work', '#work'],
  ['Experience', '#experience'],
  ['Skills', '#skills'],
  ['Contact', '#contact'],
];

type HeaderProps = {
  theme: ThemeName;
  onToggleTheme: () => void;
};

export function Header({ theme, onToggleTheme }: HeaderProps) {
  const [navOpen, setNavOpen] = useState(false);
  const closeNav = () => setNavOpen(false);

  const items = useMemo(() => navItems, []);

  return (
    <Bar>
      <Brand href="#top" onClick={closeNav} aria-label={`${profile.name} home`}>
        <BrandMark>KL</BrandMark>
        <span>{profile.name}</span>
      </Brand>

      <Nav $open={navOpen} aria-label="Primary navigation">
        {items.map(([label, href]) => (
          <NavLink key={href} href={href} onClick={closeNav}>
            {label}
          </NavLink>
        ))}
      </Nav>

      <Actions>
        <IconButton
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </IconButton>
        <NavToggle
          type="button"
          onClick={() => setNavOpen((open) => !open)}
          aria-label="Toggle navigation"
          aria-expanded={navOpen}
          title="Toggle navigation"
        >
          {navOpen ? <X size={19} /> : <Menu size={19} />}
        </NavToggle>
      </Actions>
    </Bar>
  );
}
