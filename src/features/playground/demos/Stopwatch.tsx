import { useState, useRef } from 'react';
import styled, { css } from 'styled-components';

/*
Build a timer:

-   start x
-   pause x
-   reset x
-   elapsed time x
-   cleanup x
*/

const Wrap = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  background: ${({ theme }) => theme.colors.bgElevated};
  padding: 1.25rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

const PageTitle = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.4rem;
  line-height: 1.2;
`;

const StatusTag = styled.span<{ $status: 'idle' | 'running' | 'paused' }>`
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.bgMuted};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  ${({ $status, theme }) =>
    $status === 'running' &&
    css`
      background: color-mix(in srgb, ${theme.palette.presidioGreen} 16%, transparent);
      color: ${theme.palette.presidioGreen};
    `}

  ${({ $status, theme }) =>
    $status === 'paused' &&
    css`
      background: color-mix(in srgb, ${theme.palette.goldRush} 22%, transparent);
      color: color-mix(in srgb, ${theme.palette.goldRush} 65%, ${theme.colors.text});
    `}
`;

const TimeDisplay = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.15rem;
  margin-bottom: 1.5rem;
  padding: 1.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum';
`;

const TimeWhole = styled.span`
  font-size: 2.6rem;
  font-weight: 700;
  line-height: 1;
`;

const TimeFraction = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 1;
`;

const ButtonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.6rem;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const BaseButton = styled.button`
  min-height: 44px;
  padding: 0 0.9rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  font: inherit;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition:
    background 120ms ease,
    border-color 120ms ease,
    transform 120ms ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.bgMuted};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.text};
    outline-offset: 2px;
  }
`;

const StartButton = styled(BaseButton)`
  background: ${({ theme }) => theme.palette.goldRush};
  color: ${({ theme }) => theme.palette.cableBlack};
  border-color: transparent;

  &:hover:not(:disabled) {
    box-shadow: 0 8px 24px rgba(255, 199, 44, 0.4);
    background: ${({ theme }) => theme.palette.goldRush};
  }
`;

const PauseButton = styled(BaseButton)``;

const ResetButton = styled(BaseButton)`
  color: ${({ theme }) => theme.colors.textMuted};
`;

const formatElapsed = (ms: number) => {
  const totalMs = Math.max(0, ms);
  const wholeSeconds = Math.floor(totalMs / 1000);
  const minutes = Math.floor(wholeSeconds / 60);
  const seconds = wholeSeconds % 60;
  const milliseconds = Math.floor(totalMs % 1000);

  const whole = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
  const fraction = milliseconds.toString().padStart(3, '0');

  return { whole, fraction };
};

export const Stopwatch = () => {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [accumulatedTime, setAccumulatedTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const elapsedMs =
    startTime && now
      ? accumulatedTime + (now.getTime() - startTime.getTime())
      : accumulatedTime;

  const isRunning = startTime !== null;
  const status: 'idle' | 'running' | 'paused' = isRunning
    ? 'running'
    : accumulatedTime > 0
      ? 'paused'
      : 'idle';

  const { whole, fraction } = formatElapsed(elapsedMs);

  const handleStart = () => {
    const currentTime = new Date();
    setStartTime(currentTime);
    setNow(currentTime);
    intervalRef.current = setInterval(() => {
      setNow(new Date());
    }, 10);
  };

  const handlePause = () => {
    clearInterval(intervalRef.current);
    if (startTime && now) {
      setAccumulatedTime((prev) => prev + (now.getTime() - startTime.getTime()));
    }
    setStartTime(null);
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setAccumulatedTime(0);
    setStartTime(null);
    setNow(null);
  };

  return (
    <Wrap>
      <Header>
        <PageTitle>Stopwatch</PageTitle>
        <StatusTag $status={status}>{status}</StatusTag>
      </Header>

      <TimeDisplay aria-live="polite">
        <TimeWhole>{whole}</TimeWhole>
        <TimeFraction>.{fraction}</TimeFraction>
      </TimeDisplay>

      <ButtonRow>
        <StartButton type="button" onClick={handleStart} disabled={isRunning}>
          {accumulatedTime > 0 && !isRunning ? 'Resume' : 'Start'}
        </StartButton>

        <PauseButton type="button" onClick={handlePause} disabled={!isRunning}>
          Pause
        </PauseButton>

        <ResetButton
          type="button"
          onClick={handleReset}
          disabled={!isRunning && accumulatedTime === 0}
        >
          Reset
        </ResetButton>
      </ButtonRow>
    </Wrap>
  );
};

export default Stopwatch;
