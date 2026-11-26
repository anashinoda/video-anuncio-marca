import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandTheme, IconName } from '../types';
import { popSpring } from '../utils/animation';
import { AppIcon } from '../utils/icons';

interface RotatingSealProps {
  text: string;
  icon?: IconName;
  theme: BrandTheme;
  size?: number;
  delay?: number;
}

export const RotatingSeal: React.FC<RotatingSealProps> = ({
  text,
  icon = 'bot',
  theme,
  size = 186,
  delay = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = popSpring(frame, fps, delay);
  const rotation = frame * 1.4;
  const repeated = `${text.toUpperCase()} • ${text.toUpperCase()} • ${text.toUpperCase()} • `;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: theme.accent,
        color: theme.accentText,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.22)',
        transform: `scale(${scale})`,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        style={{
          position: 'absolute',
          inset: 0,
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <defs>
          <path
            id={`seal-circle-${text.replace(/\s+/g, '-')}`}
            d="M 100, 100 m -72, 0 a 72,72 0 1,1 144,0 a 72,72 0 1,1 -144,0"
          />
        </defs>
        <text
          fill={theme.accentText}
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="900"
          fontSize="16"
          letterSpacing="2.4"
        >
          <textPath href={`#seal-circle-${text.replace(/\s+/g, '-')}`}>{repeated}</textPath>
        </text>
      </svg>

      <div
        style={{
          width: size * 0.42,
          height: size * 0.42,
          borderRadius: '50%',
          backgroundColor: 'rgba(16, 18, 30, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AppIcon name={icon} size={Math.round(size * 0.24)} color={theme.accentText} strokeWidth={2.5} />
      </div>
    </div>
  );
};
