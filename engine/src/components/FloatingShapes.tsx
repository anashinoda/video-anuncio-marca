import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandTheme } from '../types';

interface FloatingShapesProps {
  color: string;
  accent: string;
  seed?: number;
}

const ITEMS = [
  { kind: 'circle', x: 10, y: 18, size: 28, speed: 0.03, phase: 0, useAccent: false },
  { kind: 'zigzag', x: 74, y: 8, size: 32, speed: 0.026, phase: 1.1, useAccent: false },
  { kind: 'cross', x: 14, y: 31, size: 22, speed: 0.035, phase: 2.3, useAccent: true },
  { kind: 'dots', x: 8, y: 45, size: 34, speed: 0.02, phase: 0.7, useAccent: true },
  { kind: 'triangle', x: 86, y: 24, size: 24, speed: 0.028, phase: 3.2, useAccent: false },
  { kind: 'star', x: 84, y: 54, size: 26, speed: 0.033, phase: 1.9, useAccent: true },
  { kind: 'circle', x: 88, y: 76, size: 22, speed: 0.024, phase: 4.1, useAccent: false },
  { kind: 'dot', x: 18, y: 82, size: 14, speed: 0.038, phase: 2.8, useAccent: true },
  { kind: 'dots', x: 78, y: 88, size: 30, speed: 0.022, phase: 5.0, useAccent: false },
] as const;

export const FloatingShapes: React.FC<FloatingShapesProps> = ({ color, accent, seed = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {ITEMS.map((item, i) => {
        const px = ((item.x + (seed * 13 * (i + 1)) % 17 - 8) / 100) * width;
        const py = ((item.y + (seed * 7 * (i + 1)) % 11 - 5) / 100) * height;
        const dy = Math.sin(frame * item.speed + item.phase + seed) * 14;
        const dx = Math.cos(frame * item.speed * 0.7 + item.phase) * 8;
        const rot = Math.sin(frame * item.speed * 0.8 + item.phase) * 18;
        const c = item.useAccent ? accent : color;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: px,
              top: py,
              opacity: item.useAccent ? 0.72 : 0.42,
              transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`,
            }}
          >
            {item.kind === 'circle' && (
              <svg width={item.size} height={item.size} viewBox="0 0 28 28">
                <circle cx="14" cy="14" r="10" fill="none" stroke={c} strokeWidth="3.2" />
              </svg>
            )}
            {item.kind === 'dot' && (
              <svg width={item.size} height={item.size} viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="6" fill={c} />
              </svg>
            )}
            {item.kind === 'triangle' && (
              <svg width={item.size} height={item.size} viewBox="0 0 28 28">
                <polygon
                  points="14,3 26,24 2,24"
                  fill="none"
                  stroke={c}
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {item.kind === 'cross' && (
              <svg width={item.size} height={item.size} viewBox="0 0 24 24">
                <path d="M5 5L19 19M19 5L5 19" stroke={c} strokeWidth="3.4" strokeLinecap="round" />
              </svg>
            )}
            {item.kind === 'zigzag' && (
              <svg width={item.size} height={item.size} viewBox="0 0 36 18">
                <path
                  d="M2 14 L9 4 L18 14 L27 4 L34 14"
                  fill="none"
                  stroke={c}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {item.kind === 'star' && (
              <svg width={item.size} height={item.size} viewBox="0 0 28 28">
                <path
                  d="M14 1 C15 10 18 13 27 14 C18 15 15 18 14 27 C13 18 10 15 1 14 C10 13 13 10 14 1 Z"
                  fill={c}
                />
              </svg>
            )}
            {item.kind === 'dots' && (
              <svg width={item.size} height={item.size} viewBox="0 0 30 30">
                {[4, 15, 26].map((cx) =>
                  [4, 15, 26].map((cy) => (
                    <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.3" fill={c} />
                  ))
                )}
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
};
