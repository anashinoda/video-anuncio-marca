# 🎬 `video-anuncio-marca` — Skill de Vídeos com IA (Reels, Anúncios & UGC)

> **Reels, anúncios pagos e UGC prontos sem abrir editor de vídeo.**  
> Skill completa para **Claude Code**, **Antigravity**, **Cursor** e **Codex** com motor de renderização **Remotion (React + TypeScript)**, sincronização palavra por palavra, biblioteca de 11 layouts de motion graphics, prompts de mascote estilo figurinha e efeitos sonoros sintetizados.

---

## ✨ Os 3 Estilos em 1 Skill

| Estilo | Como funciona | Ideal para |
|---|---|---|
| **A · Motion com Mascote** | Personagem estilo figurinha (borda branca), texto entrando palavra por palavra com marca-texto animado, cards com risco X, terminal digitando, timeline, celular inclinado, métricas e CTA | Reels orgânicos, VSLs, criadores que não querem aparecer na câmera |
| **B · UGC** | Vídeo real de pessoa falando para a câmera com zoom dinâmico suave, gancho fixo no topo, selos flutuantes, legenda karaoke na zona segura e card de produto/preço | E-commerce, reviews, depoimentos, TikTok Shop |
| **C · Híbrido** | Abre nos primeiros 3–5 segundos com rosto humano (retenção de UGC) e entra em motion para explicar benefícios, prova, garantia e CTA + 3 ganchos para teste A/B | Anúncios pagos (Meta Ads / Instagram / TikTok Ads) |

---

## 📐 Formatos Suportados (1 clique)

- **9:16** (`1080×1920`) — Reels, TikTok, YouTube Shorts *(com zonas seguras respeitadas)*
- **1:1** (`1080×1080`) — Feed Quadrado
- **4:5** (`1080×1350`) — Feed Vertical Instagram / Meta Ads
- **16:9** (`1920×1080`) — YouTube / VSL Horizontal

---

## 🚀 Instalação Rápida

### Mac / Linux
```bash
git clone https://github.com/anashinoda/video-anuncio-marca.git
cd video-anuncio-marca
./install-skill.sh
```

### Windows (PowerShell)
```powershell
git clone https://github.com/anashinoda/video-anuncio-marca.git
cd video-anuncio-marca
.\install-skill.ps1
```

### Preparar o motor Remotion (1ª vez)
```bash
# 1. Gerar os 8 efeitos sonoros WAV (zero dependências)
python3 skills/video-anuncio-marca/scripts/generate_sfx.py --out engine/public/sfx

# 2. Instalar dependências do Remotion
cd engine
npm install

# 3. Abrir o preview interativo ou renderizar o demo MP4
npm run studio
npm run render
```

---

## 🗂️ Estrutura do Repositório

```text
video-anuncio-marca/
├── skills/video-anuncio-marca/
│   ├── SKILL.md                         # Instruções completas da skill (fluxo em 6 passos)
│   ├── references/
│   │   ├── guia-instalacao.md           # Guia passo a passo (Windows + Mac)
│   │   ├── prompts-personagens.md       # Prompt Mestre + 10 poses consistentes de mascote
│   │   └── roteiros-exemplo.md          # 3 roteiros completos (A, B e C com tags ElevenLabs)
│   └── scripts/
│       ├── generate_sfx.py              # Sintetiza 8 efeitos sonoros WAV limpos (stdlib Python)
│       ├── generate_voice.py            # Locução neural pt-BR grátis (edge-tts) + words.json + SRT
│       ├── transcribe_words.py          # Extrai words.json de MP3/WAV (faster-whisper / ElevenLabs / SRT)
│       ├── prepare_stickers.py          # Remove fundo + aplica borda branca de figurinha + sombra
│       └── build_project.py             # Alinha storyboard.json aos frames exatos de words.json
├── .claude/skills/video-anuncio-marca/  # Padrão Claude Code
├── .agents/skills/video-anuncio-marca/  # Padrão Agent Protocol
├── engine/                              # Motor Remotion (React + TypeScript) pronto para render
│   ├── src/
│   │   ├── Root.tsx                     # Composições 9:16, 1:1, 4:5 e 16:9
│   │   ├── types.ts                     # Schema tipado de cenas, tema e timings
│   │   ├── compositions/VideoAnuncio.tsx
│   │   ├── components/                  # 12 componentes animados (KineticCaption, TaskCardList, Terminal, Phone, UGC, etc.)
│   │   └── projects/demo.ts             # Projeto demo pronto para testar
│   └── public/sfx/                      # Efeitos sonoros gerados
├── install-skill.sh                     # Instalador Mac/Linux
├── install-skill.ps1                    # Instalador Windows
└── CLAUDE.md
```

---

## 🛠️ Como Usar no Claude Code / Antigravity

Basta digitar `/video-anuncio-marca` (ou dizer *"faz um Reels pra minha marca"*) e responder às 4 perguntas rápidas:
1. Estilo (**A · Mascote**, **B · UGC** ou **C · Híbrido**).
2. Objetivo (`Reels orgânico` ou `Anúncio pago`) e formato (`9:16`, `1:1`, `4:5` ou `16:9`).
3. Ideia/produto ou roteiro pronto + CTA.
4. Paleta da marca (ou deixe o Claude sugerir).

Ele escreve o roteiro, gera os prompts das poses e o texto de voz com emoções, sincroniza cada palavra e renderiza o MP4 final.
