'use client';

import { useMemo, useState } from 'react';

const COLS = 37;
const ROWS = 7;
const MONTHS = ['JAN', 'MAR', 'MAY', 'JUL', 'SEP', 'NOV'];
const DAYS = ['M', 'W', 'F'];

const COLORS = ['#e7f1e9', '#b6e3c2', '#74ce90', '#2da35c', '#166b3c'];

function makeActivity(): number[][] {
  let seed = 2026;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => {
      const value = random();
      if (value < 0.2) return 0;
      if (value < 0.5) return 1;
      if (value < 0.74) return 2;
      if (value < 0.9) return 3;
      return 4;
    })
  );
}

export default function ActivityRiff() {
  const [is3D, setIs3D] = useState(false);
  const activity = useMemo(makeActivity, []);

  return (
    <section className="flex min-h-[100svh] w-full items-center justify-center bg-[#f2f7f1] px-5 py-12 sm:px-8">
      <div className="w-full max-w-[460px]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d9482]">
          Activity / 2026
        </p>
        <h1 className="mt-3 text-[clamp(30px,8vw,40px)] font-extrabold leading-[1.08] tracking-tight text-[#143d2a]">
          A year of
          <br />
          showing up.
        </h1>

        <div className="relative mt-7 overflow-hidden rounded-[22px] bg-[#fcfdfb] px-5 pb-5 pt-6 shadow-[0_18px_45px_-20px_rgba(20,61,42,0.28),0_2px_8px_rgba(20,61,42,0.05)]">
          <div className="flex items-baseline gap-2.5">
            <span className="text-[22px] font-bold tracking-tight text-[#173f2c]">1,284</span>
            <span className="text-[11px] text-[#9aa89c]">contributions</span>
          </div>

          <div className="relative mt-7">
            <div
              className={`landscape-shadow ${is3D ? 'opacity-100' : 'opacity-0'}`}
              aria-hidden="true"
            />
            <div
              className="month-labels mb-1.5 grid text-[7px] font-semibold tracking-wider text-[#9aa89c] transition-opacity duration-500"
              style={{ gridTemplateColumns: `repeat(${MONTHS.length}, 1fr)`, opacity: is3D ? 0 : 1 }}
            >
              {MONTHS.map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>

            <div className="flex">
              <div
                className="day-labels mr-1.5 flex flex-col justify-around text-[7px] font-semibold text-[#9aa89c] transition-opacity duration-500"
                style={{ opacity: is3D ? 0 : 1 }}
              >
                {DAYS.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              <div className="scene-wrap flex-1">
                <div
                  className="heatmap-scene"
                  style={{
                    transform: is3D
                      ? 'rotateX(58deg) rotateZ(-45deg) scale(1.05)'
                      : 'rotateX(0deg) rotateZ(0deg) scale(1)',
                  }}
                >
                  {activity.flatMap((row, rowIndex) =>
                    row.map((level, colIndex) => {
                      const height = is3D ? (level === 0 ? 2 : level * 6 + 3) : 0;
                      const color = COLORS[level];
                      return (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className="heat-cell"
                          style={{
                            left: `${(colIndex / COLS) * 100}%`,
                            top: `${(rowIndex / ROWS) * 100}%`,
                          }}
                        >
                          <div
                            className="heat-top"
                            style={{ background: color, transform: `translateZ(${height}px)` }}
                          />
                          <div
                            className="heat-side heat-side-front"
                            style={{ background: color, height: `${height}px`, filter: 'brightness(0.82)' }}
                          />
                          <div
                            className="heat-side heat-side-right"
                            style={{ background: color, width: `${height}px`, filter: 'brightness(0.66)' }}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-1.5 text-[8px] font-medium text-[#9aa89c]">
            <span className="mr-1">Less</span>
            {COLORS.map((color) => (
              <span
                key={color}
                className="h-2.5 w-2.5 rounded-[2px]"
                style={{ background: color }}
              />
            ))}
            <span className="ml-1">More</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setIs3D((value) => !value)}
            className="rounded-full bg-[#1c5d3c] px-7 py-3 text-[13px] font-semibold text-white shadow-[0_10px_22px_-8px_rgba(20,61,42,0.65)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            {is3D ? 'Back to 2D' : 'View in 3D'}
          </button>
        </div>
      </div>
    </section>
  );
}
