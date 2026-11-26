import React from 'react';
import { Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandTheme, SceneSpec } from '../types';
import { popSpring } from '../utils/animation';
import { KineticCaption } from './KineticCaption';

interface UGCSceneProps {
  scene: SceneSpec;
  theme: BrandTheme;
}

/**
 * Cena para Estilo B (UGC) e gancho humano do Estilo C (Híbrido):
 * - Vídeo real full-bleed com zoom dinâmico sutil (punch-in)
 * - Gancho fixo no topo (hook pill) fora da área de UI do Instagram/TikTok
 * - Selo de destaque flutuante ("FEITO COM IA", "TESTADO", etc.)
 * - Legenda karaoke palavra por palavra na zona segura inferior
 * - Card opcional de produto/preço para e-commerce/anúncio
 */
export const UGCScene: React.FC<UGCSceneProps> = ({ scene, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Zoom dinâmico suave para dar ritmo de edição sem parecer estático
  const zoom = interpolate(frame, [0, scene.durationInFrames], [1.0, 1.07], {
    extrapolateRight: 'clamp',
  });
  const hookPop = popSpring(frame, fps, 2);
  const badgePop = popSpring(frame, fps, 8);
  const cardPop = popSpring(frame, fps, 14);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#0A0B14',
      }}
    >
      {/* Vídeo UGC ou fundo placeholder quando ainda em teste */}
      {scene.ugcVideoSrc ? (
        <OffthreadVideo
          src={
            scene.ugcVideoSrc.startsWith('http')
              ? scene.ugcVideoSrc
              : staticFile(scene.ugcVideoSrc)
          }
          startFrom={Math.round((scene.ugcStartFromSec ?? 0) * fps)}
          muted={scene.ugcMuted ?? false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${zoom})`,
          }}
        />
      ) : scene.characterSrc ? (
        <Img
          src={
            scene.characterSrc.startsWith('http')
              ? scene.characterSrc
              : staticFile(scene.characterSrc)
          }
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${zoom})`,
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `radial-gradient(circle at 50% 35%, ${theme.primary}66, #0A0C18 75%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.42)',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 32,
            fontWeight: 800,
          }}
        >
          [Clipe UGC da câmera — adicione ugcVideoSrc]
        </div>
      )}

      {/* Gradientes de leitura no topo e rodapé para legibilidade perfeita */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(6,8,18,0.52) 0%, rgba(6,8,18,0) 26%, rgba(6,8,18,0) 58%, rgba(6,8,18,0.78) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Pílula de gancho no topo (zona segura) */}
      {scene.ugcHookPill && (
        <div
          style={{
            position: 'absolute',
            top: 165,
            left: '50%',
            transform: `translateX(-50%) scale(${hookPop})`,
            backgroundColor: '#FFFFFF',
            color: '#121324',
            padding: '16px 34px',
            borderRadius: 22,
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 900,
            fontSize: 34,
            letterSpacing: '-0.025em',
            boxShadow: '0 16px 36px rgba(0,0,0,0.35)',
            maxWidth: '86%',
            textAlign: 'center',
            zIndex: 6,
          }}
        >
          {scene.ugcHookPill}
        </div>
      )}

      {/* Selo flutuante lateral ("FEITO COM IA", "OFERTA", etc.) */}
      {scene.ugcBadge && (
        <div
          style={{
            position: 'absolute',
            top: 320,
            left: 56,
            transform: `scale(${badgePop}) rotate(-6deg)`,
            backgroundColor: theme.accent,
            color: theme.accentText,
            padding: '12px 26px',
            borderRadius: 16,
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 900,
            fontSize: 28,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            boxShadow: '0 14px 30px rgba(0,0,0,0.32)',
            zIndex: 6,
          }}
        >
          {scene.ugcBadge}
        </div>
      )}

      {/* Legenda karaoke sincronizada palavra por palavra na zona segura */}
      <div
        style={{
          position: 'absolute',
          left: 56,
          right: 56,
          bottom: scene.ugcProductCard ? 430 : 280,
          zIndex: 7,
        }}
      >
        <KineticCaption
          text={scene.text}
          words={scene.words}
          highlights={scene.highlights}
          durationInFrames={scene.durationInFrames}
          theme={theme}
          textColor="#FFFFFF"
          align="center"
          fontSize={64}
          mode="ugc"
        />
      </div>

      {/* Card de produto / oferta (E-commerce / Review / Anúncio) */}
      {scene.ugcProductCard && (
        <div
          style={{
            position: 'absolute',
            left: 56,
            right: 56,
            bottom: 185,
            backgroundColor: 'rgba(255,255,255,0.96)',
            borderRadius: 28,
            padding: '22px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            boxShadow: '0 22px 48px rgba(0,0,0,0.38)',
            transform: `scale(${cardPop})`,
            zIndex: 8,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {scene.ugcProductCard.imageSrc && (
            <Img
              src={
                scene.ugcProductCard.imageSrc.startsWith('http')
                  ? scene.ugcProductCard.imageSrc
                  : staticFile(scene.ugcProductCard.imageSrc)
              }
              style={{
                width: 108,
                height: 108,
                borderRadius: 20,
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: '#141628', lineHeight: 1.15 }}>
              {scene.ugcProductCard.title}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 8 }}>
              {scene.ugcProductCard.oldPrice && (
                <span style={{ fontSize: 24, fontWeight: 700, color: '#8A8FA8', textDecoration: 'line-through' }}>
                  {scene.ugcProductCard.oldPrice}
                </span>
              )}
              <span
                style={{
                  fontSize: 38,
                  fontWeight: 900,
                  color: theme.primary,
                }}
              >
                {scene.ugcProductCard.price}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
