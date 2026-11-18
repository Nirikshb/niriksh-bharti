'use client';

import { useCallback, useState } from 'react';

type IconId = 'chat' | 'cube' | 'send';

const ORDER: { id: IconId; label: string }[] = [
  { id: 'chat', label: 'Chat' },
  { id: 'cube', label: 'Files' },
  { id: 'send', label: 'Send' },
];

export default function RiffA({ className = '' }: { className?: string }) {
  const [active, setActive] = useState<IconId>('send');
  const [nonce, setNonce] = useState(0);

  const handleClick = useCallback((id: IconId) => {
    setActive(id);
    setNonce((value) => value + 1);
  }, []);

  const renderIcon = (id: IconId) => {
    switch (id) {
      case 'chat':
        return (
          <svg viewBox="0 0 24 24" className="h-full w-full fill-none stroke-current" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5.5 10a6.5 6.5 0 0 1 13 0c0 3.6-2.7 6.3-6.5 6.8l-2.6 2.2.7-2.6A6.4 6.4 0 0 1 5.5 10Z" />
          </svg>
        );
      case 'cube':
        return (
          <svg viewBox="0 0 24 24" className="h-full w-full fill-none stroke-current" strokeWidth="1.9" strokeLinejoin="round">
            <path d="M12 3.2 5 7.1 12 11 19 7.1 12 3.2Z" />
            <path d="M5 7.1v9.2l7 4 7-4V7.1" />
          </svg>
        );
      case 'send':
        return (
          <svg viewBox="0 0 24 24" className="h-full w-full fill-none stroke-current" strokeWidth="1.9" strokeLinejoin="round">
            <path d="M4 12.2 20.5 5 13.3 19.5 10.8 13.6 4 12.2Z" />
          </svg>
        );
    }
  };

  return (
    <section
      className={`relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-[#0b0b10] ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 65%)' }}
      />

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-white/25">
        RiffA
      </div>

      <div
        role="toolbar"
        aria-label="Quick actions"
        className="relative flex items-center rounded-full border border-white bg-white px-[clamp(0.9rem,6vmin,1.9rem)] py-[clamp(0.7rem,4.5vmin,1.1rem)] shadow-[0_16px_45px_-15px_rgba(255,255,255,0.22)]"
      >
        {ORDER.map(({ id, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              aria-label={label}
              aria-pressed={isActive}
              onClick={() => handleClick(id)}
              className={`grid h-[clamp(2.6rem,13vmin,3.6rem)] w-[clamp(2.6rem,13vmin,3.6rem)] place-items-center rounded-full outline-none ring-0 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                isActive ? 'scale-110 bg-[#101014] text-white' : 'bg-transparent text-[#101014] hover:scale-105'
              }`}
            >
              <span
                key={isActive ? `${id}-${nonce}` : `${id}-idle`}
                className={`block h-[clamp(1.3rem,6vmin,1.7rem)] w-[clamp(1.3rem,6vmin,1.7rem)] ${
                  isActive ? 'riffA-pop' : ''
                }`}
              >
                {renderIcon(id)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
