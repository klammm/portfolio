import styled from 'styled-components';

export const Button = styled.a<{ $variant?: 'primary' | 'secondary'; $onDark?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  min-height: 46px;
  padding: 0.72rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  font-weight: 850;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;

  ${({ $variant, theme, $onDark }) =>
    $variant === 'primary'
      ? `
        background: ${theme.palette.goldRush};
        color: ${theme.palette.cableBlack};
        border-color: transparent;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(255, 199, 44, 0.4);
        }
      `
      : $onDark
        ? `
        background: rgba(247, 244, 234, 0.12);
        color: white;
        border-color: rgba(247, 244, 234, 0.26);

        &:hover {
          background: rgba(247, 244, 234, 0.2);
        }
      `
        : `
        background: color-mix(in srgb, ${theme.colors.bgElevated} 72%, transparent);
        color: ${theme.colors.text};

        &:hover {
          background: ${theme.colors.bgMuted};
        }
      `}
`;
