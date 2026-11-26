import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { BrandTheme } from '../types';

interface ConfettiBurstProps {
  theme: BrandTheme;
  startFrame?: number;
}

const PIECES = Array.from({ length: 28 }, (_, i) => {
  const angle = (i / 28) * Math.PI * 2 + (i % 3) * 0.17;
  const speed = 260 + (i * 73) % 320;
  const size = 12 + (i % 4) * 5;
  const isRect = i % 2 === 0;
  return { angle, speed, size, isRect, spin: (i % 2 === 0 ? 1 : -1) * (180 + i * 25) };
});

export const ConfettiBurst: React.FC<ConfettiBurstProps> = ({ theme, startFrame = 4 }) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, (frame - startFrame) / 30);
  if (frame < startFrame) return null;

  const colors = [theme.accent, theme.primary, '#FF5A5F', '#FFD166', '#FFFFFF'];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 8,
      }}
    >
      {PIECES.map((p, idx) => {
        const vx = Math.cos(p.angle) * p.speed;
        const vy = Math.sin(p.angle) * p.speed - 220;
        const x = vx * t;
        const y = vy * t + 480 * t * t;
        const opacity = interpolate(t, [0, 0.1, 0.9, 1.5], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: p.size,
              height: p.isRect ? p.size * 0.55 : p.size,
              borderRadius: p.isRect ? 4 : '50%',
              backgroundColor: colors[idx % colors.length],
              opacity,
              transform: `translate(${x}px, ${y}px) rotate(${p.spin * t}deg)`,
            }}
          />
        );
      })}
    </div>
  );
};
