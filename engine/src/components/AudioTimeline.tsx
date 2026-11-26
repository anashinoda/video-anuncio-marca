import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandTheme } from '../types';
import { popSpring } from '../utils/animation';

interface AudioTimelineProps {
  theme: BrandTheme;
  durationInFrames: number;
  showTimeline?: boolean;
}

const BAR_COUNT = 26;

export const AudioTimeline: React.FC<AudioTimelineProps> = ({
  theme,
  durationInFrames,
  showTimeline = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = popSpring(frame, fps, 3);
  const playheadPct = interpolate(frame, [0, Math.max(15, durationInFrames - 6)], [8, 92], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 880,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 44,
        transform: `scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
      }}
    >
      {/* Onda sonora */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          height: 170,
          width: '100%',
        }}
      >
        {Array.from({ length: BAR_COUNT }, (_, i) => {
          const pct = (i / BAR_COUNT) * 100;
          const active = pct <= playheadPct + 8;
          const wave =
            Math.abs(Math.sin(frame * 0.22 + i * 0.65)) * 0.65 +
            Math.abs(Math.cos(frame * 0.14 + i * 1.1)) * 0.35;
          const barH = active ? 26 + wave * 134 : 16;
          const isAccent = i % 3 === 1;

          return (
            <div
              key={i}
              style={{
                width: 14,
                height: barH,
                borderRadius: 99,
                backgroundColor: active
                  ? isAccent
                    ? theme.accent
                    : theme.primary
                  : 'rgba(134, 152, 220, 0.26)',
              }}
            />
          );
        })}
      </div>

      {/* Mini timeline de edição 3 trilhas */}
      {showTimeline && (
        <div
          style={{
            position: 'relative',
            width: '100%',
            backgroundColor: '#121524',
            borderRadius: 26,
            padding: '24px 26px',
            boxShadow: '0 24px 54px rgba(10, 14, 42, 0.32)',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {/* Trilha de Vídeo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ width: 28, color: 'rgba(255,255,255,0.55)', fontWeight: 800, fontSize: 20 }}>
              ▤
            </span>
            <div style={{ flex: 1, display: 'flex', gap: 10, height: 38 }}>
              <div style={{ flex: 2.2, borderRadius: 10, backgroundColor: theme.primary }} />
              <div style={{ flex: 1.5, borderRadius: 10, backgroundColor: `${theme.primary}CC` }} />
              <div style={{ flex: 2.6, borderRadius: 10, backgroundColor: theme.primary }} />
            </div>
          </div>

          {/* Trilha de Texto/Legenda */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ width: 28, color: 'rgba(255,255,255,0.55)', fontWeight: 900, fontSize: 22 }}>
              T
            </span>
            <div style={{ flex: 1, display: 'flex', gap: 10, height: 38 }}>
              <div style={{ flex: 1.4, borderRadius: 10, backgroundColor: theme.accent }} />
              <div style={{ flex: 1.8, borderRadius: 10, backgroundColor: theme.accent }} />
              <div style={{ flex: 1.2, borderRadius: 10, backgroundColor: theme.accent }} />
              <div style={{ flex: 1.6, borderRadius: 10, backgroundColor: theme.accent }} />
            </div>
          </div>

          {/* Trilha de Áudio */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ width: 28, color: 'rgba(255,255,255,0.55)', fontWeight: 800, fontSize: 20 }}>
              ∿
            </span>
            <div
              style={{
                flex: 1,
                height: 36,
                borderRadius: 10,
                backgroundColor: 'rgba(134, 162, 255, 0.22)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '0 8px',
              }}
            >
              {Array.from({ length: 46 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${30 + ((i * 37) % 60)}%`,
                    borderRadius: 4,
                    backgroundColor: 'rgba(134, 162, 255, 0.65)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Agulha de reprodução (playhead) */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              bottom: 12,
              left: `${playheadPct}%`,
              width: 5,
              borderRadius: 99,
              backgroundColor: '#FFFFFF',
              boxShadow: '0 0 18px rgba(255,255,255,0.85)',
            }}
          />
        </div>
      )}
    </div>
  );
};
