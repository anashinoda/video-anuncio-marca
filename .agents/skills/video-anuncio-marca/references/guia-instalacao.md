# Guia Passo a Passo — Instalação e Uso da Skill `video-anuncio-marca`

Este guia mostra como instalar e rodar a skill no **Windows**, **Mac** ou **Linux**, tanto no **Claude Code** quanto no **Antigravity / Cursor / Codex**.

---

## 1. Requisitos

| Item | O que faz | Onde baixar |
|---|---|---|
| **Node.js 20+** | Roda o motor de vídeo Remotion | https://nodejs.org (versão LTS) |
| **Python 3.10+** | Roda os scripts de voz, transcrição, SFX e stickers | https://python.org |
| **Claude Code** (ou Antigravity) | Orquestra a criação do vídeo por conversa | `npm install -g @anthropic-ai/claude-code` |
| **Voz** *(escolha 1)* | **Edge-TTS** (grátis local), **ElevenLabs** (mais expressiva) ou sua gravação | `pip install edge-tts` |
| **Imagem** *(opcional no UGC)* | Google Flow / Whisk, ChatGPT Image ou Midjourney para criar o mascote | Qualquer gerador de sua preferência |

---

## 2. Instalação Rápida

### No Mac / Linux
```bash
git clone https://github.com/anashinoda/video-anuncio-marca.git
cd video-anuncio-marca
./install-skill.sh
```

### No Windows (PowerShell)
```powershell
git clone https://github.com/anashinoda/video-anuncio-marca.git
cd video-anuncio-marca
.\install-skill.ps1
```

### Instalar dependências do motor Remotion (uma única vez)
```bash
cd engine
npm install
```

### Instalar dependências Python opcionais
```bash
# Para voz gratuita pt-BR com timestamps automáticos:
pip install edge-tts

# Para preparar stickers com borda branca automática:
pip install pillow

# Para transcrever áudios externos (ElevenLabs ou gravação própria):
pip install faster-whisper
```

---

## 3. Como Pedir Cada Tipo de Vídeo no Claude

Abra o Claude Code dentro da pasta do projeto e converse em português:

### Exemplo 1 — Reels Orgânico com Mascote (Estilo A)
> `/video-anuncio-marca` Faz um Reels orgânico de 30s no estilo mascote para minha cafeteria artesanal **Grão Vivo**. Quero mostrar que café especial não precisa ser caro nem complicado. Paleta marrom escuro `#1E1410` e destaque verde-lima `#C8FF00`. CTA: Comenta CAFE.

### Exemplo 2 — UGC para E-commerce (Estilo B)
> `/video-anuncio-marca` Quero um vídeo UGC 9:16 com o clipe `assets/ugc/review.mp4` mostrando nosso Sérum Vitamina C de R$ 129 por R$ 79,90. Coloca gancho no topo, selo "TESTADO 30 DIAS", legenda dinâmica e card do produto no final.

### Exemplo 3 — Anúncio Pago Híbrido com Teste A/B (Estilo C)
> `/video-anuncio-marca` Cria um anúncio pago híbrido (4:5 e 9:16) para meu curso de Excel para Arquitetos. Abre com meu vídeo `assets/ugc/gancho.mp4` nos 4 primeiros segundos e entra em motion explicando os 3 benefícios + garantia de 7 dias. Gera 3 ganchos diferentes pra eu testar no Meta Ads.

---

## 4. Testando o Projeto Demo Agora Mesmo

Mesmo sem enviar nenhuma foto ou áudio ainda, você pode testar todo o motor de vídeo em 1 minuto:

```bash
# 1. Gere os 8 efeitos sonoros WAV
python3 skills/video-anuncio-marca/scripts/generate_sfx.py --out engine/public/sfx

# 2. Renderize o vídeo demo 9:16 (1080×1920)
cd engine
npm run render
```

O arquivo pronto será salvo em `engine/out/video-9x16.mp4`!

Para visualizar cena a cena no navegador em tempo real:
```bash
cd engine
npm run studio
```
