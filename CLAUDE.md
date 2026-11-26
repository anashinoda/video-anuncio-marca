# 🎬 Projeto `video-anuncio-marca`

Este repositório contém a Agent Skill **`video-anuncio-marca`** e o motor **Remotion** (`engine/`) para produção automatizada de Reels, anúncios pagos e vídeos UGC em 3 estilos:
- **A · Motion com Mascote**
- **B · UGC**
- **C · Híbrido**

## Como acionar
Digite `/video-anuncio-marca` ou peça diretamente em português (ex.: *"faz um Reels pra minha loja de café"*).

## Regras do projeto
- Sempre siga o fluxo em 6 passos definido em `skills/video-anuncio-marca/SKILL.md`.
- Sempre mostre o roteiro e a tabela cena a cena para aprovação do usuário antes de gerar voz ou renderizar o vídeo.
- Mantenha a sincronização de texto, cards e SFX amarrada ao `words.json` real do áudio.
- Ao atualizar a skill em `skills/video-anuncio-marca/`, mantenha as cópias em `.claude/skills/video-anuncio-marca/` e `.agents/skills/video-anuncio-marca/` sincronizadas.
