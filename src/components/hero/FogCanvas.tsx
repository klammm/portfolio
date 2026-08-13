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

// Fog originates over the hills upper-left, sweeps diagonally down through the headline,
// and dissipates near the piers around 85% width — well short of the orange
// skyline block on the right. Four control points define a single cubic
// Bezier through that arc.
const PATH = [
  { x: 0.04, y: 0.2 },
  { x: 0.3, y: 0.2 },
  { x: 0.55, y: 0.42 },
  { x: 0.85, y: 0.51 },
] as const;

function bezierPoint(t: number, [p0, p1, p2, p3]: typeof PATH) {
  const mt = 1 - t;
  const x = mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x;
  const y = mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y;
  return { x, y };
}

// Opacity along the path: fades in quickly as fog "arrives" over the hills,
// holds through the middle, tapers out approaching the piers
function envelope(u: number) {
  if (u < 0.15) return u / 0.15;
  if (u < 0.65) return 1;
  return Math.max(0, 1 - (u - 0.65) / 0.35);
}

// Each layer travels the same path on its own loop, staggered so there's
// always fog somewhere along the sweep rather than the whole effect
// resetting to empty at once. Sizes shrink layer-to-layer too
const LAYERS = [
  { durationMs: 12000, startFrac: 0, baseSize: 0.24, opacity: 0.4, r: 224, g: 229, b: 236 },
  { durationMs: 13500, startFrac: 0.25, baseSize: 0.2, opacity: 0.32, r: 214, g: 222, b: 232 },
  { durationMs: 11000, startFrac: 0.5, baseSize: 0.17, opacity: 0.26, r: 232, g: 235, b: 240 },
  { durationMs: 14500, startFrac: 0.75, baseSize: 0.15, opacity: 0.2, r: 206, g: 216, b: 230 },
] as const;

type FogCanvasProps = {
  /** Optional: scroll speeds up the sweep slightly for a subtle parallax feel. */
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
    let startTime = 0;
    let speedMultiplier = 1;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    };

    // Draws one layer's fog mass as a cluster of overlapping blurred lobes
    // (not a single smooth ellipse) for the rippled "waterfall" texture
    // positioned at progress `u` (0–1) along PATH.
    const drawLayer = (layer: (typeof LAYERS)[number], u: number, W: number, H: number) => {
      const alpha = layer.opacity * envelope(u);
      if (alpha <= 0.005) return;

      const { x, y } = bezierPoint(u, PATH);
      const cx = x * W;
      const cy = y * H;
      // Shrinks along the path — dense near the hills, thin near the piers.
      const size = layer.baseSize * (1 - 0.55 * u) * W;

      const lobes = [
        { dx: 0, dy: 0, scale: 1 },
        { dx: -size * 0.35, dy: size * 0.12, scale: 0.7 },
        { dx: size * 0.3, dy: -size * 0.1, scale: 0.6 },
      ];

      ctx.save();
      ctx.filter = `blur(${Math.max(14, size * 0.14)}px)`;
      lobes.forEach((lobe) => {
        const r = size * lobe.scale;
        const grad = ctx.createRadialGradient(cx + lobe.dx, cy + lobe.dy, 0, cx + lobe.dx, cy + lobe.dy, r);
        grad.addColorStop(0, `rgba(${layer.r},${layer.g},${layer.b},${alpha})`);
        grad.addColorStop(0.6, `rgba(${layer.r},${layer.g},${layer.b},${alpha * 0.6})`);
        grad.addColorStop(1, `rgba(${layer.r},${layer.g},${layer.b},0)`);
        ctx.beginPath();
        ctx.arc(cx + lobe.dx, cy + lobe.dy, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
      ctx.restore();
    };

    const drawFrame = (elapsedMs: number) => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      LAYERS.forEach((layer) => {
        const cycle = layer.durationMs / speedMultiplier;
        const raw = (elapsedMs + layer.startFrac * layer.durationMs) / cycle;
        const u = ((raw % 1) + 1) % 1;
        drawLayer(layer, u, W, H);
      });
    };

    const loop = (now: number) => {
      if (!running) return;
      if (!startTime) startTime = now;
      drawFrame(now - startTime);
      animId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      startTime = 0;
      animId = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(animId);
    };

    resize();

    if (reduceMotion) {
      // Freeze partway along the sweep instead of animating.
      drawFrame(LAYERS[0].durationMs * 0.35);
    } else {
      // Only run the loop while the canvas is actually on screen.
      const io = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? start() : stop()),
        { threshold: 0 },
      );
      io.observe(canvas);

      const onScroll = () => {
        if (parallax) {
          const boost = Math.min(window.scrollY / 800, 0.6);
          speedMultiplier = 1 + boost;
        }
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
