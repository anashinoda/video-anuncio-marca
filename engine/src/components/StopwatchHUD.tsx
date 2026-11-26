import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandTheme } from '../types';
import { popSpring } from '../utils/animation';

interface StopwatchHUDProps {
  label: string;
  targetSeconds: number;
  totalFrames: number;
  freezeAtFrame?: number;
  theme: BrandTheme;
}

function formatClock(sec: number): { main: string; centis: string } {
  const mins = Math.floor(sec / 60);
  const rem = Math.floor(sec % 60);
  const cs = Math.floor((sec % 1) * 100);
  return {
    main: `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`,
    centis: `.${String(cs).padStart(2, '0')}`,
  };
}

export const StopwatchHUD: React.FC<StopwatchHUDProps> = ({
  label,
  targetSeconds,
  totalFrames,
  freezeAtFrame,
  theme,
}) => {
  const frame = useCurrentFrame();
  const stopAt = freezeAtFrame ?? Math.floor(totalFrames * 0.82);
  const frozen = frame >= stopAt;
  const currentSec = interpolate(frame, [0, Math.max(1, stopAt)], [0, targetSeconds], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const { main, centis } = formatClock(currentSec);
  const blink = Math.floor(frame / 12) % 2 === 0;

  return (
    <div
      style={{
        position: 'absolute',
        top: 52,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 25,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        backgroundColor: frozen ? theme.accent : 'rgba(18, 20, 32, 0.88)',
        color: frozen ? theme.accentText : '#FFFFFF',
        padding: '14px 28px',
        borderRadius: 999,
        boxShadow: '0 14px 36px rgba(0, 0, 0, 0.26)',
        border: frozen ? 'none' : '1px solid rgba(255,255,255,0.14)',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          backgroundColor: frozen ? theme.accentText : '#FF3B30',
          opacity: frozen || blink ? 1 : 0.25,
        }}
      />
      <span
        style={{
          fontWeight: 900,
          fontSize: 34,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.02em',
        }}
      >
        {main}
        <span style={{ fontSize: 22, opacity: 0.65 }}>{centis}</span>
      </span>
      <span
        style={{
          fontSize: 18,
          fontWeight: 700,
          opacity: 0.78,
          maxWidth: 150,
          lineHeight: 1.1,
        }}
      >
        {label}
      </span>
    </div>
  );
};

interface BigMetricCardProps {
  label?: string;
  value?: string;
  fromNumber?: number;
  toNumber?: number;
  prefix?: string;
  suffix?: string;
  theme: BrandTheme;
}

export const BigMetricCard: React.FC<BigMetricCardProps> = ({
  label,
  value,
  fromNumber,
  toNumber,
  prefix = '',
  suffix = '',
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = popSpring(frame, fps, 2);

  let display = value ?? '';
  if (typeof fromNumber === 'number' && typeof toNumber === 'number') {
    const val = Math.round(
      interpolate(frame, [2, 22], [fromNumber, toNumber], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    );
    display = `${prefix}${val}${suffix}`;
  }

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 34,
        padding: '28px 46px',
        boxShadow: '0 24px 56px rgba(15, 22, 60, 0.18)',
        transform: `scale(${pop})`,
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 6,
      }}
    >
      {label && (
        <span
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 24,
            color: '#6C7088',
          }}
        >
          {label}
        </span>
      )}
      <span
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 900,
          fontSize: 122,
          lineHeight: 0.96,
          letterSpacing: '-0.05em',
          fontVariantNumeric: 'tabular-nums',
          color: theme.accent,
          textShadow: '0 4px 0 rgba(16, 18, 30, 0.08)',
        }}
      >
        {display}
      </span>
    </div>
  );
};
