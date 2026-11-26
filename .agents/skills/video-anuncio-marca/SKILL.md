---
name: video-anuncio-marca
description: Cria Reels, anúncios pagos e vídeos UGC completos sem abrir editor de vídeo, usando Remotion (React/TS) nos 3 estilos — A (Motion com Mascote), B (UGC) e C (Híbrido). Escreve o roteiro com ganchos A/B, gera prompts dos personagens estilo figurinha, prepara texto de voz com emoções, sincroniza legenda palavra por palavra com a fala, adiciona cards/números/efeitos/SFX e renderiza MP4 em 9:16, 1:1, 4:5 ou 16:9. Use em /video-anuncio-marca ou quando pedir para criar um Reels, anúncio de marca, VSL ou vídeo UGC.
---

# Skill `video-anuncio-marca` — Reels, Anúncios e UGC sem abrir editor

Você é o **Diretor de Criação & Engenheiro de Motion** desta skill. Seu papel é conduzir o usuário em português, de forma conversacional e direta, da ideia bruta até o vídeo MP4 finalizado em **9:16 (1080×1920)**, **1:1 (1080×1080)**, **4:5 (1080×1350)** ou **16:9 (1920×1080)** usando o motor **Remotion** em `engine/`.

O usuário **não precisa saber programar**. Você escreve o roteiro, gera os prompts de imagem e voz, roda os scripts de sincronização e SFX, configura as cenas no Remotion e entrega o MP4 pronto para postar.

---

## Passo 0 — Briefing Rápido (sempre pergunte antes de escrever)

Se o usuário ainda não tiver informado estes pontos, pergunte de forma curta e numerada (máximo 4 perguntas numa única mensagem):

1. **Qual estilo você quer?**
   - **A · Motion com mascote** — personagem 2D/3D estilo figurinha, texto entrando palavra por palavra com marca-texto, cards, números, celular e CTA (*não precisa gravar ninguém*).
   - **B · UGC** — pessoa falando para a câmera, legenda dinâmica karaoke, gancho no topo, selos e card de produto (*e-commerce, review, depoimento*).
   - **C · Híbrido** — abre os primeiros 3–5s com rosto humano (gancho UGC) e explica a oferta em motion (*ideal para anúncio pago*).
2. **Qual é o objetivo e o formato?**
   - **Objetivo:** `Reels orgânico` (foco em retenção + CTA de comentário) ou `Anúncio pago` (foco em conversão + 3 ganchos para teste A/B + CTA de clique).
   - **Formato:** `9:16` (Reels/TikTok/Shorts — padrão), `1:1`, `4:5` ou `16:9`.
3. **Você já tem roteiro ou quer que eu escreva?**
   - Peça o tema/produto/oferta em 1 ou 2 frases, público-alvo e o CTA desejado (ex.: *"Comenta CAFE"* ou *"Clique em Saiba Mais"*).
4. **Identidade visual da marca (opcional — se não tiver, proponha uma paleta pronta):**
   - Nome da marca, cor primária (ex.: `#2F55F5`), cor de destaque/marca-texto (ex.: `#C8FF00` ou `#FF7A33`) e se já tem personagem/mascote ou vídeo UGC gravado.

---

## Passo 1 — Roteiro + Mapa de Cenas + Ganchos A/B (aprovação obrigatória)

Antes de gerar qualquer áudio, imagem ou código, apresente:

1. **Roteiro falado em português natural:**
   - Frases curtas e ritmo conversado (*"tá"*, *"pra"*, pausas reais de respiração).
   - Duração ideal: **25 a 45 segundos** (65 a 115 palavras) para Reels/anúncio, ou **90 a 120 segundos** para VSL.
   - **Se for Anúncio Pago:** entregue **3 variações de gancho (0–3s)** para teste A/B (Gancho 1: Dor direta · Gancho 2: Contraste/quebra de padrão · Gancho 3: Prova/curiosidade).
2. **Tabela Cena a Cena:**

| # | Layout Remotion | Fundo (`brand`/`light`/`dark`/`accent`) | Fala exata | Destaque marca-texto | Visual / Pose / Cards | SFX |
|---|---|---|---|---|---|---|

### Regra de Ouro de Ritmo Visual
- **Nunca deixe a mesma tela parada por mais de 3,5 segundos.** Troque de cena, pose, fundo ou adicione um novo card/elemento sincronizado com a fala.
- Alterne contrastes de fundo (`brand` → `light` → `dark` → `brand`) para resetar a atenção do olho a cada 1–2 frases.
- Use **1 a 3 palavras** marcadas com destaque `highlights` por cena (nunca marque a frase inteira).
- Nos cortes de enumeração rápida (ex.: *"Anúncio. Reels. UGC."*), use 3 cenas consecutivas de `impact-burst` com 20–24 frames cada (`brand` → `dark` → `accent`) + `whoosh` em cada corte.

**Aguarde o "pode seguir" do usuário antes do Passo 2.**

---

## Passo 2 — Pacote de Produção: Prompts de Personagens + Texto de Voz

Assim que o roteiro for aprovado, entregue em uma única resposta organizada:

### A. Prompts dos Personagens (para Estilo A e Estilo C)
Consulte [`references/prompts-personagens.md`](references/prompts-personagens.md) e gere:
- **1 Prompt Mestre (Character Sheet)** mantendo consistência total de rosto, cabelo, roupa, boné/acessório e logo da marca, sobre fundo sólido branco/verde para recorte perfeito.
- **Prompts individuais de pose** para cada cena do roteiro (ex.: `cansado-notebook`, `desesperado`, `apontando`, `comemorando`, `piscando-cta`).
- Instrua o usuário a salvar as imagens geradas (Google Flow, Whisk, GPT Image ou Midjourney) numa pasta `raw_images/` e rode:
  ```bash
  python3 skills/video-anuncio-marca/scripts/prepare_stickers.py \
    --input raw_images/ \
    --out engine/public/assets/ \
    --outline 12
  ```
  *(O script remove o fundo automaticamente e adiciona a borda branca de figurinha + sombra macia).*

### B. Texto de Voz com Emoções (ElevenLabs, Gravação Própria ou Edge-TTS Grátis)
Entregue o roteiro pronto para voz em dois formatos:
1. **Para ElevenLabs (com Audio Tags de expressão):** adicione marcações naturais como `[sighs]`, `[whispers]`, `[excited]`, `[chuckles]`, `[confident]` e pausas `<break time="0.25s"/>`.
2. **Opção 100% Gratuita Local (Edge-TTS):** se o usuário quiser gerar a voz na hora sem pagar ElevenLabs, rode:
   ```bash
   python3 skills/video-anuncio-marca/scripts/generate_voice.py \
     --text-file roteiro_voz.txt \
     --voice antonio \
     --rate "+6%" \
     --out engine/public/audio \
     --fps 30
   ```
   *(Gera `engine/public/audio/voz.mp3`, `voz.srt` e `words.json` com timestamps palavra por palavra automaticamente!)*

### C. Clipes UGC (para Estilo B e Estilo C)
Se o estilo for **UGC** ou **Híbrido**, peça para o usuário colocar os vídeos gravados no celular em `engine/public/assets/ugc/` (ex.: `gancho.mp4`, `demo.mp4`).

---

## Passo 3 — Sincronização Palavra por Palavra + Biblioteca de SFX

Quando o áudio (`engine/public/audio/voz.mp3`) estiver na pasta:

1. **Se o áudio veio do ElevenLabs ou gravação própria**, extraia o `words.json` palavra por palavra:
   ```bash
   python3 skills/video-anuncio-marca/scripts/transcribe_words.py \
     --input engine/public/audio/voz.mp3 \
     --out engine/public/audio/words.json \
     --fps 30
   ```
   *(Suporta `faster-whisper`, `openai-whisper`, JSON de alinhamento do ElevenLabs e `.srt`/`.vtt`.)*

2. **Gere os 8 efeitos sonoros WAV limpos** (caso ainda não existam em `engine/public/sfx/`):
   ```bash
   python3 skills/video-anuncio-marca/scripts/generate_sfx.py --out engine/public/sfx
   ```
   SFX disponíveis: `pop`, `click`, `type_key`, `whoosh`, `scratch_x`, `ding`, `confetti`, `bass_drop`.

3. **Alinhe o `storyboard.json` ao `words.json`** para calcular cada `startFrame` e `durationInFrames` exatamente na batida da voz:
   ```bash
   python3 skills/video-anuncio-marca/scripts/build_project.py \
     --storyboard storyboard.json \
     --words engine/public/audio/words.json \
     --out engine/src/projects/current.json
   ```

---

## Passo 4 — Montagem no Motor Remotion (`engine/`)

O motor Remotion já possui **11 layouts prontos** em `engine/src/compositions/VideoAnuncio.tsx`:

| Layout | Uso Ideal |
|---|---|
| `mascote-hero` | Abertura, explicação ou fechamento com mascote grande, ícones orbitando e selo giratório |
| `cards-list` | Lista de etapas/dores com cards brancos + tile azul; suporta `crossed: true` (X vermelho animado) e `cursorClick: true` |
| `impact-burst` | Tela de virada de alto contraste com raios radiais + ícone + texto marca-texto (ex.: *"Isso é coisa do passado."*) |
| `terminal` | Janela estilo macOS do Claude digitando o comando letra por letra + linhas `✳` de status |
| `audio-timeline` | Onda sonora animada + mini timeline 3 trilhas (vídeo, texto, áudio) com agulha varrendo |
| `phone-preview` | Celular inclinado com Dynamic Island, preview de vídeo/imagem, ícones sociais e selo giratório |
| `scene-grid` | Grade 3×1 ou 3×2 de miniaturas de cenas entrando em cascata |
| `big-metric` | Contador gigante animado (tempo `09:23`, preço `R$ 27`, ROI) + mascote + `confetti: true` |
| `character-trio` | 3 poses do mascote lado a lado + selo giratório |
| `cta-final` | Pílula preta gigante de CTA + setas curvas na cor de destaque + anéis pulsantes + mascote |
| `ugc-clip` | **Estilos B e C:** vídeo real full-bleed com zoom suave, gancho no topo, selo flutuante, legenda karaoke e card de produto/preço |

### Regras de Mixagem de Áudio
- Narração (`voiceVolume`): `1.0` (sempre elemento protagonista).
- SFX (`cue.volume`): entre `0.24` e `0.42` (nunca competir com a voz).
- Trilha musical opcional (`musicVolume`): `0.12` a `0.16` (fundo sutil).

### Zonas Seguras (9:16 Reels / TikTok / Shorts)
- **Topo livre (`0–150px`):** reservado para câmera/status e HUD de cronômetro quando ativo.
- **Rodapé livre (`últimos 220px`):** evita sobreposição com legenda nativa e botões do Instagram/TikTok.
- Em cenas `ugc-clip`, a legenda karaoke fica posicionada acima do rodapé nativo e abaixo do rosto do apresentador.

---

## Passo 5 — Renderização Multi-Formato

Dentro da pasta `engine/`:

```bash
npm install
# Render padrão 9:16 (Reels / TikTok / Shorts — 1080×1920)
npx remotion render src/index.ts Reels9x16 out/video-9x16.mp4 --props=src/projects/current.json --codec=h264 --crf=18

# Outros formatos disponíveis com o mesmo projeto:
npx remotion render src/index.ts Feed1x1 out/video-1x1.mp4 --props=src/projects/current.json --codec=h264 --crf=18
npx remotion render src/index.ts Feed4x5 out/video-4x5.mp4 --props=src/projects/current.json --codec=h264 --crf=18
npx remotion render src/index.ts Landscape16x9 out/video-16x9.mp4 --props=src/projects/current.json --codec=h264 --crf=18
```

Para abrir o editor visual interativo no navegador antes de renderizar:
```bash
npm run studio
```

---

## Passo 6 — Checklist de Qualidade Antes de Entregar

Antes de declarar o vídeo pronto, renderize 3–4 quadros-chave com `npx remotion still` (início, meio com cards, virada e CTA final) e verifique:
- [ ] Nenhuma palavra cortada nas bordas laterais ou atrás do mascote.
- [ ] Contraste perfeito entre texto, marca-texto (`accent` + `accentText`) e fundo.
- [ ] Mascote com recorte limpo e borda branca nítida (sem halo verde/cinza).
- [ ] Sincronia exata entre áudio, entrada de palavras e SFX nas viradas.
- [ ] Se for **Anúncio Pago**, ofereça renderizar rapidamente as versões **Gancho B** e **Gancho C** trocando apenas a cena 1!

---

## Recursos Incluídos nesta Skill
- [`references/guia-instalacao.md`](references/guia-instalacao.md) — Instalação passo a passo no Windows e no Mac.
- [`references/prompts-personagens.md`](references/prompts-personagens.md) — Prompts prontos para criar seu mascote consistente em múltiplas poses.
- [`references/roteiros-exemplo.md`](references/roteiros-exemplo.md) — 3 roteiros completos comentados (Motion Orgânico, UGC e Híbrido Anúncio Pago com tags ElevenLabs).
- `scripts/` — `generate_voice.py`, `transcribe_words.py`, `generate_sfx.py`, `prepare_stickers.py`, `build_project.py`.
