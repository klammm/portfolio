import { Suspense } from 'react';
import styled from 'styled-components';
import type { PlaygroundDemo } from './registry';

const Frame = styled.div`
  margin: 1.5rem 0;
`;

const FrameTitle = styled.h3`
  margin: 0 0 0.3rem;
  font-size: 1.05rem;
`;

const FrameDescription = styled.p`
  margin: 0 0 0.9rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
`;

const LoadingBox = styled.div`
  display: grid;
  place-items: center;
  min-height: 120px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
`;

type DemoFrameProps = {
  demo: PlaygroundDemo;
  /** Standalone /playground/:slug page shows its own page header — skip the inline title there. */
  showHeading?: boolean;
};

export function DemoFrame({ demo, showHeading = true }: DemoFrameProps) {
  const { Component } = demo;
  return (
    <Frame>
      {showHeading && (
        <>
          <FrameTitle>{demo.title}</FrameTitle>
          <FrameDescription>{demo.description}</FrameDescription>
        </>
      )}
      <Suspense fallback={<LoadingBox>Loading demo…</LoadingBox>}>
        <Component />
      </Suspense>
    </Frame>
  );
}
