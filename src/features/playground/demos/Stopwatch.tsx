import { useState, useRef } from 'react';
/*
Build a timer:

-   start x
-   pause x
-   reset x
-   elapsed time x
-   cleanup
*/
export const Stopwatch = () => {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [accumulatedTime, setAccumulatedTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  
  const secondsPassed = startTime && now ? (accumulatedTime + (now.getTime() - startTime.getTime())) / 1000 : accumulatedTime / 1000;

  const handleStart = () => {
    const currentTime = new Date();
    setStartTime(currentTime);
    setNow(currentTime);
    intervalRef.current = setInterval(() => {
      setNow(new Date());
    }, 10)
  };

  const handlePause = () => {
    clearInterval(intervalRef.current);
    if (startTime && now) {
      setAccumulatedTime(prev => prev + (now.getTime() - startTime.getTime()));
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