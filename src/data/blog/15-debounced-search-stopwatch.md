---

title: "Building a Debounced Search and Stopwatch"
date: "2026-08-21"
excerpt: "Debounced Search and Stopwatch as part of React closures and ref practice."
tags: ["react"]
demo: "debounced-search"
--------------------------------

Day 2 of the study plan. Yesterday was all about state modeling and figuring out what actually needs to live in state versus what I can just derive. Today was closures, stale closures, effect dependencies, and refs.

I went in thinking I already understood closures pretty well. I did not, not the way I needed to for some of these exercises.

For the full list of code changes, here's the [Pull Request](https://github.com/klammm/portfolio/pull/1). 

## The objective for today

* explain closures
* explain stale closures
* understand effect dependencies
* distinguish effects from event handlers
* clean up effects
* use refs appropriately
* reason about timers, subscriptions, and async callbacks

There's a classic example that gets used to illustrate the stale closure problem, and it's a good one to sit with:

```tsx
useEffect(() => {
  const id = setInterval(() => {
    console.log(count);
  }, 1000);

  return () => clearInterval(id);
}, []);
```

The empty dependency array means this effect runs once. The callback inside `setInterval` closes over whatever `count` was at that moment, forever. So no matter how many times `count` changes after that, this interval will keep logging the original value. It's not a bug in the interval. It's a closure doing exactly what it's supposed to do, just not what I wanted it to do.

Comparing that against dependencies, functional updates, and refs made it click a lot more:

* Add `count` to the dependency array and the effect tears down and recreates the interval every time `count` changes. Works, but now I'm constantly clearing and resetting a timer just to read a value.
* Use a functional update like `setCount(c => c + 1)` and I don't even need to read `count` from the closure anymore. React hands me the latest value at update time.
* Use a ref to hold the latest value and read `ref.current` inside the interval. The ref is mutable and doesn't get "frozen" the way a closed-over variable does, so the callback always sees the current value without needing to recreate anything.

Three different tools for the same underlying problem, and picking the right one really depends on what you're trying to do.

## What confused me

Attaching refs to a list of nodes tripped me up. I went and did the [image carousel scrolling example on react.dev](https://react.dev/learn/manipulating-the-dom-with-refs#example-scrolling-to-an-element), and my first instinct was to create a whole list of refs, one for every image, so I could scroll to whichever one I needed.

That's more than the problem actually asks for. It's not about scrolling to any arbitrary image. It's about scrolling to whichever image is currently selected. So instead of managing a list of ref nodes, I just needed one ref that gets reassigned to whatever the current selected node is. Much simpler once I saw it, but I definitely overbuilt it the first time around.

If you want to try that one yourself, the [React docs on referencing values with refs](https://react.dev/learn/referencing-values-with-refs) has the challenge section at the bottom. Worth doing even if you think you already get refs. I thought I did too.

## Build exercise: Debounced Search

I had the right intuition going into this one. I knew debounce needed a closure somewhere and I knew the general shape of it. What I didn't have yet was the actual mental model.

The way it finally clicked for me: start a timer on the first call. If you get called again before that timer finishes, clear it and start a new one. Keep clearing and restarting for as long as calls keep coming in. Only when the calls stop does the timer actually get to finish and fire.

Or said differently: wait until the thing stops happening, then do the thing.

Once I had that mental model locked in, writing the debounce function itself wasn't bad. Where I actually got stuck was figuring out what to debounce.

My first attempt was debouncing `setSearchInput` directly, something like wrapping the setter itself in the debounce function. That broke the input completely. I'd type into the box and get no feedback at all, because I was debouncing the actual state update that controls what shows up in the input. The input needs to update immediately on every keystroke so it feels responsive. It's the search request that should wait.

The fix was to stop trying to debounce a function and debounce a value instead. I ended up writing a `useDebouncedValue` hook:

```tsx
export function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}
```

`searchInput` updates on every keystroke so the input stays snappy. `useDebouncedValue(searchInput, 500)` gives me back a value that only settles once the user has stopped typing for 500ms, and that's the value that actually triggers the fetch. Apparently this is a pretty common pattern in React, debouncing a function tends to fight the render cycle because the debounced function doesn't reliably persist across renders, and debouncing the value sidesteps that entirely. Cleaner pattern, and it made the rest of the exercise, loading states, empty states, error states, all fall into place a lot more naturally.

The demo embedded in this post has the debounced search running live if you want to poke at it.

## Build exercise: Timer

This is the one that really humbled me today. Try out the demo [here](https://www.klam.space/playground/stopwatch).

**First problem: pause wasn't actually pausing.**

I'd hit start, let it run, hit pause, and the display would freeze like it should. But then if I hit start again, sometimes the timer would keep running in the background even though visually it looked paused, or it would just reset to zero, or it would do something else weird depending on how many times I'd clicked around.

The root cause was in `handleStart`. Every time it ran, I was creating a brand new interval and storing its ID in a ref:

```tsx
intervalRef.current = setInterval(() => {
  setNow(new Date());
}, 10);
```

The problem is `intervalRef.current` only ever holds one ID. If `handleStart` fires more than once before I actually pause, and it could, since nothing was stopping me from clicking Start multiple times, the ref just overwrites the old ID with the new one. The previous interval is still alive somewhere, ticking away, and now I have no way to reach it because I lost the only reference to it. So `handlePause` calls `clearInterval` and it does clear an interval, just not necessarily all of them.

The fix was to call `clearInterval(intervalRef.current)` at the top of `handleStart`, before setting up the new one:

```tsx
const handleStart = () => {
  const currentTime = new Date();
  setStartTime(currentTime);
  setNow(currentTime);
  clearInterval(intervalRef.current);

  intervalRef.current = setInterval(() => {
    setNow(new Date());
  }, 10);
};
```

`clearInterval` on an ID that's already been cleared, or on `undefined`, is a harmless no-op, so it's safe to call every single time. This guarantees at most one interval is ever alive and that the ref always points to the one that's actually running. I understand now why this needed to live in `handleStart` and not in `handlePause`. By the time you're inside `handlePause`, any orphaned interval IDs from earlier are already gone. The fix has to happen at creation, not cleanup.

**Second problem: resuming didn't resume where I left off.**

Once pause was actually clearing the right interval, I ran into the next issue. Hit pause, wait a few seconds, hit start again, and the timer would either reset back to zero, or worse, it would act like a wall clock and count the entire time that had passed including the paused duration, as if it had never stopped.

That second one is a subtle bug because it doesn't look broken at first glance. The numbers are still going up. They're just going up by the wrong amount.

The issue was how I was calculating elapsed time. I had:

```tsx
secondsPassed = (now - startTime) / 1000;
```

`startTime` only ever got set once, at the very first click of Start. It never moved again after that, not even on resume. So the math was really computing "time since I first ever hit start," which quietly counts the paused stretch as if the clock had kept running the whole time.

My first fix was to shift `startTime` forward by however long the pause lasted, basically rewriting history a little on every resume so the math worked out. That worked, but it felt a bit hacky, like I was reverse engineering a fictional start time every time.

The cleaner pattern, and the one I ended up going with, was to stop trying to derive everything from a single `startTime` and instead track accumulated time explicitly:

```tsx
const elapsedMs = startTime && now
  ? accumulatedTime + (now.getTime() - startTime.getTime())
  : accumulatedTime;

const handlePause = () => {
  clearInterval(intervalRef.current);
  if (startTime && now) {
    setAccumulatedTime(prev => prev + (now.getTime() - startTime.getTime()));
  }
  setStartTime(null);
};
```

Total elapsed time becomes "whatever I'd already banked from previous runs" plus "however long the current run has been going." On pause, I freeze the current segment into `accumulatedTime` and clear `startTime` back to `null`. On resume, I just set a fresh `startTime` and the math takes care of itself, no rewriting anything.

This felt like the same lesson from yesterday's product filter dashboard showing up again in a different shape. I kept trying to make one piece of state do too much work instead of being honest about what actually needs to be tracked independently. `accumulatedTime` and the current run's `startTime` are two genuinely different things, and once I stopped trying to squash them into one value, the pause and resume behavior just worked.

It also sets me up nicely if I ever want to add lap times later. Each lap is just another slice of accumulated time.

## What I could implement without help

Once the mental models clicked, actually writing the code wasn't the hard part. Debounce, cleanup functions, the interval clearing pattern, all of that came together pretty quickly. The struggle was almost entirely in the "wait, why is this happening" phase, not the "how do I write this" phase.

## What should get more time tomorrow

Refs, specifically the boundary between when a ref is the right tool versus when it's papering over a state modeling problem. I want to get more reps in on effect dependencies too, since I can still feel myself hesitating for a second before I know whether something belongs in the dependency array or not.

If you want to try any of this yourself, the [react.dev refs page](https://react.dev/learn/referencing-values-with-refs) has a solid set of challenges at the bottom, including the carousel one that got me earlier. Worth doing even if refs feel familiar going in. Turns out mine weren't as solid as I thought.
