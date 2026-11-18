'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

type IconId = 'chat' | 'cube' | 'send';

const ORDER: IconId[] = ['chat', 'cube', 'send'];

export default function RiffA({ className = '' }: { className?: string }) {
  const [selected, setSelected] = useState(0);
  const [gooKey, setGooKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [thumb, setThumb] = useState({ left: 0, width: 0 });

  // Measure the currently selected button and park the glass thumb over it.
  const measure = () => {
    const button = buttonsRef.current[selected];
    const container = containerRef.current;
    if (!button || !container) return;
    setThumb({ left: button.offsetLeft, width: button.offsetWidth });
  };

  useLayoutEffect(measure, [selected]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // Auto-advance through the icons, like the riff does (loop).
  useEffect(() => {
    const timer = window.setInterval(() => {
      setGooKey((key) => key + 1);
      setSelected((value) => (value + 1) % ORDER.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, []);

  const handleClick = (index: number) => {
    if (index === selected) return;
    setGooKey((key) => key + 1);
    setSelected(index);
  };

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

      <div
        ref={containerRef}
        role="toolbar"
        aria-label="Quick actions"
        className="relative flex w-[min(46rem,92vw)] items-center rounded-full border border-[#ececf0] bg-[#fbfbfc] p-[clamp(0.32rem,1.6vmin,0.55rem)] shadow-[0_18px_55px_-18px_rgba(255,255,255,0.25)]"
      >
        {/* liquid gooey selector */}
        <span
          aria-hidden="true"
          key={gooKey}
          className="riffA-thumb pointer-events-none absolute top-1/2 h-[clamp(2.5rem,11.5vmin,3.65rem)] rounded-full"
          style={{
            left: thumb.left,
            width: thumb.width,
          }}
        />

        {ORDER.map((id, index) => {
          const isSelected = index === selected;
          return (
            <button
              key={id}
              ref={(element) => {
                buttonsRef.current[index] = element;
              }}
              type="button"
              aria-label={id}
              aria-pressed={isSelected}
              onClick={() => handleClick(index)}
              className={`relative z-10 grid h-[clamp(2.5rem,11.5vmin,3.65rem)] flex-1 place-items-center rounded-full outline-none ring-0 focus-visible:ring-2 focus-visible:ring-neutral-400 transition-all duration-500 ${
                isSelected ? 'text-[#101014] opacity-100' : 'text-[#101014] opacity-30'
              }`}
            >
              <span className="block h-[clamp(1.3rem,5.5vmin,1.75rem)] w-[clamp(1.3rem,5.5vmin,1.75rem)]">
                {renderIcon(id)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
