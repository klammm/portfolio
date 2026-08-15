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

// Fog sits over the hills upper-left, follows the diagonal through the headline and the
// bridge, and thins out near the piers around 85% width — short of the
// orange skyline block on the right.
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

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// How much fog exists at a given point along the path — full strength from
// the hills through the bridge, thinning out over the last stretch toward
// the piers rather than stopping abruptly.
function density(u: number) {
  return 1 - smoothstep(0.58, 0.9, u);
}

// A fixed chain of puffs strung along the whole path at once — a
// continuous stream, not a single blob traveling through empty space.
// Each puff's base position is static; only size/opacity/wobble animate.
const PUFF_COUNT = 9;
const U_START = 0.02;
const U_END = 0.85;
const LOBES_PER_PUFF = 7;

type Puff = {
  u: number;
  cx: number; // fraction of width, fixed
  cy: number; // fraction of height, fixed
  baseSize: number; // fraction of width
  bobPhase: number;
  pulsePhase: number;
  lobeAngles: number[];
  lobeRadii: number[]; // as a fraction of puff size
};

function buildPuffs(): Puff[] {
  // Deterministic pseudo-randomness (no Math.random at draw time) so the
  // shape is stable frame to frame — only position/opacity animate.
  let seed = 42;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return (seed % 1000) / 1000;
  };

  const puffs: Puff[] = [];
  for (let i = 0; i < PUFF_COUNT; i++) {
    const u = U_START + ((U_END - U_START) * i) / (PUFF_COUNT - 1);
    const { x, y } = bezierPoint(u, PATH);
    const d = density(u);
    const lobeAngles: number[] = [];
    const lobeRadii: number[] = [];
    for (let j = 0; j < LOBES_PER_PUFF; j++) {
      lobeAngles.push((2 * Math.PI * j) / LOBES_PER_PUFF + i * 0.5);
      lobeRadii.push(0.48 + 0.3 * rand());
    }
    puffs.push({
      u,
      cx: x,
      cy: y,
      baseSize: 0.1 * (0.55 + 0.45 * d) * (0.9 + 0.2 * rand()),
      bobPhase: rand() * Math.PI * 2,
      pulsePhase: rand() * Math.PI * 2,
      lobeAngles,
      lobeRadii,
    });
  }
  return puffs;
}

type FogCanvasProps = {
  /** Optional: scroll gently speeds up the bob/pulse motion for a subtle parallax feel. */
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
    const puffs = buildPuffs();

    let animId = 0;
    let running = false;
    let startTime = 0;
    let speedMultiplier = 1;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    };

    const drawPuff = (puff: Puff, elapsedMs: number, W: number, H: number) => {
      const d = density(puff.u);
      const alpha = 0.62 * Math.max(d, 0.05);
      if (alpha <= 0.01) return;

      const t = (elapsedMs / 1000) * speedMultiplier;
      // Gentle bob/drift so the stream feels alive without traveling far —
      // this is a persistent chain, not a moving packet.
      const bobY = Math.sin(t * 0.35 + puff.bobPhase) * 0.012 * H;
      const bobX = Math.cos(t * 0.22 + puff.bobPhase) * 0.006 * W;
      const pulse = 0.9 + 0.12 * Math.sin(t * 0.5 + puff.pulsePhase);

      const cx = puff.cx * W + bobX;
      const cy = puff.cy * H + bobY;
      const size = puff.baseSize * W * pulse;

      ctx.save();
      ctx.filter = `blur(${Math.max(5, size * 0.06)}px)`;
      puff.lobeAngles.forEach((angle, j) => {
        const rOffset = size * 0.4;
        const lx = cx + Math.cos(angle) * rOffset;
        const ly = cy + Math.sin(angle) * rOffset * 0.65;
        const lobeR = size * puff.lobeRadii[j];
        const a = alpha;
        const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, lobeR);
        grad.addColorStop(0, `rgba(226,231,238,${a})`);
        grad.addColorStop(0.7, `rgba(226,231,238,${a * 0.75})`);
        grad.addColorStop(1, 'rgba(226,231,238,0)');
        ctx.beginPath();
        ctx.arc(lx, ly, lobeR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
      // Center lobe ties the cluster together.
      const centerR = size * 0.62;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, centerR);
      grad.addColorStop(0, `rgba(230,234,240,${alpha})`);
      grad.addColorStop(0.7, `rgba(230,234,240,${alpha * 0.75})`);
      grad.addColorStop(1, 'rgba(230,234,240,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, centerR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    };

    const drawFrame = (elapsedMs: number) => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      puffs.forEach((puff) => drawPuff(puff, elapsedMs, W, H));
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
      drawFrame(0);
    } else {
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
