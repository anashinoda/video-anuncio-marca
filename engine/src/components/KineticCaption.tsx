import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandTheme, WordTiming } from '../types';
import { computeHighlightFlags, resolveWordTimings } from '../utils/animation';

interface KineticCaptionProps {
  text: string;
  words?: WordTiming[];
  highlights?: string[];
  durationInFrames: number;
  theme: BrandTheme;
  textColor: string;
  align?: 'left' | 'center';
  fontSize?: number;
  maxWidth?: number;
  /** Modo UGC: mostra apenas janela de 3-4 palavras com sombra forte sobre o vídeo */
  mode?: 'motion' | 'ugc';
}

export const KineticCaption: React.FC<KineticCaptionProps> = ({
  text,
  words,
  highlights = [],
  durationInFrames,
  theme,
  textColor,
  align = 'left',
  fontSize = 78,
  maxWidth = 940,
  mode = 'motion',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const resolved = resolveWordTimings(text, durationInFrames, words);
  const hlFlags = computeHighlightFlags(
    resolved.map((w) => w.word),
    highlights
  );

  if (mode === 'ugc') {
    // Janela deslizante de 4 palavras estilo Reels/TikTok dinâmico
    const chunkSize = 4;
    let activeIdx = resolved.findIndex((w) => frame >= w.startFrame && frame <= w.endFrame + 2);
    if (activeIdx < 0) {
      activeIdx = resolved.reduce((acc, w, idx) => (frame >= w.startFrame ? idx : acc), 0);
    }
    const chunkStart = Math.floor(activeIdx / chunkSize) * chunkSize;
    const chunk = resolved.slice(chunkStart, chunkStart + chunkSize);

    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px 16px',
          maxWidth,
          margin: '0 auto',
          lineHeight: 1.15,
        }}
      >
        {chunk.map((item, localIdx) => {
          const globalIdx = chunkStart + localIdx;
          const isCurrent = globalIdx === activeIdx;
          const isHighlighted = hlFlags[globalIdx];
          const pop = spring({
            frame: Math.max(0, frame - item.startFrame),
            fps,
            config: { damping: 14, stiffness: 260, mass: 0.6 },
          });
          const scale = isCurrent ? interpolate(pop, [0, 1], [0.85, 1.07]) : 1;

          return (
            <span
              key={globalIdx}
              style={{
                display: 'inline-block',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 900,
                fontSize: fontSize * 0.86,
                letterSpacing: '-0.03em',
                color: isHighlighted || isCurrent ? theme.accentText : '#FFFFFF',
                backgroundColor: isHighlighted
                  ? theme.accent
                  : isCurrent
                    ? theme.accent
                    : 'rgba(10, 12, 24, 0.52)',
                padding: '6px 18px',
                borderRadius: 16,
                transform: `scale(${scale})`,
                textShadow:
                  isHighlighted || isCurrent ? 'none' : '0 4px 16px rgba(0,0,0,0.75)',
                boxShadow:
                  isHighlighted || isCurrent
                    ? '0 10px 26px rgba(0,0,0,0.28)'
                    : '0 4px 14px rgba(0,0,0,0.25)',
              }}
            >
              {item.word}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        alignItems: 'baseline',
        rowGap: Math.round(fontSize * 0.14),
        columnGap: Math.round(fontSize * 0.24),
        maxWidth,
        width: '100%',
        lineHeight: 1.08,
      }}
    >
      {resolved.map((item, i) => {
        const elapsed = frame - item.startFrame;
        const opacity = interpolate(elapsed, [-1, 4], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const blur = interpolate(elapsed, [0, 5], [10, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const ty = interpolate(elapsed, [0, 5], [14, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const isHL = hlFlags[i];
        const hlSweep = isHL
          ? spring({
              frame: Math.max(0, elapsed),
              fps,
              config: { damping: 16, stiffness: 210, mass: 0.7 },
            })
          : 0;

        if (elapsed < -2) {
          return (
            <span
              key={i}
              style={{
                opacity: 0,
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 900,
                fontSize,
                letterSpacing: '-0.035em',
                padding: isHL ? '2px 14px' : '2px 0',
              }}
            >
              {item.word}
            </span>
          );
        }

        return (
          <span
            key={i}
            style={{
              position: 'relative',
              display: 'inline-block',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 900,
              fontSize,
              letterSpacing: '-0.035em',
              color: isHL ? theme.accentText : textColor,
              padding: isHL ? '2px 16px 6px' : '2px 0',
              opacity,
              transform: `translateY(${ty}px)`,
              filter: blur > 0.4 ? `blur(${blur}px)` : undefined,
            }}
          >
            {isHL && (
              <span
                style={{
                  position: 'absolute',
                  inset: '2px -2px 2px -2px',
                  backgroundColor: theme.accent,
                  borderRadius: Math.round(fontSize * 0.2),
                  transformOrigin: 'left center',
                  transform: `scaleX(${Math.min(1, hlSweep)})`,
                  zIndex: -1,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                }}
              />
            )}
            {item.word}
          </span>
        );
      })}
    </div>
  );
};
