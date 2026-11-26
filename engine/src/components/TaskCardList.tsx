import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandTheme, TaskCardItem } from '../types';
import { popSpring } from '../utils/animation';
import { AppIcon } from '../utils/icons';

interface TaskCardListProps {
  cards: TaskCardItem[];
  theme: BrandTheme;
  cursorClick?: boolean;
  compact?: boolean;
}

export const TaskCardList: React.FC<TaskCardListProps> = ({
  cards,
  theme,
  cursorClick = false,
  compact = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animação do cursor clicando no primeiro card
  const cursorAppear = popSpring(frame, fps, 10);
  const cursorX = interpolate(frame, [10, 26], [360, 180], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorY = interpolate(frame, [10, 26], [190, 56], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const isClicking = frame >= 26 && frame <= 32;
  const clickScale = isClicking ? 0.84 : 1;

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? 16 : 20,
        width: '100%',
        maxWidth: compact ? 560 : 680,
      }}
    >
      {cards.map((card, idx) => {
        const enterAt = card.enterFrame ?? idx * 10;
        const enter = popSpring(frame, fps, enterAt);
        const ty = interpolate(enter, [0, 1], [36, 0]);
        const opacity = interpolate(enter, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });

        // Risco X vermelho animado
        const crossStart = card.crossFrame ?? enterAt + 8;
        const line1 = interpolate(frame, [crossStart, crossStart + 7], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const line2 = interpolate(frame, [crossStart + 5, crossStart + 12], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        const clickedCardScale = cursorClick && idx === 0 && isClicking ? 0.96 : 1;

        return (
          <div
            key={idx}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              backgroundColor: '#FFFFFF',
              borderRadius: 28,
              padding: compact ? '18px 24px' : '22px 28px',
              boxShadow: '0 16px 42px rgba(22, 27, 68, 0.14)',
              border: '1px solid rgba(47, 85, 245, 0.08)',
              opacity,
              transform: `translateY(${ty}px) scale(${clickedCardScale})`,
            }}
          >
            {/* Tile azul com ícone */}
            <div
              style={{
                width: compact ? 68 : 78,
                height: compact ? 68 : 78,
                borderRadius: 20,
                background: `linear-gradient(145deg, ${theme.primary}, ${theme.primaryDark})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: `0 10px 22px ${theme.primary}44`,
              }}
            >
              <AppIcon name={card.icon} size={compact ? 34 : 38} color="#FFFFFF" strokeWidth={2.3} />
            </div>

            {/* Textos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 800,
                  fontSize: compact ? 30 : 34,
                  letterSpacing: '-0.025em',
                  color: '#16172B',
                  lineHeight: 1.1,
                }}
              >
                {card.title}
              </div>
              {card.subtitle && (
                <div
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: 500,
                    fontSize: compact ? 20 : 22,
                    color: '#6B708A',
                  }}
                >
                  {card.subtitle}
                </div>
              )}
            </div>

            {/* Risco X vermelho */}
            {card.crossed && (
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{
                  position: 'absolute',
                  inset: '-8px -10px',
                  width: 'calc(100% + 20px)',
                  height: 'calc(100% + 16px)',
                  pointerEvents: 'none',
                  overflow: 'visible',
                }}
              >
                <line
                  x1="6"
                  y1="14"
                  x2="94"
                  y2="86"
                  stroke={theme.danger}
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  strokeDasharray="140"
                  strokeDashoffset={140 * (1 - line1)}
                />
                <line
                  x1="94"
                  y1="14"
                  x2="6"
                  y2="86"
                  stroke={theme.danger}
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  strokeDasharray="140"
                  strokeDashoffset={140 * (1 - line2)}
                />
              </svg>
            )}
          </div>
        );
      })}

      {/* Ponteiro de cursor animado clicando */}
      {cursorClick && (
        <div
          style={{
            position: 'absolute',
            left: cursorX,
            top: cursorY,
            opacity: cursorAppear,
            transform: `scale(${clickScale})`,
            pointerEvents: 'none',
            zIndex: 10,
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.28))',
          }}
        >
          <svg width="62" height="62" viewBox="0 0 36 36">
            <path
              d="M6 3 L6 29 L13 22 L19 33 L23 31 L17 20 L27 20 Z"
              fill="#11131F"
              stroke="#FFFFFF"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
};
