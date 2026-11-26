import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandTheme, IconName } from '../types';
import { popSpring } from '../utils/animation';
import { AppIcon } from '../utils/icons';

interface StickerCharacterProps {
  src?: string;
  theme: BrandTheme;
  height?: number;
  orbitIcons?: IconName[];
  groundLine?: boolean;
  delay?: number;
}

/**
 * Fallback vetorial limpo quando o usuário ainda está testando o demo sem enviar fotos do mascote.
 */
const DefaultMascotPlaceholder: React.FC<{ theme: BrandTheme; height: number }> = ({ theme, height }) => (
  <svg
    width={height * 0.62}
    height={height}
    viewBox="0 0 260 420"
    style={{ filter: 'drop-shadow(0 16px 26px rgba(10,14,40,0.22))' }}
  >
    {/* Borda branca de figurinha */}
    <g stroke="#FFFFFF" strokeWidth="22" strokeLinejoin="round" strokeLinecap="round" fill="#FFFFFF">
      <circle cx="130" cy="112" r="68" />
      <rect x="76" y="182" width="108" height="122" rx="34" />
      <rect x="82" y="294" width="38" height="96" rx="18" />
      <rect x="140" y="294" width="38" height="96" rx="18" />
    </g>
    {/* Corpo estilizado */}
    <rect x="82" y="294" width="38" height="96" rx="18" fill="#2A2D3E" stroke="#16172B" strokeWidth="5" />
    <rect x="140" y="294" width="38" height="96" rx="18" fill="#2A2D3E" stroke="#16172B" strokeWidth="5" />
    <rect x="76" y="182" width="108" height="122" rx="34" fill="#181A2C" stroke="#16172B" strokeWidth="5" />
    {/* Crachá / logo no peito */}
    <rect x="108" y="216" width="44" height="28" rx="8" fill={theme.accent} />
    <text
      x="130"
      y="236"
      textAnchor="middle"
      fontFamily="Inter, sans-serif"
      fontWeight="900"
      fontSize="16"
      fill={theme.accentText}
    >
      &lt;/&gt;
    </text>
    {/* Cabeça */}
    <circle cx="130" cy="114" r="64" fill="#F2C3A0" stroke="#16172B" strokeWidth="5" />
    {/* Boné da marca */}
    <path d="M66 102 C68 52 192 52 194 102 Z" fill="#F6F7FB" stroke="#16172B" strokeWidth="5" />
    <path d="M58 102 Q130 88 206 104" fill="none" stroke="#16172B" strokeWidth="8" strokeLinecap="round" />
    <text
      x="130"
      y="86"
      textAnchor="middle"
      fontFamily="Inter, sans-serif"
      fontWeight="900"
      fontSize="18"
      fill={theme.primary}
    >
      {theme.name.slice(0, 8)}
    </text>
    {/* Olhos e sorriso */}
    <circle cx="108" cy="122" r="6" fill="#16172B" />
    <circle cx="152" cy="122" r="6" fill="#16172B" />
    <path d="M112 146 Q130 160 148 146" fill="none" stroke="#16172B" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export const StickerCharacter: React.FC<StickerCharacterProps> = ({
  src,
  theme,
  height = 760,
  orbitIcons = [],
  groundLine = false,
  delay = 2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = popSpring(frame, fps, delay);
  const scale = interpolate(enter, [0, 1], [0.76, 1]);
  const ty = interpolate(enter, [0, 1], [80, 0]);
  const idleY = Math.sin((frame - delay) * 0.08) * 6;
  const idleRot = Math.sin((frame - delay) * 0.05) * 1.1;

  const orbitPositions = [
    { left: -120, top: '26%' },
    { right: -120, top: '34%' },
    { left: -100, top: '58%' },
    { right: -100, top: '62%' },
  ];

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      {/* Badges de ícones orbitando */}
      {orbitIcons.slice(0, 4).map((icon, idx) => {
        const pos = orbitPositions[idx];
        const iconPop = popSpring(frame, fps, delay + 6 + idx * 5);
        const bob = Math.sin(frame * 0.09 + idx * 1.6) * 8;
        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              ...pos,
              width: 86,
              height: 86,
              borderRadius: 24,
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 14px 30px rgba(15, 23, 66, 0.16)',
              transform: `scale(${iconPop}) translateY(${bob}px) rotate(${idx % 2 === 0 ? -6 : 6}deg)`,
              zIndex: 4,
            }}
          >
            <AppIcon name={icon} size={40} color={theme.primary} strokeWidth={2.4} />
          </div>
        );
      })}

      {/* Personagem figurinha */}
      <div
        style={{
          transform: `translateY(${ty + idleY}px) scale(${scale}) rotate(${idleRot}deg)`,
          transformOrigin: 'bottom center',
          zIndex: 2,
        }}
      >
        {src ? (
          <Img
            src={src.startsWith('http') ? src : staticFile(src)}
            style={{
              height,
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 18px 28px rgba(10,14,40,0.22))',
            }}
          />
        ) : (
          <DefaultMascotPlaceholder theme={theme} height={height} />
        )}
      </div>

      {/* Linha de chão minimalista */}
      {groundLine && (
        <div
          style={{
            width: '78%',
            height: 4,
            borderRadius: 99,
            backgroundColor: 'rgba(130, 140, 175, 0.35)',
            marginTop: -6,
            transform: `scaleX(${enter})`,
          }}
        />
      )}
    </div>
  );
};
