import { interpolate, spring } from 'remotion';
import { BackgroundVariant, BrandTheme, WordTiming } from '../types';

/**
 * Gera timings automáticos caso o projeto ainda não tenha passado pelo words.json
 * (útil para previews instantâneos antes da gravação de voz).
 */
export function resolveWordTimings(
  text: string,
  durationInFrames: number,
  explicitWords?: WordTiming[]
): WordTiming[] {
  if (explicitWords && explicitWords.length > 0) {
    return explicitWords;
  }
  const tokens = text
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (tokens.length === 0) return [];

  const usable = Math.max(12, Math.floor(durationInFrames * 0.84));
  const weights = tokens.map((t) => Math.max(2, t.replace(/[^a-zA-Z0-9À-ÿ]/g, '').length));
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  let cursor = 2;
  return tokens.map((word, idx) => {
    const span = Math.max(3, Math.round((weights[idx] / totalWeight) * usable));
    const startFrame = cursor;
    const endFrame = Math.min(durationInFrames - 1, cursor + span);
    cursor = endFrame;
    return { word, startFrame, endFrame };
  });
}

/**
 * Verifica se o índice de uma palavra pertence a um dos trechos marcados em `highlights`.
 */
export function computeHighlightFlags(words: string[], highlights: string[] = []): boolean[] {
  const flags = new Array(words.length).fill(false);
  if (!highlights.length || !words.length) return flags;

  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');

  const normWords = words.map(norm);

  for (const phrase of highlights) {
    const tokens = phrase
      .trim()
      .split(/\s+/)
      .map(norm)
      .filter(Boolean);
    if (!tokens.length) continue;

    for (let i = 0; i <= normWords.length - tokens.length; i++) {
      let match = true;
      for (let j = 0; j < tokens.length; j++) {
        if (normWords[i + j] !== tokens[j]) {
          match = false;
          break;
        }
      }
      if (match) {
        for (let j = 0; j < tokens.length; j++) {
          flags[i + j] = true;
        }
      }
    }
  }
  return flags;
}

export function getBackgroundStyle(bg: BackgroundVariant, theme: BrandTheme): {
  background: string;
  textColor: string;
  subTextColor: string;
  shapeColor: string;
  isDark: boolean;
} {
  switch (bg) {
    case 'brand':
      return {
        background: `radial-gradient(120% 90% at 50% 18%, ${theme.primary} 0%, ${theme.primaryDark} 100%)`,
        textColor: theme.inkLight,
        subTextColor: 'rgba(255,255,255,0.78)',
        shapeColor: 'rgba(255,255,255,0.38)',
        isDark: true,
      };
    case 'dark':
      return {
        background: `radial-gradient(100% 70% at 50% 25%, #171929 0%, ${theme.darkBg} 100%)`,
        textColor: theme.inkLight,
        subTextColor: 'rgba(255,255,255,0.72)',
        shapeColor: 'rgba(255,255,255,0.28)',
        isDark: true,
      };
    case 'accent':
      return {
        background: `radial-gradient(110% 90% at 50% 30%, ${theme.accent} 0%, ${theme.accent} 100%)`,
        textColor: theme.accentText,
        subTextColor: 'rgba(16,18,30,0.72)',
        shapeColor: 'rgba(16,18,30,0.22)',
        isDark: false,
      };
    case 'light':
    default:
      return {
        background: `radial-gradient(90% 50% at 15% 15%, rgba(47,85,245,0.08), transparent 60%), radial-gradient(80% 50% at 85% 20%, rgba(168,85,247,0.07), transparent 60%), radial-gradient(70% 50% at 50% 75%, rgba(255,122,51,0.06), transparent 60%), ${theme.lightBg}`,
        textColor: theme.inkDark,
        subTextColor: '#565970',
        shapeColor: theme.primary,
        isDark: false,
      };
  }
}

export function popSpring(frame: number, fps: number, delay = 0): number {
  return spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 13, stiffness: 190, mass: 0.8 },
  });
}

export function smoothFadeIn(frame: number, start: number, duration = 6): number {
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

export function getLayoutScale(width: number, height: number): {
  isLandscape: boolean;
  isSquare: boolean;
  scale: number;
  padX: number;
  padTop: number;
  padBottom: number;
} {
  const ratio = width / height;
  if (ratio >= 1.4) {
    // 16:9
    return {
      isLandscape: true,
      isSquare: false,
      scale: height / 1080,
      padX: 96,
      padTop: 64,
      padBottom: 64,
    };
  }
  if (ratio >= 0.9) {
    // 1:1
    return {
      isLandscape: false,
      isSquare: true,
      scale: 0.78,
      padX: 64,
      padTop: 68,
      padBottom: 64,
    };
  }
  if (ratio >= 0.72) {
    // 4:5
    return {
      isLandscape: false,
      isSquare: false,
      scale: 0.88,
      padX: 68,
      padTop: 84,
      padBottom: 80,
    };
  }
  // 9:16 (Reels/TikTok safe zones!)
  return {
    isLandscape: false,
    isSquare: false,
    scale: 1,
    padX: 72,
    padTop: 150,
    padBottom: 150,
  };
}
