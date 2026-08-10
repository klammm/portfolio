import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Canvas = styled.canvas`
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

// Each band is a soft, blurred ellipse that drifts horizontally and bobs
// vertically at its own speed/phase. yCtr/hFrac are fractions of the canvas
// height, measured directly against sf-hero.webp: the bridge deck sits at
// ~38%, the waterline at ~42%, and the dark hill silhouettes run ~46–53%.
// Bands are centered on that span so the fog reads as sitting on the
// bridge/bay/hills, not floating over the sky or the skyline on the right.
const BANDS = [
  { yCtr: 0.39, hFrac: 0.09, speed: 0.00006, phase: 0, swing: 0.03, opacity: 0.34, r: 220, g: 226, b: 234 },
  { yCtr: 0.44, hFrac: 0.1, speed: 0.00009, phase: 1.8, swing: 0.04, opacity: 0.26, r: 210, g: 220, b: 232 },
  { yCtr: 0.48, hFrac: 0.09, speed: 0.00005, phase: 3.5, swing: 0.025, opacity: 0.2, r: 224, g: 229, b: 236 },
  { yCtr: 0.42, hFrac: 0.06, speed: 0.00013, phase: 0.9, swing: 0.035, opacity: 0.16, r: 205, g: 214, b: 228 },
] as const;

type FogCanvasProps = {
  /** Optional: nudges fog drift speed with scroll for a subtle parallax feel. */
  parallax?: boolean;
};

export function FogCanvas({ parallax = false }: FogCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId = 0;
    let running = false;
    let t = 0;
    let scrollOffset = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    };

    const drawFrame = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      BANDS.forEach((b) => {
        const cy = H * (b.yCtr + Math.sin(t * b.speed * 1000 + b.phase) * b.swing);
        const halfH = H * b.hFrac * (1 + 0.15 * Math.sin(t * b.speed * 700 + b.phase * 1.3));
        const xShift = W * 0.08 * Math.sin(t * b.speed * 600 + b.phase * 0.7) + scrollOffset;

        const grad = ctx.createLinearGradient(-W * 0.2 + xShift, 0, W * 1.2 + xShift, 0);
        grad.addColorStop(0, `rgba(${b.r},${b.g},${b.b},0)`);
        grad.addColorStop(0.15, `rgba(${b.r},${b.g},${b.b},${b.opacity * 0.4})`);
        grad.addColorStop(0.4, `rgba(${b.r},${b.g},${b.b},${b.opacity})`);
        grad.addColorStop(0.6, `rgba(${b.r},${b.g},${b.b},${b.opacity * 0.85})`);
        grad.addColorStop(0.85, `rgba(${b.r},${b.g},${b.b},${b.opacity * 0.3})`);
        grad.addColorStop(1, `rgba(${b.r},${b.g},${b.b},0)`);

        ctx.save();
        ctx.filter = 'blur(28px)';
        ctx.beginPath();
        ctx.ellipse(W * 0.5 + xShift, cy, W * 0.75, halfH, 0, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      });
    };

    const loop = () => {
      if (!running) return;
      t++;
      drawFrame();
      animId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      loop();
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(animId);
    };

    resize();

    if (reduceMotion) {
      // Draw exactly one static frame and never animate.
      drawFrame();
    } else {
      // Only run the animation loop while the canvas is actually on screen —
      // once the hero scrolls out of view there's no reason to keep painting.
      const io = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? start() : stop()),
        { threshold: 0 },
      );
      io.observe(canvas);

      const onScroll = () => {
        if (parallax) scrollOffset = window.scrollY * 0.15;
      };
      if (parallax) window.addEventListener('scroll', onScroll, { passive: true });

      const ro = new ResizeObserver(resize);
      ro.observe(canvas);

      return () => {
        stop();
        io.disconnect();
        ro.disconnect();
        if (parallax) window.removeEventListener('scroll', onScroll);
      };
    }

    return () => stop();
  }, [parallax]);

  return <Canvas ref={canvasRef} aria-hidden="true" />;
}
