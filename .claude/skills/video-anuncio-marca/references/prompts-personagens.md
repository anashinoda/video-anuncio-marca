# Prompts dos Personagens (Estilo Figurinha / Sticker Consistente)

Use estes prompts no **Google Flow / Whisk**, **ChatGPT (GPT Image)**, **Nano Banana** ou **Midjourney** para gerar o mascote da sua marca mantendo o rosto, a roupa e o estilo 100% consistentes em todas as cenas.

> **Dica de ouro:** Primeiro gere a **Imagem Base (Character Sheet)** abaixo. Depois, nos geradores que aceitam imagem de referência (Google Flow, Whisk, ChatGPT Image), **anexe a Imagem Base** ao pedir cada nova pose!

---

## 1. Prompt Mestre — Personagem Base (Character Sheet)

Substitua os campos entre `[COLCHETES]` pelos dados do seu personagem/marca:

```text
Clean 2D vector cartoon mascot illustration of a [homem/mulher jovem brasileiro(a) de ~28 anos, cabelo curto escuro, sorriso confiante], wearing a [camisa polo preta limpa, calça cinza moderna, tênis branco] and a [boné branco com o texto "[SUA MARCA]" escrito em azul marinho na frente].
Style: modern flat-shaded comic sticker illustration, bold clean dark ink outlines, subtle cel-shading, expressive eyes, slightly stylized head-to-body ratio (1:5.5), vibrant clean colors.
Full body standing straight facing camera, neutral friendly expression, hands relaxed at sides.
Isolated on a 100% pure solid white background (#FFFFFF), zero shadows on background, no props, no text outside the cap, no extra borders. High resolution PNG look.
```

---

## 2. Biblioteca de 10 Poses Prontas (anexe a Imagem Base como referência!)

### Pose 1 — Cansado no notebook (`cansado-notebook`) — Ideal para cena de dor
```text
Using the exact same character, face, outfit, cap logo and 2D vector cartoon style from the reference image:
Show the character sitting at a simple wooden desk with a silver laptop and a coffee mug, resting their cheek on one hand looking exhausted and bored, slight dark circles under the eyes, a tiny sweat drop on the forehead.
Full desk and chair visible, clean dark ink outlines, isolated on a 100% pure solid white background (#FFFFFF), no floor shadow, sticker-ready cutout.
```

### Pose 2 — Desesperado com as mãos na cabeça (`desesperado`) — Ideal para lista de tarefas/dores
```text
Using the exact same character, face, outfit, cap logo and 2D vector cartoon style from the reference image:
Full body standing, both hands grabbing the sides of the head in panic and stress, mouth wide open shouting, wide shocked eyes, small comic stress lines radiating around the head.
Isolated on a 100% pure solid white background (#FFFFFF), clean bold dark ink outlines, sticker-ready cutout.
```

### Pose 3 — Apontando para a câmera (`apontando-camera`) — Ideal para virada / chamada direta
```text
Using the exact same character, face, outfit, cap logo and 2D vector cartoon style from the reference image:
Full body standing confidently, one hand resting in pocket, the other arm raised pointing the index finger directly toward the viewer with a charismatic half-smile and focused eyes.
Isolated on a 100% pure solid white background (#FFFFFF), clean bold dark ink outlines, sticker-ready cutout.
```

### Pose 4 — Pensativo com a mão no queixo (`pensativo`) — Ideal para pergunta / objeção
```text
Using the exact same character, face, outfit, cap logo and 2D vector cartoon style from the reference image:
Full body standing, one arm crossed over the torso, the other hand resting thoughtfully on the chin, looking slightly upward with one eyebrow raised in curiosity.
Isolated on a 100% pure solid white background (#FFFFFF), clean bold dark ink outlines, sticker-ready cutout.
```

### Pose 5 — Apresentando com a mão aberta para o lado (`apresentando-lado`) — Ideal ao lado de cards
```text
Using the exact same character, face, outfit, cap logo and 2D vector cartoon style from the reference image:
Full body standing turned slightly to the left, smiling warmly, presenting with an open palm gesture toward the left side of the frame as if showcasing cards or bullet points.
Isolated on a 100% pure solid white background (#FFFFFF), clean bold dark ink outlines, sticker-ready cutout.
```

### Pose 6 — Comemorando com os dois braços para cima (`comemorando`) — Ideal para prova/resultado + confete
```text
Using the exact same character, face, outfit, cap logo and 2D vector cartoon style from the reference image:
Full body jumping slightly in joy, both arms raised high in victory with fists clenched, huge excited open-mouth smile, energetic happy posture.
Isolated on a 100% pure solid white background (#FFFFFF), clean bold dark ink outlines, sticker-ready cutout.
```

### Pose 7 — Apontando para cima com os dois indicadores (`apontando-cima`) — Ideal para métrica/cronômetro
```text
Using the exact same character, face, outfit, cap logo and 2D vector cartoon style from the reference image:
Full body standing facing camera, both hands raised pointing upward toward the top of the frame with a proud amazed smile, eyes looking slightly up.
Isolated on a 100% pure solid white background (#FFFFFF), clean bold dark ink outlines, sticker-ready cutout.
```

### Pose 8 — Joinha confiante (`joinha`) — Ideal para garantia / quebra de objeção
```text
Using the exact same character, face, outfit, cap logo and 2D vector cartoon style from the reference image:
Full body standing facing camera, right hand giving a confident thumbs-up, left hand resting calmly on chest, reassuring warm smile.
Isolated on a 100% pure solid white background (#FFFFFF), clean bold dark ink outlines, sticker-ready cutout.
```

### Pose 9 — Segurando pasta / entregável (`segurando-pasta`) — Ideal para mostrar o que o cliente recebe
```text
Using the exact same character, face, outfit, cap logo and 2D vector cartoon style from the reference image:
Full body standing facing camera, holding a vibrant blue folder with both hands in front of the chest, proud confident smile.
Isolated on a 100% pure solid white background (#FFFFFF), clean bold dark ink outlines, sticker-ready cutout.
```

### Pose 10 — Piscando com sorriso para o CTA (`piscando-cta`) — Ideal para cena final
```text
Using the exact same character, face, outfit, cap logo and 2D vector cartoon style from the reference image:
Full body standing relaxed with one hand in pocket, winking one eye playfully at the viewer with a friendly charismatic grin.
Isolated on a 100% pure solid white background (#FFFFFF), clean bold dark ink outlines, sticker-ready cutout.
```

---

## 3. Convertendo em Figurinha (Borda Branca Automática)

Salve todas as imagens geradas na pasta `raw_images/` e execute:

```bash
python3 skills/video-anuncio-marca/scripts/prepare_stickers.py \
  --input raw_images/ \
  --out engine/public/assets/ \
  --outline 12
```

Se alguma imagem tiver fundo complexo (ex.: cenário de escritório atrás), use a flag `--rembg`:
```bash
python3 skills/video-anuncio-marca/scripts/prepare_stickers.py \
  --input raw_images/ \
  --out engine/public/assets/ \
  --outline 12 \
  --rembg
```
