export type VideoStyle = 'mascote' | 'ugc' | 'hibrido';
export type VideoGoal = 'organico' | 'anuncio';
export type AspectFormat = '9:16' | '1:1' | '4:5' | '16:9';

export type BackgroundVariant = 'brand' | 'light' | 'dark' | 'accent';

export type SfxName =
  | 'whoosh'
  | 'pop'
  | 'click'
  | 'type_key'
  | 'scratch_x'
  | 'ding'
  | 'confetti'
  | 'bass_drop';

export type IconName =
  | 'script'
  | 'scissors'
  | 'captions'
  | 'sparkles'
  | 'clock'
  | 'hourglass'
  | 'alarm'
  | 'bulb'
  | 'send'
  | 'message'
  | 'mic'
  | 'video'
  | 'clapper'
  | 'megaphone'
  | 'eye'
  | 'target'
  | 'check'
  | 'shield'
  | 'bot'
  | 'folder'
  | 'image'
  | 'keyboard'
  | 'heart'
  | 'star'
  | 'monitor'
  | 'smartphone'
  | 'square'
  | 'shopping'
  | 'briefcase'
  | 'graduation'
  | 'wand'
  | 'palette'
  | 'user'
  | 'layers'
  | 'help'
  | 'code'
  | 'zap';

export interface WordTiming {
  word: string;
  /** Frame relativo ao início da cena */
  startFrame: number;
  /** Frame relativo ao início da cena */
  endFrame: number;
}

export interface BrandTheme {
  name: string;
  /** Cor primária vibrante da marca (ex: #2F55F5) */
  primary: string;
  /** Cor primária escura para degradê (ex: #1E3BC8) */
  primaryDark: string;
  /** Cor do marca-texto / destaque (ex: #C8FF00 ou #FF7A33) */
  accent: string;
  /** Texto sobre a cor de destaque (ex: #10121E) */
  accentText: string;
  /** Fundo claro suave (ex: #F4F3FA) */
  lightBg: string;
  /** Fundo escuro de impacto (ex: #0C0D14) */
  darkBg: string;
  /** Cor do texto sobre fundo claro */
  inkDark: string;
  /** Cor do texto sobre fundo escuro/marca */
  inkLight: string;
  /** Cor do risco X vermelho */
  danger: string;
}

export interface TaskCardItem {
  icon: IconName;
  title: string;
  subtitle?: string;
  /** Frame relativo em que o card aparece */
  enterFrame?: number;
  /** Se true, desenha um X vermelho animado em cima do card */
  crossed?: boolean;
  /** Frame relativo em que o X começa a riscar */
  crossFrame?: number;
}

export interface SceneSfxCue {
  name: SfxName;
  /** Frame relativo ao início da cena */
  frame: number;
  volume?: number;
}

export type SceneLayout =
  | 'mascote-hero'
  | 'cards-list'
  | 'impact-burst'
  | 'terminal'
  | 'audio-timeline'
  | 'phone-preview'
  | 'scene-grid'
  | 'big-metric'
  | 'character-trio'
  | 'cta-final'
  | 'ugc-clip';

export interface SceneSpec {
  id: string;
  layout: SceneLayout;
  bg: BackgroundVariant;
  startFrame: number;
  durationInFrames: number;
  /** Texto completo falado na cena */
  text: string;
  /** Palavras ou trechos exatos que recebem destaque marca-texto */
  highlights?: string[];
  /** Timestamps palavra por palavra relativos à cena (preenchido pelo build_project.py ou gerado automaticamente) */
  words?: WordTiming[];

  /** Caminho relativo em public/ (ex: assets/mascote-cansado.webp) */
  characterSrc?: string;
  /** Segunda/terceira pose para layout character-trio */
  extraCharacters?: string[];
  /** Badges de ícones flutuando ao lado do personagem */
  orbitIcons?: IconName[];
  /** Selo circular giratório (ex: "FEITO COM IA") */
  sealText?: string;
  sealIcon?: IconName;
  /** Linha de chão sob o personagem */
  groundLine?: boolean;
  /** Posição do personagem em layouts combinados */
  characterAlign?: 'center' | 'right' | 'bottom-right';

  /** Cards para layout cards-list */
  cards?: TaskCardItem[];
  /** Se true, mostra cursor do mouse clicando no primeiro card */
  cursorClick?: boolean;

  /** Ícone grande central para impact-burst */
  impactIcon?: IconName;

  /** Props para layout terminal */
  terminalTitle?: string;
  terminalCommand?: string;
  terminalOutputs?: string[];

  /** Props para layout phone-preview */
  phoneVideoSrc?: string;
  phoneImageSrc?: string;
  phoneLabel?: string;

  /** Props para layout scene-grid */
  gridItems?: Array<{
    bg: BackgroundVariant;
    title: string;
    subtitle?: string;
    imageSrc?: string;
  }>;

  /** Props para layout big-metric */
  metricLabel?: string;
  metricValue?: string;
  metricFromNumber?: number;
  metricToNumber?: number;
  metricPrefix?: string;
  metricSuffix?: string;
  confetti?: boolean;

  /** Props para layout cta-final */
  ctaKeyword?: string;
  ctaIcon?: IconName;
  ctaSubtext?: string;

  /** Props para layout ugc-clip (Estilos B e C) */
  ugcVideoSrc?: string;
  ugcStartFromSec?: number;
  ugcHookPill?: string;
  ugcBadge?: string;
  ugcProductCard?: {
    title: string;
    price: string;
    oldPrice?: string;
    imageSrc?: string;
  };
  /** Se o vídeo UGC tem áudio próprio (se false, fica mudo e usa narração externa) */
  ugcMuted?: boolean;

  /** Efeitos sonoros extras nesta cena */
  sfx?: SceneSfxCue[];
}

export interface ProjectConfig {
  id: string;
  title: string;
  style: VideoStyle;
  goal: VideoGoal;
  fps: number;
  durationInFrames: number;
  theme: BrandTheme;
  /** Caminho do áudio de narração em public/ (ex: audio/voz.mp3). Opcional no demo. */
  voiceSrc?: string;
  /** Volume da narração (padrão 1.0) */
  voiceVolume?: number;
  /** Trilha de fundo opcional em public/ (ex: audio/trilha.mp3) */
  musicSrc?: string;
  /** Volume da trilha com ducking (padrão 0.14) */
  musicVolume?: number;
  /** Mostra pílula de cronômetro no topo (estilo "● 00:00.00 tempo de produção") */
  stopwatchHud?: {
    enabled: boolean;
    label: string;
    /** Tempo final simulado em segundos (ex: 563 = 09:23) */
    targetSeconds: number;
    /** Em qual frame o cronômetro trava no valor final */
    freezeAtFrame?: number;
  };
  /** Habilita reprodução dos WAVs de public/sfx/ */
  enableSfx?: boolean;
  scenes: SceneSpec[];
}
