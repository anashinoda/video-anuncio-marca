import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandTheme, IconName } from '../types';
import { popSpring } from '../utils/animation';
import { AppIcon } from '../utils/icons';

interface CTABannerProps {
  keyword: string;
  icon?: IconName;
  theme: BrandTheme;
}

export const CTABanner: React.FC<CTABannerProps> = ({ keyword, icon = 'message', theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = popSpring(frame, fps, 4);
  const pulse = 1 + Math.sin(frame * 0.2) * 0.028;
  const arrowDraw = interpolate(frame, [10, 26], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      {/* Anéis concêntricos sutis pulsando */}
      {[340, 520, 700].map((size, i) => {
        const ringScale = 0.96 + Math.sin(frame * 0.07 - i * 0.9) * 0.04;
        return (
          <div
            key={size}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.16)',
              transform: `scale(${ringScale})`,
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* Pílula preta de CTA */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 24,
          backgroundColor: '#0E1019',
          color: '#FFFFFF',
          padding: '28px 58px',
          borderRadius: 999,
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35), inset 0 0 0 2px rgba(255,255,255,0.1)',
          transform: `scale(${pop * pulse})`,
          zIndex: 4,
        }}
      >
        <AppIcon name={icon} size={52} color="#FFFFFF" strokeWidth={2.5} />
        <span
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 900,
            fontSize: 64,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
          }}
        >
          {keyword}
        </span>
      </div>

      {/* Duas setas curvas na cor marca-texto apontando para o CTA */}
      <svg
        width="820"
        height="260"
        viewBox="0 0 820 260"
        style={{
          position: 'absolute',
          top: 56,
          pointerEvents: 'none',
          zIndex: 3,
          overflow: 'visible',
        }}
      >
        <path
          d="M 110 230 C 45 140, 60 55, 135 28"
          fill="none"
          stroke={theme.accent}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray="320"
          strokeDashoffset={320 * (1 - arrowDraw)}
        />
        <path
          d="M 112 18 L 140 28 L 122 52"
          fill="none"
          stroke={theme.accent}
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={arrowDraw > 0.85 ? 1 : 0}
        />

        <path
          d="M 710 230 C 775 140, 760 55, 685 28"
          fill="none"
          stroke={theme.accent}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray="320"
          strokeDashoffset={320 * (1 - arrowDraw)}
        />
        <path
          d="M 708 18 L 680 28 L 698 52"
          fill="none"
          stroke={theme.accent}
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={arrowDraw > 0.85 ? 1 : 0}
        />
      </svg>
    </div>
  );
};
