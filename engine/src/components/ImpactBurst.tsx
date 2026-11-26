import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandTheme, IconName, WordTiming } from '../types';
import { popSpring } from '../utils/animation';
import { AppIcon } from '../utils/icons';
import { KineticCaption } from './KineticCaption';

interface ImpactBurstProps {
  text: string;
  words?: WordTiming[];
  highlights?: string[];
  durationInFrames: number;
  icon?: IconName;
  theme: BrandTheme;
  textColor: string;
}

export const ImpactBurst: React.FC<ImpactBurstProps> = ({
  text,
  words,
  highlights,
  durationInFrames,
  icon,
  theme,
  textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const burstScale = popSpring(frame, fps, 0);
  const ticks = Array.from({ length: 16 }, (_, i) => i * (360 / 16));
  const tickRot = frame * 0.45;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 34,
        padding: '0 64px',
      }}
    >
      {/* Anel de raios radiais (estilo punchline dos Reels) */}
      <svg
        width="820"
        height="820"
        viewBox="0 0 820 820"
        style={{
          position: 'absolute',
          opacity: interpolate(burstScale, [0, 1], [0, 0.55]),
          transform: `scale(${interpolate(burstScale, [0, 1], [0.65, 1])}) rotate(${tickRot}deg)`,
          pointerEvents: 'none',
        }}
      >
        {ticks.map((deg) => (
          <line
            key={deg}
            x1="410"
            y1="52"
            x2="410"
            y2="98"
            stroke={textColor}
            strokeWidth="7"
            strokeLinecap="round"
            transform={`rotate(${deg} 410 410)`}
          />
        ))}
      </svg>

      {icon && (
        <div
          style={{
            transform: `scale(${popSpring(frame, fps, 1)})`,
            zIndex: 2,
          }}
        >
          <AppIcon name={icon} size={96} color={textColor} strokeWidth={2.4} />
        </div>
      )}

      <div style={{ zIndex: 2, width: '100%' }}>
        <KineticCaption
          text={text}
          words={words}
          highlights={highlights}
          durationInFrames={durationInFrames}
          theme={theme}
          textColor={textColor}
          align="center"
          fontSize={text.length < 18 ? 114 : 94}
          maxWidth={920}
        />
      </div>
    </div>
  );
};
