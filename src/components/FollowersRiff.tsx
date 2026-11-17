'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Frame = {
  chars: [string, string, string, string];
  line1: string;
  line2: string;
  duration: number;
  confetti?: boolean;
};

const FRAMES: Frame[] = [
  {
    chars: ['H', 'E', 'Y', '!'],
    line1: 'Just one more to go.',
    line2: 'Every follow counts.',
    duration: 800,
  },
  {
    chars: ['H', 'E', 'R', 'E'],
    line1: 'Just one more to go.',
    line2: 'Every follow counts.',
    duration: 2200,
  },
  {
    chars: ['E', 'Y', 'E', 'S'],
    line1: 'Just one more to go.',
    line2: 'Every follow counts.',
    duration: 1300,
  },
  {
    chars: ['L', 'I', 'K', 'E'],
    line1: 'Just one more to go.',
    line2: 'Every follow counts.',
    duration: 900,
  },
  {
    chars: ['H', 'E', 'R', 'E'],
    line1: 'Just one more to go.',
    line2: 'Every follow counts.',
    duration: 1400,
  },
  {
    chars: ['9', '9', '8', 'user'],
    line1: 'Just one more to go.',
    line2: 'Every follow counts.',
    duration: 1400,
  },
  {
    chars: ['9', '9', '9', 'user'],
    line1: 'Just one more to go.',
    line2: 'Every follow counts.',
    duration: 1200,
  },
  {
    chars: ['*', '#', '%', '§'],
    line1: '1,000 followers. We did it!',
    line2: 'Thank you for being here.',
    duration: 2600,
    confetti: true,
  },
  {
    chars: ['A', '※', '#', '#'],
    line1: '1,000 followers. We did it!',
    line2: 'Thank you for being here.',
    duration: 1600,
    confetti: true,
  },
  {
    chars: ['N', 'O', 'W', '!'],
    line1: 'Next stop: 10K.',
    line2: 'Stay tuned.',
    duration: 5000,
  },
];

function InstagramIcon() {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-[13px] border border-white/10 bg-[#2a2a2d] shadow-[0_8px_20px_rgba(0,0,0,0.5)]">
      <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] fill-none" strokeWidth="2">
        <defs>
          <linearGradient id="ig-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#f9ce34" />
            <stop offset="0.5" stopColor="#ee2a7b" />
            <stop offset="1" stopColor="#6228d7" />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="url(#ig-gradient)" />
        <circle cx="12" cy="12" r="4" stroke="url(#ig-gradient)" />
        <circle cx="17.5" cy="6.5" r="1" fill="url(#ig-gradient)" />
      </svg>
    </div>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[46%] w-[46%] fill-[#c9c9cc]" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7Z" />
    </svg>
  );
}

function FlipCard({ value }: { value: string }) {
  const [display, setDisplay] = useState(value);
  const [previous, setPrevious] = useState(value);
  const [phase, setPhase] = useState<'idle' | 'top' | 'bottom'>('idle');
  const displayRef = useRef(value);

  useEffect(() => {
    if (value === displayRef.current) return;
    const old = displayRef.current;
    displayRef.current = value;
    setPrevious(old);
    setDisplay(value);
    setPhase('top');
    const toBottom = window.setTimeout(() => setPhase('bottom'), 200);
    const toIdle = window.setTimeout(() => setPhase('idle'), 400);
    return () => {
      window.clearTimeout(toBottom);
      window.clearTimeout(toIdle);
    };
  }, [value]);

  const glyph = (char: string) => (
    <span className="flip-glyph">{char === 'user' ? <UserIcon /> : char}</span>
  );

  const topContent = display;
  const bottomContent = phase === 'idle' ? display : previous;

  return (
    <div className="flip-card">
      <div className="flip-half flip-half-top">{glyph(topContent)}</div>
      <div className="flip-half flip-half-bottom">{glyph(bottomContent)}</div>

      {phase === 'top' && (
        <div className="flip-flap flip-flap-top" key={`top-${previous}-${display}`}>
          {glyph(previous)}
        </div>
      )}
      {phase === 'bottom' && (
        <div className="flip-flap flip-flap-bottom" key={`bottom-${previous}-${display}`}>
          {glyph(display)}
        </div>
      )}

      <div className="flip-seam" />
      <span className="flip-peg flip-peg-left" />
      <span className="flip-peg flip-peg-right" />
    </div>
  );
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 44 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        dx: (Math.random() - 0.5) * 260,
        delay: Math.random() * 1.2,
        duration: 2.4 + Math.random() * 2,
        rotate: (Math.random() - 0.5) * 900,
        color: ['#ff4d6d', '#ffd166', '#4ade80', '#60a5fa', '#c084fc', '#ffffff', '#fb923c'][i % 7],
        w: 5 + Math.random() * 6,
        h: 8 + Math.random() * 8,
      })),
    []
  );

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece absolute top-[-10%]"
          style={
            {
              left: `${p.left}%`,
              width: p.w,
              height: p.h,
              background: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              '--dx': `${p.dx}px`,
              '--rot': `${p.rotate}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export default function FollowersRiff() {
  const [index, setIndex] = useState(0);
  const frame = FRAMES[index];

  useEffect(() => {
    const timer = window.setTimeout(
      () => setIndex((current) => (current + 1) % FRAMES.length),
      frame.duration
    );
    return () => window.clearTimeout(timer);
  }, [index, frame.duration]);

  return (
    <main className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,#242424_0%,#191919_72%)] px-6 text-center">
      {frame.confetti && <Confetti key={index} />}

      <div className="relative z-10 flex flex-col items-center">
        <InstagramIcon />

        <h1 className="mt-6 text-[13px] font-bold tracking-[0.42em] text-white/90">
          FOLLOWERS
        </h1>

        <div className="mt-9 flex items-center justify-center gap-2.5 sm:gap-3.5">
          {frame.chars.map((char, i) => (
            <FlipCard key={i} value={char} />
          ))}
        </div>

        <p className="mt-12 text-[15px] font-medium text-white/85 sm:text-lg">
          {frame.line1}
        </p>
        <p className="mt-2.5 text-[15px] text-white/40 sm:text-lg">{frame.line2}</p>
      </div>
    </main>
  );
}
