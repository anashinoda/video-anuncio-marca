#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "  🎬 Instalando a skill video-anuncio-marca..."
echo "=========================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_SRC="$SCRIPT_DIR/skills/video-anuncio-marca"

# 1. Global Claude Code (~/.claude/skills)
mkdir -p "$HOME/.claude/skills"
rm -rf "$HOME/.claude/skills/video-anuncio-marca"
cp -r "$SKILL_SRC" "$HOME/.claude/skills/video-anuncio-marca"

# 2. Global Agent Protocol (~/.agents/skills)
mkdir -p "$HOME/.agents/skills"
rm -rf "$HOME/.agents/skills/video-anuncio-marca"
cp -r "$SKILL_SRC" "$HOME/.agents/skills/video-anuncio-marca"

# 3. Permissões de execução nos scripts Python
chmod +x "$HOME/.claude/skills/video-anuncio-marca/scripts/"*.py 2>/dev/null || true
chmod +x "$HOME/.agents/skills/video-anuncio-marca/scripts/"*.py 2>/dev/null || true

# 4. Gera biblioteca de SFX na pasta engine/public/sfx
if command -v python3 >/dev/null 2>&1; then
  echo "🔊 Gerando biblioteca de efeitos sonoros (SFX)..."
  python3 "$SKILL_SRC/scripts/generate_sfx.py" --out "$SCRIPT_DIR/engine/public/sfx"
fi

echo ""
echo "✅ Skill instalada com sucesso!"
echo "👉 Use /video-anuncio-marca no Claude Code ou Antigravity."
echo "👉 Para preparar o motor de vídeo Remotion:"
echo "   cd engine && npm install && npm run render"
