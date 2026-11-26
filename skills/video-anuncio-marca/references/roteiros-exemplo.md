# Roteiros de Exemplo Comentados (Estilos A, B e C)

Estes 3 modelos servem de referência estrutural para o Claude adaptar a qualquer nicho (produto físico, infoproduto, serviço, SaaS ou loja local).

---

## Exemplo 1 — Estilo A: Motion com Mascote (Reels Orgânico · ~28s)

**Objetivo:** Alcance orgânico + CTA de comentário para automação no Direct.  
**Formato:** `9:16` (1080×1920) · **Cronômetro no topo:** Ativo (`tempo de produção`).

### Texto de Voz (com tags de emoção para ElevenLabs)
```text
[whispers] Ninguém editou esse vídeo.
[confident] Sério. Nenhum editor, nenhum programa de edição.
Eu só escrevi uma frase pro Claude: <break time="0.2s"/> "faz um Reels pra minha marca".
[excited] E ele escreveu o roteiro, desenhou cada cena, sincronizou cada palavra com a voz, colocou legenda, efeito, transição... e montou isso aqui que você tá vendo.
[curious] Quer saber quanto tempo levou?
[chuckles] Nove minutos.
[confident] Comenta VIDEO que eu te mando o passo a passo.
```

### Mapa de Cenas
1. `mascote-hero` (`brand`) — *"Ninguém editou esse vídeo."* · Highlight: `Ninguém` · SFX: `whoosh`
2. `cards-list` (`light`) — *"Sério. Nenhum editor, nenhum programa de edição."* · Cards `Editor de vídeo` e `Programa de edição` com `crossed: true` · SFX: `scratch_x`
3. `terminal` (`brand`) — *"Eu só escrevi uma frase pro Claude."* · Comando digitado: `faz um Reels pra minha marca` · SFX: `type_key`
4. `scene-grid` (`light`) — *"E ele escreveu o roteiro, desenhou cada cena,"* · Grade 3×1 de miniaturas · SFX: `pop`
5. `audio-timeline` (`light`) — *"sincronizou cada palavra com a voz,"* · Onda + timeline 3 trilhas · SFX: `pop`
6. `impact-burst` (`dark`) — *"colocou legenda, efeito, transição..."* · Highlight: `transição...` · SFX: `bass_drop`
7. `phone-preview` (`brand`) — *"e montou isso aqui que você tá vendo."* · Celular inclinado + selo `FEITO COM IA` · SFX: `whoosh`
8. `big-metric` (`light`) — *"Quer saber quanto tempo levou? Nove minutos."* · Contador `09:00` + `confetti: true` · SFX: `ding`, `confetti`
9. `cta-final` (`brand`) — *"Comenta VIDEO que eu te mando o passo a passo."* · Pílula `VIDEO` + mascote piscando · SFX: `ding`

---

## Exemplo 2 — Estilo B: UGC Puro (E-commerce / Review · ~25s)

**Objetivo:** Conversão direta para loja virtual / Meta Ads / TikTok Shop.  
**Formato:** `9:16` (1080×1920) · **Áudio:** Voz original do vídeo gravado no celular (`ugcMuted: false`).

### Roteiro Falado (para gravar no celular na vertical)
- **0–3s (Gancho):** *"Se o seu café em casa sempre fica aguado, para tudo e olha esse moedor portátil."*
  - Layout: `ugc-clip` · `ugcHookPill`: `"Café de cafeteria em 40 segundos"` · `ugcBadge`: `"TESTEI 30 DIAS"`
- **3–10s (Prova visual):** *"Ele mói o grão na hora com lâmina de cerâmica, sem esquentar o café e sem precisar de tomada."*
  - Layout: `ugc-clip` · Clipe mostrando moagem de perto · Highlight: `lâmina de cerâmica`
- **10–18s (Benefício + Quebra de objeção):** *"Uma carga dura quase um mês inteiro e cabe na mochila. Nunca mais gastei 18 reais em café na rua."*
  - Layout: `ugc-clip` · Highlight: `um mês inteiro`
- **18–25s (Oferta + CTA):** *"Essa semana tá com 35% de desconto e frete grátis. Toca no botão aqui embaixo antes de acabar o lote."*
  - Layout: `ugc-clip` · `ugcProductCard`: `{ title: "Moedor Portátil Cerâmico", oldPrice: "R$ 229", price: "R$ 149" }` · SFX: `ding`

---

## Exemplo 3 — Estilo C: Híbrido (Anúncio Pago com 3 Ganchos A/B · ~32s)

**Objetivo:** Tráfego pago (Meta Ads / Instagram Ads) — combina a retenção natural de um rosto humano nos primeiros 4 segundos com a clareza didática do Motion Graphics para explicar oferta, garantia e CTA.

### 3 Ganchos A/B (troque apenas a Cena 1 para testar criativos!)
- **Gancho A (Dor direta):** *"Você tá pagando caro em agência e mesmo assim seus anúncios não convertem?"*
- **Gancho B (Quebra de padrão):** *"Eu demiti meu editor depois que descobri esse fluxo de 9 minutos no Claude."*
- **Gancho C (Prova/Resultado):** *"Esse anúncio que você tá vendo agora foi montado do zero em menos de 10 minutos."*

### Corpo Unificado (Cenas 2 a 7 — Motion)
2. **Cena 1 (`ugc-clip` · 0–4s):** Rosto humano falando o Gancho A/B/C para a câmera + `ugcHookPill` no topo.
3. **Cena 2 (`impact-burst` · `dark` · 4–6s):** *"Olha como funciona."* · Ícone `eye` · SFX: `whoosh` + `bass_drop`.
4. **Cena 3 (`cards-list` · `light` · 6–14s):** *"Em vez de perder a tarde no editor, você escolhe o estilo, manda a ideia e recebe roteiro, voz e vídeo pronto."* · 3 cards (`Mascote`, `UGC`, `Híbrido`) com `cursorClick: true`.
5. **Cena 4 (`phone-preview` · `brand` · 14–20s):** *"Serve pra Reels, anúncio pago, feed quadrado ou YouTube."* · Celular com selo `4 FORMATOS`.
6. **Cena 5 (`big-metric` · `light` · 20–26s):** *"Pagamento único, sem mensalidade, e ainda tem 7 dias de garantia."* · Card gigante `R$ 27` + selo `7 DIAS DE GARANTIA` + `confetti: true`.
7. **Cena 6 (`cta-final` · `brand` · 26–32s):** *"Clica no botão aqui embaixo e cria o seu primeiro vídeo hoje."* · Pílula `QUERO AGORA` + setas animadas.
