import React from 'react';
import { Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandTheme, IconName } from '../types';
import { popSpring } from '../utils/animation';
import { AppIcon } from '../utils/icons';
import { RotatingSeal } from './RotatingSeal';

interface PhoneMockupProps {
  theme: BrandTheme;
  videoSrc?: string;
  imageSrc?: string;
  label?: string;
  sealText?: string;
  orbitIcons?: IconName[];
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  theme,
  videoSrc,
  imageSrc,
  label = 'PRONTO PRA POSTAR',
  sealText = 'PRONTO PRA POSTAR',
  orbitIcons = ['heart', 'message', 'send'],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = popSpring(frame, fps, 2);
  const ty = interpolate(enter, [0, 1], [110, 0]);
  const rot = interpolate(enter, [0, 1], [-10, -4]) + Math.sin(frame * 0.06) * 1.2;

  const badgeCoords = [
    { left: -96, top: '26%' },
    { right: -92, top: '18%' },
    { left: -86, top: '52%' },
  ];

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Ícones sociais flutuando ao redor */}
      {orbitIcons.slice(0, 3).map((ic, idx) => {
        const pop = popSpring(frame, fps, 10 + idx * 5);
        const bob = Math.sin(frame * 0.09 + idx * 2) * 8;
        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              ...badgeCoords[idx],
              width: 84,
              height: 84,
              borderRadius: 24,
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 16px 32px rgba(10, 15, 45, 0.24)',
              transform: `scale(${pop}) translateY(${bob}px) rotate(${idx % 2 === 0 ? -8 : 8}deg)`,
              zIndex: 4,
            }}
          >
            <AppIcon name={ic} size={38} color={theme.primary} strokeWidth={2.4} />
          </div>
        );
      })}

      {/* Moldura do celular */}
      <div
        style={{
          width: 440,
          height: 850,
          borderRadius: 60,
          padding: 16,
          background: 'linear-gradient(145deg, #1E2030, #090A10)',
          boxShadow: '0 40px 90px rgba(8, 12, 46, 0.5), inset 0 0 0 3px rgba(255,255,255,0.12)',
          transform: `translateY(${ty}px) rotate(${rot}deg) scale(${interpolate(enter, [0, 1], [0.85, 1])})`,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Dynamic Island */}
        <div
          style={{
            position: 'absolute',
            top: 28,
            left: '50%',
            marginLeft: -56,
            width: 112,
            height: 30,
            borderRadius: 20,
            backgroundColor: '#07080E',
            zIndex: 5,
          }}
        />

        {/* Tela interna */}
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 46,
            overflow: 'hidden',
            background: `linear-gradient(160deg, ${theme.primary}, ${theme.primaryDark})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {videoSrc ? (
            <OffthreadVideo
              src={videoSrc.startsWith('http') ? videoSrc : staticFile(videoSrc)}
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : imageSrc ? (
            <Img
              src={imageSrc.startsWith('http') ? imageSrc : staticFile(imageSrc)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                padding: 36,
                textAlign: 'center',
                color: '#FFFFFF',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  padding: '8px 18px',
                  borderRadius: 99,
                  backgroundColor: theme.accent,
                  color: theme.accentText,
                  fontWeight: 900,
                  fontSize: 20,
                  marginBottom: 22,
                }}
              >
                9:16 • 1080×1920
              </div>
              <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.03em' }}>
                {label}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selo giratório no canto inferior direito */}
      {sealText && (
        <div style={{ position: 'absolute', right: -56, bottom: 26, zIndex: 6 }}>
          <RotatingSeal text={sealText} icon="check" theme={theme} size={172} delay={12} />
        </div>
      )}
    </div>
  );
};
