'use client';

import { useCallback, useEffect, useRef } from 'react';

type Phase = 'idle' | 'hold' | 'fall';

type Particle = {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  rot: number;
  vrot: number;
  size: number;
  emoji: string;
  opacity: number;
  settledFor: number; // -1 = still moving, >=0 = seconds since hitting the floor
};

const MAX_PARTICLES = 48;
const FLOWERS = ['🌸', '🌼', '🌷', '🌺', '🌹', '🌻', '🏵️', '🌸', '🌼'];
const GRAVITY = 1500;
const SPAWN_INTERVAL = 0.075;

const pick = <T,>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)];

function makeParticle(): Particle {
  return {
    active: false,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    tx: 0,
    ty: 0,
    rot: 0,
    vrot: 0,
    size: 18,
    emoji: '🌸',
    opacity: 0,
    settledFor: -1,
  };
}

function Tulip({
  x,
  y,
  color,
  rotate = 0,
  scale = 1,
}: {
  x: number;
  y: number;
  color: string;
  rotate?: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d="M0 0 C-13 -4 -19 -18 -15 -30 C-12 -38 -6 -38 -3 -30 C-1 -24 -1 -14 0 0Z" fill={color} />
      <path d="M0 0 C13 -4 19 -18 15 -30 C12 -38 6 -38 3 -30 C1 -24 1 -14 0 0Z" fill={color} />
      <path d="M0 0 C-8 -10 -10 -28 0 -40 C10 -28 8 -10 0 0Z" fill={color} />
      <path d="M0 -2 C-4 -12 -5 -26 0 -36 C-2 -22 -2 -10 0 -2Z" fill="#ffffff" opacity="0.18" />
    </g>
  );
}

function Bouquet() {
  const flowers = [
    { x: 58, y: 132, color: '#ef4444', rotate: -30, scale: 0.82 },
    { x: 74, y: 92, color: '#a855f7', rotate: -18, scale: 0.96 },
    { x: 104, y: 58, color: '#f97316', rotate: -6, scale: 1.02 },
    { x: 138, y: 70, color: '#facc15', rotate: 10, scale: 0.94 },
    { x: 166, y: 106, color: '#ec4899', rotate: 24, scale: 0.88 },
    { x: 118, y: 100, color: '#f43f5e', rotate: 0, scale: 0.98 },
    { x: 88, y: 132, color: '#fb7185', rotate: -12, scale: 0.78 },
    { x: 146, y: 136, color: '#f472b6', rotate: 18, scale: 0.76 },
  ];

  return (
    <svg
      viewBox="0 0 220 250"
      className="h-[72%] w-[72%] drop-shadow-[0_10px_12px_rgba(0,0,0,0.12)]"
      aria-hidden="true"
    >
      {flowers.map((f, i) => (
        <path
          key={`stem-${i}`}
          d={`M110 232 Q${f.x - 4} 180 ${f.x} ${f.y + 26}`}
          stroke="#4a9d4f"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      ))}
      <path d="M108 196 C78 176 62 182 58 202 C78 208 98 206 108 196Z" fill="#54ad57" />
      <path d="M114 188 C144 168 162 176 166 196 C144 202 124 200 114 188Z" fill="#3f9147" />
      <path d="M110 210 C86 204 76 214 78 226 C94 228 106 222 110 210Z" fill="#62b65e" />
      {flowers.map((f, i) => (
        <Tulip key={`flower-${i}`} {...f} />
      ))}
      <rect x="99" y="214" width="22" height="15" rx="4" fill="#d9b36a" />
      <rect x="99" y="219" width="22" height="3" fill="#c49b50" opacity="0.6" />
    </svg>
  );
}

export default function FlowerBurst() {
  const particles = useRef<Particle[]>(Array.from({ length: MAX_PARTICLES }, makeParticle));
  const elements = useRef<(HTMLSpanElement | null)[]>([]);
  const phase = useRef<Phase>('idle');
  const autoDemo = useRef(true);
  const autoTimers = useRef<number[]>([]);

  const spawn = useCallback(() => {
    const pool = particles.current;
    const index = pool.findIndex((p) => !p.active);
    if (index === -1) return;

    const p = pool[index];
    const w = window.innerWidth;
    const h = window.innerHeight;

    p.active = true;
    p.x = w / 2 + (Math.random() - 0.5) * 70;
    p.y = h / 2 + (Math.random() - 0.5) * 70;
    p.tx = 30 + Math.random() * Math.max(1, w - 60);
    p.ty = 36 + Math.random() * Math.min(h * 0.26, 210);
    p.vx = 0;
    p.vy = 0;
    p.rot = (Math.random() - 0.5) * 50;
    p.vrot = 0;
    p.size = Math.round(14 + Math.random() * 16);
    p.emoji = pick(FLOWERS);
    p.opacity = 0;
    p.settledFor = -1;

    const el = elements.current[index];
    if (el) {
      el.textContent = p.emoji;
      el.style.fontSize = `${p.size}px`;
    }
  }, []);

  const startHold = useCallback(() => {
    phase.current = 'hold';
  }, []);

  const release = useCallback(() => {
    if (phase.current !== 'hold') return;
    phase.current = 'fall';
    for (const p of particles.current) {
      if (!p.active) continue;
      // Scatter outward and pop up slightly, then gravity takes over.
      p.vx = (Math.random() - 0.5) * 1000;
      p.vy = -140 - Math.random() * 320;
      p.vrot = (Math.random() - 0.5) * 900;
      p.settledFor = -1;
    }
  }, []);

  const stopAuto = useCallback(() => {
    autoDemo.current = false;
    autoTimers.current.forEach((timer) => window.clearTimeout(timer));
    autoTimers.current = [];
  }, []);

  // Physics loop — writes transforms directly to the DOM, zero React re-renders.
  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    let spawnAccumulator = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const viewportHeight = window.innerHeight;
      const currentPhase = phase.current;

      if (currentPhase === 'hold') {
        spawnAccumulator += dt;
        while (spawnAccumulator >= SPAWN_INTERVAL) {
          spawnAccumulator -= SPAWN_INTERVAL;
          spawn();
        }
      } else {
        spawnAccumulator = 0;
      }

      particles.current.forEach((p, i) => {
        if (!p.active) return;
        const el = elements.current[i];
        if (!el) return;

        if (currentPhase === 'hold') {
          // Rise toward a spot in the top band and hover there.
          p.x += (p.tx - p.x) * Math.min(1, dt * 3.4);
          p.y += (p.ty - p.y) * Math.min(1, dt * 2.8);
          p.y += Math.sin(now * 0.002 + i) * 0.4;
          p.rot += Math.sin(now * 0.0015 + i) * 0.06;
          p.opacity += (1 - p.opacity) * Math.min(1, dt * 9);
        } else {
          // Release: ballistic fall, air drag, bounce, settle, fade.
          p.vy += GRAVITY * dt;
          p.vx *= 1 - 0.55 * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.rot += p.vrot * dt;

          const floor = viewportHeight - 18 - p.size / 2;
          if (p.y >= floor) {
            p.y = floor;
            p.vy = -p.vy * 0.36;
            p.vx *= 0.62;
            p.vrot *= 0.5;
            if (Math.abs(p.vy) < 60) {
              p.vy = 0;
              p.vx = 0;
              p.vrot = 0;
              if (p.settledFor < 0) p.settledFor = 0;
            }
          }
          if (p.settledFor >= 0) {
            p.settledFor += dt;
            if (p.settledFor > 1.1) p.opacity -= dt * 1.5;
          }
          if (p.opacity <= 0) {
            p.active = false;
            p.opacity = 0;
            el.style.opacity = '0';
            return;
          }
        }

        el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) rotate(${p.rot}deg)`;
        el.style.opacity = String(p.opacity);
      });

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [spawn]);

  // Hands-off demo so the page shows the effect without interaction.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const cycle = () => {
      if (!autoDemo.current) return;
      startHold();
      autoTimers.current.push(window.setTimeout(release, 1500));
      autoTimers.current.push(window.setTimeout(cycle, 6600));
    };
    autoTimers.current.push(window.setTimeout(cycle, 700));

    return () => {
      autoTimers.current.forEach((timer) => window.clearTimeout(timer));
      autoTimers.current = [];
    };
  }, [release, startHold]);

  return (
    <main className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_45%,#ffffff_0%,#f7f7f7_55%,#efefef_100%)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-[4/5] w-[min(60vw,620px)] -translate-x-1/2 -translate-y-1/2 rounded-[90px] bg-black/[0.018]"
      />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {Array.from({ length: MAX_PARTICLES }, (_, i) => (
          <span
            key={i}
            ref={(element) => {
              elements.current[i] = element;
            }}
            className="absolute left-0 top-0 select-none opacity-0 will-change-transform"
            style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.12))' }}
          >
            🌸
          </span>
        ))}
      </div>

      <button
        type="button"
        aria-label="Hold to gather flowers, release to drop them"
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') {
            stopAuto();
            startHold();
          }
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse') release();
        }}
        onPointerDown={(event) => {
          if (event.pointerType !== 'mouse') {
            stopAuto();
            startHold();
          }
        }}
        onPointerUp={(event) => {
          if (event.pointerType !== 'mouse') release();
        }}
        onPointerCancel={(event) => {
          if (event.pointerType !== 'mouse') release();
        }}
        onFocus={() => {
          stopAuto();
          startHold();
        }}
        onBlur={release}
        className="group relative z-20 flex aspect-square w-[clamp(190px,44vw,270px)] items-center justify-center rounded-[30%] bg-gradient-to-br from-white to-[#f3f3f3] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.20),0_16px_28px_-18px_rgba(0,0,0,0.14),inset_0_1px_2px_rgba(255,255,255,0.9)] outline-none transition-transform duration-500 ease-out hover:scale-[1.04] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-neutral-400"
      >
        <span className="transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6">
          <Bouquet />
        </span>
      </button>
    </main>
  );
}
