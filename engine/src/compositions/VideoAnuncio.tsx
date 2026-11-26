import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';
import { BrandTheme, ProjectConfig, SceneSpec } from '../types';
import { getBackgroundStyle, getLayoutScale, popSpring } from '../utils/animation';
import { AudioTimeline } from '../components/AudioTimeline';
import { ConfettiBurst } from '../components/ConfettiBurst';
import { CTABanner } from '../components/CTABanner';
import { FloatingShapes } from '../components/FloatingShapes';
import { ImpactBurst } from '../components/ImpactBurst';
import { KineticCaption } from '../components/KineticCaption';
import { PhoneMockup } from '../components/PhoneMockup';
import { RotatingSeal } from '../components/RotatingSeal';
import { SceneGridPreview } from '../components/SceneGridPreview';
import { StickerCharacter } from '../components/StickerCharacter';
import { BigMetricCard, StopwatchHUD } from '../components/StopwatchHUD';
import { TaskCardList } from '../components/TaskCardList';
import { TerminalMockup } from '../components/TerminalMockup';
import { UGCScene } from '../components/UGCScene';

loadFont('normal', {
  weights: ['500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

const SceneRenderer: React.FC<{
  scene: SceneSpec;
  theme: BrandTheme;
  sceneIndex: number;
  hasStopwatch: boolean;
}> = ({ scene, theme, sceneIndex, hasStopwatch }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const layout = getLayoutScale(width, height);
  const bgInfo = getBackgroundStyle(scene.bg, theme);

  // Micro zoom-in na entrada da cena para ritmo dinâmico
  const entryScale = interpolate(frame, [0, 7], [1.03, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (scene.layout === 'ugc-clip') {
    return (
      <AbsoluteFill>
        <UGCScene scene={scene} theme={theme} />
      </AbsoluteFill>
    );
  }

  if (scene.layout === 'impact-burst') {
    return (
      <AbsoluteFill style={{ background: bgInfo.background, transform: `scale(${entryScale})` }}>
        <FloatingShapes color={bgInfo.shapeColor} accent={theme.accent} seed={sceneIndex + 1} />
        <ImpactBurst
          text={scene.text}
          words={scene.words}
          highlights={scene.highlights}
          durationInFrames={scene.durationInFrames}
          icon={scene.impactIcon}
          theme={theme}
          textColor={bgInfo.textColor}
        />
      </AbsoluteFill>
    );
  }

  const topPad = hasStopwatch ? Math.max(layout.padTop, 175) : layout.padTop;
  const captionFontSize = Math.round((layout.isLandscape ? 60 : layout.isSquare ? 62 : 76) * layout.scale);

  return (
    <AbsoluteFill
      style={{
        background: bgInfo.background,
        transform: `scale(${entryScale})`,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <FloatingShapes color={bgInfo.shapeColor} accent={theme.accent} seed={sceneIndex + 1} />

      {/* Confete se habilitado na cena */}
      {scene.confetti && <ConfettiBurst theme={theme} startFrame={6} />}

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          padding: `${topPad}px ${layout.padX}px ${layout.padBottom}px`,
          display: 'flex',
          flexDirection: layout.isLandscape ? 'row' : 'column',
          justifyContent: 'space-between',
          alignItems: layout.isLandscape ? 'center' : 'stretch',
          gap: layout.isLandscape ? 56 : 36,
        }}
      >
        {/* Bloco de legenda sincronizada palavra por palavra */}
        <div
          style={{
            flex: layout.isLandscape ? 1.05 : undefined,
            display: 'flex',
            flexDirection: 'column',
            alignItems: scene.layout === 'cta-final' ? 'center' : 'flex-start',
            zIndex: 4,
          }}
        >
          {scene.text && (
            <KineticCaption
              text={scene.text}
              words={scene.words}
              highlights={scene.highlights}
              durationInFrames={scene.durationInFrames}
              theme={theme}
              textColor={bgInfo.textColor}
              align={scene.layout === 'cta-final' ? 'center' : 'left'}
              fontSize={captionFontSize}
              maxWidth={layout.isLandscape ? 820 : 940}
            />
          )}
        </div>

        {/* Área visual principal da cena */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent:
              scene.layout === 'mascote-hero' || scene.layout === 'cta-final'
                ? 'flex-end'
                : 'center',
            gap: 28,
          }}
        >
          {/* 1. Mascote Hero */}
          {scene.layout === 'mascote-hero' && (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <StickerCharacter
                src={scene.characterSrc}
                theme={theme}
                height={Math.round((layout.isLandscape ? 660 : layout.isSquare ? 520 : 790) * layout.scale)}
                orbitIcons={scene.orbitIcons}
                groundLine={scene.groundLine}
              />
              {scene.sealText && (
                <div style={{ position: 'absolute', right: -44, top: '34%', zIndex: 6 }}>
                  <RotatingSeal text={scene.sealText} icon={scene.sealIcon} theme={theme} size={174} />
                </div>
              )}
            </div>
          )}

          {/* 2. Lista de Cards (com risco X opcional e/ou cursor clicando + mascote lateral) */}
          {scene.layout === 'cards-list' && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                position: 'relative',
                gap: 24,
              }}
            >
              <TaskCardList
                cards={scene.cards ?? []}
                theme={theme}
                cursorClick={scene.cursorClick}
                compact={Boolean(scene.characterSrc)}
              />
              {scene.sealText && (
                <div style={{ position: 'absolute', right: 12, bottom: -60, zIndex: 6 }}>
                  <RotatingSeal text={scene.sealText} icon={scene.sealIcon} theme={theme} size={168} />
                </div>
              )}
              {scene.characterSrc && (
                <div style={{ position: 'absolute', right: -24, bottom: -120, zIndex: 5 }}>
                  <StickerCharacter
                    src={scene.characterSrc}
                    theme={theme}
                    height={Math.round(520 * layout.scale)}
                    delay={6}
                  />
                </div>
              )}
            </div>
          )}

          {/* 3. Terminal do Claude digitando */}
          {scene.layout === 'terminal' && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <TerminalMockup
                title={scene.terminalTitle}
                command={scene.terminalCommand ?? 'faz um Reels pra minha marca'}
                outputs={scene.terminalOutputs}
                theme={theme}
              />
              {scene.characterSrc && (
                <div style={{ position: 'absolute', right: -10, bottom: -250, zIndex: 5 }}>
                  <StickerCharacter
                    src={scene.characterSrc}
                    theme={theme}
                    height={Math.round(420 * layout.scale)}
                    delay={8}
                  />
                </div>
              )}
            </div>
          )}

          {/* 4. Onda de voz + Timeline sincronizada */}
          {scene.layout === 'audio-timeline' && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 32,
              }}
            >
              {scene.cards && scene.cards.length > 0 && (
                <TaskCardList cards={scene.cards} theme={theme} compact />
              )}
              <AudioTimeline theme={theme} durationInFrames={scene.durationInFrames} showTimeline />
            </div>
          )}

          {/* 5. Preview dentro do celular inclinado */}
          {scene.layout === 'phone-preview' && (
            <PhoneMockup
              theme={theme}
              videoSrc={scene.phoneVideoSrc}
              imageSrc={scene.phoneImageSrc}
              label={scene.phoneLabel}
              sealText={scene.sealText}
              orbitIcons={scene.orbitIcons}
            />
          )}

          {/* 6. Grade de miniaturas das cenas */}
          {scene.layout === 'scene-grid' && (
            <SceneGridPreview items={scene.gridItems ?? []} theme={theme} />
          )}

          {/* 7. Contador / Métrica gigante + Mascote */}
          {scene.layout === 'big-metric' && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 36,
              }}
            >
              <BigMetricCard
                label={scene.metricLabel}
                value={scene.metricValue}
                fromNumber={scene.metricFromNumber}
                toNumber={scene.metricToNumber}
                prefix={scene.metricPrefix}
                suffix={scene.metricSuffix}
                theme={theme}
              />
              <StickerCharacter
                src={scene.characterSrc}
                theme={theme}
                height={Math.round((layout.isLandscape ? 420 : 590) * layout.scale)}
                groundLine={scene.groundLine}
                delay={6}
              />
            </div>
          )}

          {/* 8. Trio de poses do personagem ("cria os personagens") */}
          {scene.layout === 'character-trio' && (
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: 18,
                width: '100%',
              }}
            >
              {[scene.characterSrc, ...(scene.extraCharacters ?? [undefined, undefined])]
                .slice(0, 3)
                .map((charSrc, idx) => {
                  const s = popSpring(frame, fps, idx * 6);
                  return (
                    <div key={idx} style={{ transform: `scale(${s})` }}>
                      <StickerCharacter
                        src={charSrc}
                        theme={theme}
                        height={Math.round((idx === 1 ? 680 : 620) * layout.scale)}
                        delay={idx * 5}
                      />
                    </div>
                  );
                })}
              {scene.sealText && (
                <div style={{ position: 'absolute', right: 8, top: -40, zIndex: 6 }}>
                  <RotatingSeal text={scene.sealText} icon={scene.sealIcon ?? 'wand'} theme={theme} size={172} />
                </div>
              )}
            </div>
          )}

          {/* 9. CTA Final */}
          {scene.layout === 'cta-final' && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 28,
              }}
            >
              <CTABanner
                keyword={scene.ctaKeyword ?? theme.name}
                icon={scene.ctaIcon ?? 'message'}
                theme={theme}
              />
              <StickerCharacter
                src={scene.characterSrc}
                theme={theme}
                height={Math.round((layout.isLandscape ? 430 : 640) * layout.scale)}
                delay={6}
              />
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const VideoAnuncio: React.FC<{ project: ProjectConfig }> = ({ project }) => {
  const { theme, scenes, voiceSrc, voiceVolume = 1, musicSrc, musicVolume = 0.14, stopwatchHud, enableSfx } =
    project;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.darkBg }}>
      {/* Cenas sequenciadas frame a frame */}
      {scenes.map((scene, idx) => (
        <Sequence
          key={scene.id}
          from={scene.startFrame}
          durationInFrames={scene.durationInFrames}
          name={`${idx + 1}. ${scene.id} (${scene.layout})`}
        >
          <SceneRenderer
            scene={scene}
            theme={theme}
            sceneIndex={idx}
            hasStopwatch={Boolean(stopwatchHud?.enabled)}
          />

          {/* Efeitos sonoros da cena */}
          {enableSfx &&
            scene.sfx?.map((cue, cIdx) => (
              <Sequence
                key={`${scene.id}-sfx-${cIdx}`}
                from={cue.frame}
                durationInFrames={45}
                name={`SFX:${cue.name}`}
              >
                <Audio src={staticFile(`sfx/${cue.name}.wav`)} volume={cue.volume ?? 0.34} />
              </Sequence>
            ))}
        </Sequence>
      ))}

      {/* Cronômetro global opcional no topo */}
      {stopwatchHud?.enabled && (
        <StopwatchHUD
          label={stopwatchHud.label}
          targetSeconds={stopwatchHud.targetSeconds}
          totalFrames={project.durationInFrames}
          freezeAtFrame={stopwatchHud.freezeAtFrame}
          theme={theme}
        />
      )}

      {/* Narração principal */}
      {voiceSrc && (
        <Audio
          src={voiceSrc.startsWith('http') ? voiceSrc : staticFile(voiceSrc)}
          volume={voiceVolume}
        />
      )}

      {/* Trilha sonora de fundo opcional com ducking */}
      {musicSrc && (
        <Audio
          src={musicSrc.startsWith('http') ? musicSrc : staticFile(musicSrc)}
          volume={musicVolume}
          loop
        />
      )}
    </AbsoluteFill>
  );
};
