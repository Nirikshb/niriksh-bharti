'use client';

import { useCallback, useEffect, useRef } from 'react';

/** Per-flower state. A flower falls as soon as it is shot out and never comes back up. */
type FlowerState = 'falling' | 'settled';

type Flower = {
  el: HTMLSpanElement;
  state: FlowerState;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
  size: number;
  opacity: number;
  settledFor: number;
};

const FLOWERS = ['🌸', '🌼', '🌷', '🌺', '🌹', '🌻', '🏵️', '🌸', '🌼'];
const GRAVITY = 1500;
const SPAWN_INTERVAL = 0.07;
const HARD_CAP = 500; // safety valve only; normal sessions never reach it

const pick = <T,>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)];

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
  const layerRef = useRef<HTMLDivElement>(null);
  const flowers = useRef<Flower[]>([]);
  const holding = useRef(false);
  const autoDemo = useRef(true);
  const autoTimers = useRef<number[]>([]);

  const spawn = useCallback(() => {
    const layer = layerRef.current;
    if (!layer || flowers.current.length >= HARD_CAP) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const size = Math.round(14 + Math.random() * 16);

    const el = document.createElement('span');
    el.textContent = pick(FLOWERS);
    el.className = 'absolute left-0 top-0 select-none will-change-transform';
    el.style.fontSize = `${size}px`;
    el.style.opacity = '0';
    el.style.filter = 'drop-shadow(0 2px 2px rgba(0,0,0,0.12))';
    layer.appendChild(el);

    flowers.current.push({
      el,
      state: 'falling',
      x: w / 2 + (Math.random() - 0.5) * 70,
      y: h / 2 + (Math.random() - 0.5) * 70,
      vx: (Math.random() - 0.5) * 900,
      vy: -320 - Math.random() * 380,
      rot: (Math.random() - 0.5) * 50,
      vrot: (Math.random() - 0.5) * 700,
      size,
      opacity: 0,
      settledFor: -1,
    });
  }, []);

  const startHold = useCallback(() => {
    holding.current = true;
  }, []);

  const release = useCallback(() => {
    if (!holding.current) return;
    holding.current = false;

    // Stop shooting. Flowers still in the air get one final scatter; anything
    // already on the ground stays down and keeps fading.
    for (const flower of flowers.current) {
      if (flower.state !== 'falling') continue;
      flower.vx += (Math.random() - 0.5) * 600;
      flower.vy = -100 - Math.random() * 220;
      flower.vrot += (Math.random() - 0.5) * 500;
    }
  }, []);

  const stopAuto = useCallback(() => {
    autoDemo.current = false;
    autoTimers.current.forEach((timer) => window.clearTimeout(timer));
    autoTimers.current = [];
  }, []);

  // Physics loop — transforms are written straight to the DOM (no re-renders).
  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    let spawnAccumulator = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const viewportHeight = window.innerHeight;

      // Keep shooting for as long as the pointer is held down / hovering.
      if (holding.current) {
        spawnAccumulator += dt;
        while (spawnAccumulator >= SPAWN_INTERVAL) {
          spawnAccumulator -= SPAWN_INTERVAL;
          spawn();
        }
      } else {
        spawnAccumulator = 0;
      }

      for (let i = flowers.current.length - 1; i >= 0; i--) {
        const f = flowers.current[i];

        if (f.state === 'falling') {
          f.opacity += (1 - f.opacity) * Math.min(1, dt * 9);
          f.vy += GRAVITY * dt;
          f.vx *= 1 - 0.55 * dt;
          f.x += f.vx * dt;
          f.y += f.vy * dt;
          f.rot += f.vrot * dt;

          const floor = viewportHeight - 18 - f.size / 2;
          if (f.y >= floor) {
            f.y = floor;
            f.vy = -f.vy * 0.36;
            f.vx *= 0.62;
            f.vrot *= 0.5;
            if (Math.abs(f.vy) < 60) {
              f.vy = 0;
              f.vx = 0;
              f.vrot = 0;
              f.settledFor = 0;
              f.state = 'settled';
            }
          }
        } else {
          // settled: linger briefly, then vanish for good
          f.settledFor += dt;
          if (f.settledFor > 1.1) f.opacity -= dt * 1.5;
          if (f.opacity <= 0) {
            f.el.remove();
            flowers.current.splice(i, 1);
            continue;
          }
        }

        f.el.style.transform = `translate3d(${f.x}px, ${f.y}px, 0) translate(-50%, -50%) rotate(${f.rot}deg)`;
        f.el.style.opacity = String(f.opacity);
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [spawn]);

  // Hands-free demo until the first real interaction.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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

      <div ref={layerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden" />

      <button
        type="button"
        aria-label="Hold to shoot out flowers, release to drop them"
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
        className="group relative z-20 flex aspect-square w-[clamp(190px,44vw,270px)] items-center justify-center rounded-[30%] bg-gradient-to-br from-white to-[#f3f3f3] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.20),0_16px_28px_-18px_rgba(0,0,0,0.14),inset_0_1px_2px_rgba(255,255,255,0.9)] outline-none transition-transform duration-500 ease-out hover:scale-[1.04] active:scale-[0.98]"
      >
        <span className="transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6">
          <Bouquet />
        </span>
      </button>
    </main>
  );
}
