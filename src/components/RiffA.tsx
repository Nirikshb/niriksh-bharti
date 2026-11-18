'use client';

import type { CSSProperties } from 'react';

export default function RiffA({ className = '' }: { className?: string }) {
  return (
    <section
      className={`relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-[#0d0d12] ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[46vmin] w-[46vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[70px] transition-opacity duration-700"
        style={{ background: 'radial-gradient(circle, rgba(124,92,255,0.85), rgba(124,92,255,0) 70%)', animation: 'riffA-orb 7s ease-in-out infinite' }}
      />

      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[30vmin] w-[30vmin] -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-700"
        style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 55%, #22d3ee 130%)',
          animation: 'riffA-core 7s ease-in-out infinite',
          boxShadow: '0 0 140px rgba(139,92,246,0.55), 0 0 60px rgba(34,211,238,0.35)',
        }}
      />

      {Array.from({ length: 3 }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 rounded-full border border-white/30"
          style={{
            width: '12vmin',
            height: '12vmin',
            marginLeft: '-6vmin',
            marginTop: '-6vmin',
            animation: `riffA-ring ${6 + i * 2}s ease-out infinite`,
            animationDelay: `${i * 2.2}s`,
          }}
        />
      ))}

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 68%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 68%)',
          animation: 'riffA-dots 9s linear infinite',
        }}
      />
    </section>
  );
}
