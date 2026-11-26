import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandTheme } from '../types';
import { popSpring } from '../utils/animation';

interface TerminalMockupProps {
  title?: string;
  command: string;
  outputs?: string[];
  theme: BrandTheme;
}

export const TerminalMockup: React.FC<TerminalMockupProps> = ({
  title = 'claude — ~/videos',
  command,
  outputs = [],
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = popSpring(frame, fps, 0);
  const charsPerFrame = 0.72;
  const typedCount = Math.min(command.length, Math.max(0, Math.floor((frame - 6) * charsPerFrame)));
  const typed = command.slice(0, typedCount);
  const doneTypingFrame = 6 + Math.ceil(command.length / charsPerFrame);
  const cursorVisible = Math.floor(frame / 10) % 2 === 0 || typedCount < command.length;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 860,
        borderRadius: 30,
        overflow: 'hidden',
        backgroundColor: '#12141E',
        boxShadow: '0 32px 72px rgba(8, 12, 42, 0.42), inset 0 0 0 2px rgba(255,255,255,0.08)',
        transform: `scale(${interpolate(enter, [0, 1], [0.88, 1])}) translateY(${interpolate(enter, [0, 1], [32, 0])}px)`,
        fontFamily: "'JetBrains Mono', 'SF Mono', Consolas, monospace",
      }}
    >
      {/* Barra superior estilo macOS */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '18px 24px',
          backgroundColor: '#1C1F2E',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#FF5F57' }} />
        <span style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#FEBC2E' }} />
        <span style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#28C840' }} />
        <span
          style={{
            marginLeft: 12,
            color: 'rgba(255,255,255,0.52)',
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          {title}
        </span>
      </div>

      {/* Corpo do terminal */}
      <div style={{ padding: '36px 34px 42px', minHeight: 280 }}>
        <div
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1.35,
            wordBreak: 'break-word',
          }}
        >
          <span style={{ color: theme.accent, marginRight: 16 }}>&gt;</span>
          <span>{typed}</span>
          <span
            style={{
              display: 'inline-block',
              width: 22,
              height: 44,
              backgroundColor: theme.accent,
              verticalAlign: 'text-bottom',
              marginLeft: 6,
              opacity: cursorVisible ? 1 : 0,
            }}
          />
        </div>

        {/* Linhas de output */}
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {outputs.map((line, idx) => {
            const appearAt = doneTypingFrame + 6 + idx * 10;
            const op = interpolate(frame, [appearAt, appearAt + 6], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const ty = interpolate(frame, [appearAt, appearAt + 6], [12, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div
                key={idx}
                style={{
                  fontSize: 24,
                  color: 'rgba(218, 224, 255, 0.78)',
                  opacity: op,
                  transform: `translateY(${ty}px)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <span style={{ color: theme.accent, fontWeight: 900 }}>✳</span>
                <span>{line}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
