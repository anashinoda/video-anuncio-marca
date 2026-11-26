#!/usr/bin/env python3
"""
prepare_stickers.py — Prepara imagens de personagem/mascote geradas por IA no estilo figurinha:
  1. Remove o fundo sólido (branco, verde chroma ou via rembg se disponível).
  2. Recorta margens transparentes.
  3. Aplica borda branca de recorte (die-cut sticker outline) + sombra macia opcional.
  4. Salva em PNG/WEBP transparente pronto para engine/public/assets/.

Requisitos:
  pip install pillow
  (opcional para fundos complexos: pip install rembg onnxruntime)

Uso:
  python3 prepare_stickers.py --input raw_images/ --out engine/public/assets/ --outline 12
"""

import argparse
import os
import sys
from collections import deque


def remove_bg_floodfill(img, tolerance: int = 38):
    """Remove fundo sólido a partir das 4 bordas da imagem (ideal para fundo branco ou verde chroma)."""
    rgba = img.convert("RGBA")
    px = rgba.load()
    w, h = rgba.size

    # Amostra a cor média dos 4 cantos
    corners = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]
    bg_r = sum(c[0] for c in corners) // 4
    bg_g = sum(c[1] for c in corners) // 4
    bg_b = sum(c[2] for c in corners) // 4

    def is_bg(r, g, b, a):
        if a < 10:
            return True
        dist = ((r - bg_r) ** 2 + (g - bg_g) ** 2 + (b - bg_b) ** 2) ** 0.5
        return dist <= tolerance

    visited = [[False] * h for _ in range(w)]
    q = deque()
    for x in range(w):
        q.append((x, 0))
        q.append((x, h - 1))
    for y in range(h):
        q.append((0, y))
        q.append((w - 1, y))

    while q:
        x, y = q.popleft()
        if x < 0 or x >= w or y < 0 or y >= h or visited[x][y]:
            continue
        r, g, b, a = px[x, y]
        if is_bg(r, g, b, a):
            visited[x][y] = True
            px[x, y] = (0, 0, 0, 0)
            q.append((x + 1, y))
            q.append((x - 1, y))
            q.append((x, y + 1))
            q.append((x, y - 1))

    return rgba


def add_sticker_outline(rgba, outline_px: int = 12, shadow: bool = True):
    from PIL import Image, ImageFilter

    pad = outline_px + (24 if shadow else 8)
    w, h = rgba.size
    canvas = Image.new("RGBA", (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
    canvas.paste(rgba, (pad, pad), rgba)

    alpha = canvas.split()[3]
    # Dilata o canal alfa para criar o contorno branco de figurinha
    dilated = alpha
    steps = max(1, outline_px // 2)
    for _ in range(steps):
        dilated = dilated.filter(ImageFilter.MaxFilter(5))
    dilated = dilated.filter(ImageFilter.GaussianBlur(0.8))
    outline_alpha = dilated.point(lambda p: 255 if p > 80 else 0)

    white_layer = Image.new("RGBA", canvas.size, (255, 255, 255, 255))
    white_layer.putalpha(outline_alpha)

    out = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    if shadow:
        shadow_alpha = outline_alpha.filter(ImageFilter.GaussianBlur(10)).point(lambda p: int(p * 0.22))
        shadow_layer = Image.new("RGBA", canvas.size, (10, 14, 40, 255))
        shadow_layer.putalpha(shadow_alpha)
        out.alpha_composite(shadow_layer, (0, 10))

    out.alpha_composite(white_layer)
    out.alpha_composite(canvas)

    bbox = out.getbbox()
    return out.crop(bbox) if bbox else out


def process_file(src: str, dst: str, outline: int, tolerance: int, use_rembg: bool, no_shadow: bool) -> None:
    from PIL import Image

    img = Image.open(src).convert("RGBA")

    # Só remove fundo se ainda não tiver transparência real nos cantos
    corners_alpha = [
        img.getpixel((0, 0))[3],
        img.getpixel((img.width - 1, 0))[3],
        img.getpixel((0, img.height - 1))[3],
        img.getpixel((img.width - 1, img.height - 1))[3],
    ]
    has_transparency = all(a < 20 for a in corners_alpha)

    if not has_transparency:
        if use_rembg:
            try:
                from rembg import remove

                img = remove(img)
            except ImportError:
                print("  [aviso] rembg não instalado, usando remoção por flood-fill.", file=sys.stderr)
                img = remove_bg_floodfill(img, tolerance=tolerance)
        else:
            img = remove_bg_floodfill(img, tolerance=tolerance)

    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)

    if outline > 0:
        img = add_sticker_outline(img, outline_px=outline, shadow=not no_shadow)

    os.makedirs(os.path.dirname(dst) or ".", exist_ok=True)
    img.save(dst)
    print(f"  [ok] {src} -> {dst} ({img.width}x{img.height})")


def main() -> None:
    try:
        import PIL  # noqa: F401
    except ImportError:
        print("ERRO: Pillow não instalado. Instale com: pip install pillow", file=sys.stderr)
        sys.exit(1)

    parser = argparse.ArgumentParser(description="Converte imagens do mascote em stickers com borda branca.")
    parser.add_argument("--input", required=True, help="Arquivo ou pasta de imagens de entrada")
    parser.add_argument("--out", default="engine/public/assets", help="Pasta de saída")
    parser.add_argument("--outline", type=int, default=12, help="Espessura da borda branca em px (0 = sem borda)")
    parser.add_argument("--tolerance", type=int, default=42, help="Tolerância da remoção de fundo sólido")
    parser.add_argument("--rembg", action="store_true", help="Usar rembg (IA) para fundos complexos")
    parser.add_argument("--no-shadow", action="store_true", help="Desativar sombra projetada")
    parser.add_argument("--ext", default="webp", choices=["webp", "png"], help="Formato de saída")
    args = parser.parse_args()

    if os.path.isdir(args.input):
        exts = (".png", ".jpg", ".jpeg", ".webp")
        files = sorted(f for f in os.listdir(args.input) if f.lower().endswith(exts))
        for fname in files:
            base = os.path.splitext(fname)[0]
            process_file(
                os.path.join(args.input, fname),
                os.path.join(args.out, f"{base}.{args.ext}"),
                args.outline,
                args.tolerance,
                args.rembg,
                args.no_shadow,
            )
    else:
        base = os.path.splitext(os.path.basename(args.input))[0]
        process_file(
            args.input,
            os.path.join(args.out, f"{base}.{args.ext}"),
            args.outline,
            args.tolerance,
            args.rembg,
            args.no_shadow,
        )


if __name__ == "__main__":
    main()
