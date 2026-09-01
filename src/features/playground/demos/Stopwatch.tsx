import { useState, useRef } from 'react';
/*
Build a timer:

-   start x
-   pause x
-   reset
-   elapsed time
-   cleanup
*/
export const Stopwatch = () => {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<number | undefined>(undefined);

  let secondsPassed = 0;
  
  if (startTime !== null && now !== null) {
    secondsPassed = (now - startTime) / 1000;
  }

  const handleStart = () => {
    const currentTime = new Date();

    if (!paused) {
      setStartTime(currentTime);
    } else {
      const duration = currentTime - now;
      setStartTime(prev => new Date(prev?.getTime() + duration));
    }

    setNow(currentTime);
    clearInterval(intervalRef.current);
    setPaused(false);

    intervalRef.current = setInterval(() => {
      setNow(new Date());
    }, 10)
  };

  const handlePause = () => {
    clearInterval(intervalRef.current);
    setPaused(true);
  };

  const handleReset = () => {
    setStartTime(new Date());
    setNow(new Date());
    setPaused(false);
    clearInterval(intervalRef.current);
  };

  return (
    <div>
      <button type="button" onClick={handleStart}>
        Start
      </button>
      <button type="button" onClick={handlePause}>
        Pause
      </button>
      <button type="button" onClick={handleReset}>
        Reset
      </button>
      {secondsPassed.toFixed(3)}
    </div>
  )
};