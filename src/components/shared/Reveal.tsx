import type { ReactNode } from 'react';
import styled from 'styled-components';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const RevealBox = styled.div<{ $visible: boolean; $delay: number }>`
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: translateY(${({ $visible }) => ($visible ? '0' : '28px')});
  transition:
    opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${({ $delay }) => $delay}s,
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${({ $delay }) => $delay}s;
`;

type RevealProps = {
  children: ReactNode;
  delay?: number; // seconds, e.g. 0.1
};

export function Reveal({ children, delay = 0 }: RevealProps) {
  const { ref, visible } = useScrollReveal();
  return (
    <RevealBox ref={ref} $visible={visible} $delay={delay}>
      {children}
    </RevealBox>
  );
}
