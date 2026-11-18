'use client';

import { useEffect, useRef, useState } from 'react';

type IconId = 'chat' | 'cube' | 'pause' | 'send';

const ORDER: IconId[] = ['chat', 'cube', 'pause', 'send'];

export default function RiffA({ className = '' }: { className?: string }) {
  const [active, setActive] = useState<IconId>('pause');
  const refs = useRef<Record<IconId, HTMLButtonElement | null>>({
    chat: null,
    cube: null,
    pause: null,
    send: null,
  });

  // Gentle traveling highlight so the row feels alive without being noisy.
  useEffect(() => {
    let index = ORDER.indexOf('pause');
    const timer = window.setInterval(() => {
      index = (index + 1) % ORDER.length;
      setActive(ORDER[index]);
    }, 2000);
    return () => window.clearInterval(timer);
  }, []);

  const icon = (id: IconId, className?: string) => {
    const common = 'fill-none stroke-current';
    switch (id) {
      case 'chat':
        return (
          <svg viewBox="0 0 24 24" className={`${common} ${className}`} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5.5 10a6.5 6.5 0 0 1 13 0c0 3.6-2.7 6.3-6.5 6.8l-2.6 2.2.7-2.6A6.4 6.4 0 0 1 5.5 10Z" />
          </svg>
        );
      case 'cube':
        return (
          <svg viewBox="0 0 24 24" className={`${common} ${className}`} strokeWidth="1.9" strokeLinejoin="round">
            <path d="M12 3.2 5 7.1 12 11 19 7.1 12 3.2Z" />
            <path d="M5 7.1v9.2l7 4 7-4V7.1" />
          </svg>
        );
      case 'pause':
        return (
          <svg viewBox="0 0 24 24" className={`h-full w-full fill-current ${className ?? ''}`} aria-hidden="true">
            <rect x="6.75" y="6.25" width="3.5" height="11.5" rx="1.2" />
            <rect x="13.75" y="6.25" width="3.5" height="11.5" rx="1.2" />
            <circle cx="17.6" cy="8" r="1.45" opacity=".9" />
            <path d="M15.3 11.4c.9-.8 2.1-1.2 3.3-1.2 1.2 0 2.4.4 3.3 1.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        );
      case 'send':
        return (
          <svg viewBox="0 0 24 24" className={`${common} ${className}`} strokeWidth="1.9" strokeLinejoin="round">
            <path d="M4 12.2 20.5 5 13.3 19.5 10.8 13.6 4 12.2Z" />
          </svg>
        );
    }
  };

  return (
    <section
      className={`relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-[#0b0b10] ${className}`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[60vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl" style={{ background: 'radial-gradient(ellipse at center, #fff 0%, transparent 70%)' }} />
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-white/25">
        RiffA
      </div>

      <div
        role="toolbar"
        aria-label="Quick actions"
        className="relative flex items-center gap-[clamp(0.65rem,4.5vmin,1.35rem)] rounded-full border border-white bg-white px-[clamp(0.9rem,6vmin,1.9rem)] py-[clamp(0.7rem,4.5vmin,1.1rem)] shadow-[0_14px_40px_-12px_rgba(255,255,255,0.16),0_0_0_1px_rgba(255,255,255,0.08)]"
      >
        {ORDER.map((id) => {
          const isActive = active === id;
          const base =
            id === 'pause'
              ? 'grid h-[clamp(3.1rem,15.5vmin,4.35rem)] w-[clamp(3.1rem,15.5vmin,4.35rem)] place-items-center rounded-full bg-[#101014] text-white transition-all duration-300'
              : 'grid h-[clamp(2.15rem,10.5vmin,3rem)] w-[clamp(2.15rem,10.5vmin,3rem)] place-items-center rounded-full bg-transparent text-[#101014] transition-all duration-300';
          return (
            <button
              key={id}
              ref={(element) => {
                refs.current[id] = element;
              }}
              type="button"
              aria-label={id}
              aria-pressed={isActive}
              onMouseEnter={() => setActive(id)}
              className={`${base} outline-none hover:scale-110 focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                isActive && id !== 'pause' ? 'scale-110 bg-black/[0.06] text-black' : ''
              }`}
            >
              {icon(id, `h-[clamp(1.25rem,6vmin,1.65rem)] w-[clamp(1.25rem,6vmin,1.65rem)]`)}
            </button>
          );
        })}
      </div>
    </section>
  );
}
