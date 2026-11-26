import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { BackgroundVariant, BrandTheme } from '../types';
import { getBackgroundStyle, popSpring } from '../utils/animation';

interface SceneGridPreviewProps {
  items: Array<{
    bg: BackgroundVariant;
    title: string;
    subtitle?: string;
    imageSrc?: string;
  }>;
  theme: BrandTheme;
}

export const SceneGridPreview: React.FC<SceneGridPreviewProps> = ({ items, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cols = items.length <= 3 ? items.length : 3;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 20,
        width: '100%',
        maxWidth: 920,
      }}
    >
      {items.map((item, idx) => {
        const pop = popSpring(frame, fps, 2 + idx * 4);
        const bgInfo = getBackgroundStyle(item.bg, theme);
        return (
          <div
            key={idx}
            style={{
              aspectRatio: '9 / 15',
              borderRadius: 24,
              overflow: 'hidden',
              background: bgInfo.background,
              border: '3px solid rgba(255,255,255,0.65)',
              boxShadow: '0 18px 36px rgba(15, 20, 55, 0.16)',
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transform: `scale(${pop}) translateY(${interpolate(pop, [0, 1], [34, 0])}px)`,
            }}
          >
            <div
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 900,
                fontSize: 24,
                lineHeight: 1.15,
                color: bgInfo.textColor,
              }}
            >
              {item.title}
            </div>

            {item.imageSrc ? (
              <Img
                src={item.imageSrc.startsWith('http') ? item.imageSrc : staticFile(item.imageSrc)}
                style={{
                  width: '100%',
                  height: '58%',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <div
                style={{
                  backgroundColor: bgInfo.isDark ? 'rgba(255,255,255,0.12)' : '#FFFFFF',
                  borderRadius: 14,
                  padding: '12px 14px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 16,
                  fontWeight: 700,
                  color: bgInfo.isDark ? '#FFFFFF' : theme.primary,
                }}
              >
                {item.subtitle ?? `Cena #${idx + 1}`}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
