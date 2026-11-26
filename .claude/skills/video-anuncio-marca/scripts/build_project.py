#!/usr/bin/env python3
"""
build_project.py — Sincroniza um roteiro estruturado (storyboard.json) com os timestamps reais
de áudio (words.json) para produzir um arquivo de projeto pronto para o motor Remotion.

Uso:
  python3 build_project.py \
    --storyboard storyboard.json \
    --words engine/public/audio/words.json \
    --out engine/src/projects/current.json
"""

import argparse
import json
import os
import re
import unicodedata


def normalize_token(token: str) -> str:
    s = unicodedata.normalize("NFD", token.lower())
    s = "".join(ch for ch in s if unicodedata.category(ch) != "Mn")
    return re.sub(r"[^a-z0-9]", "", s)


def align_scenes(storyboard: dict, words_data: dict) -> dict:
    fps = int(words_data.get("fps", storyboard.get("fps", 30)))
    all_words = words_data.get("words", [])
    scenes = storyboard.get("scenes", [])

    cursor = 0
    aligned_scenes = []

    for idx, scene in enumerate(scenes):
        script_text = scene.get("text", "").strip()
        target_tokens = [t for t in script_text.split() if t]
        scene_words = []

        if target_tokens and all_words:
            # Alinhamento sequencial tolerante a pontuação/pequenas variações do Whisper
            for tok in target_tokens:
                norm_t = normalize_token(tok)
                matched = None
                search_end = min(len(all_words), cursor + 6)
                for j in range(cursor, search_end):
                    norm_w = normalize_token(all_words[j]["word"])
                    if norm_w == norm_t or (len(norm_t) >= 4 and (norm_t in norm_w or norm_w in norm_t)):
                        matched = j
                        break
                if matched is not None:
                    # Consome eventuais palavras intermediárias
                    for k in range(cursor, matched + 1):
                        scene_words.append(all_words[k])
                    cursor = matched + 1
                elif cursor < len(all_words):
                    # Fallback posicional
                    scene_words.append(all_words[cursor])
                    cursor += 1

        if scene_words:
            start_frame = scene_words[0]["startFrame"]
            end_frame = scene_words[-1]["endFrame"] + round(fps * 0.12)
        else:
            prev_end = (
                aligned_scenes[-1]["startFrame"] + aligned_scenes[-1]["durationInFrames"]
                if aligned_scenes
                else 0
            )
            start_frame = prev_end
            end_frame = start_frame + round(scene.get("fallbackDurationSec", 2.5) * fps)

        # Ajusta emenda com a cena anterior para não haver buracos pretos
        if aligned_scenes:
            prev = aligned_scenes[-1]
            prev_end = prev["startFrame"] + prev["durationInFrames"]
            if start_frame > prev_end:
                prev["durationInFrames"] = start_frame - prev["startFrame"]
            elif start_frame < prev_end:
                start_frame = prev_end

        duration_frames = max(round(fps * 0.6), end_frame - start_frame)

        # Converte timestamps das palavras para frames relativos ao início da cena
        rel_words = []
        for w in scene_words:
            rel_start = max(0, w["startFrame"] - start_frame)
            rel_end = max(rel_start + 1, w["endFrame"] - start_frame)
            rel_words.append(
                {
                    "word": w["word"],
                    "startFrame": rel_start,
                    "endFrame": rel_end,
                }
            )

        out_scene = dict(scene)
        out_scene["id"] = scene.get("id", f"scene-{idx + 1:02d}")
        out_scene["startFrame"] = start_frame
        out_scene["durationInFrames"] = duration_frames
        if rel_words:
            out_scene["words"] = rel_words
        aligned_scenes.append(out_scene)

    # Garante respiro final de 0.45s na última cena
    if aligned_scenes:
        aligned_scenes[-1]["durationInFrames"] += round(fps * 0.45)

    total_frames = (
        aligned_scenes[-1]["startFrame"] + aligned_scenes[-1]["durationInFrames"]
        if aligned_scenes
        else round(fps * 10)
    )

    project = dict(storyboard)
    project["fps"] = fps
    project["durationInFrames"] = total_frames
    project["scenes"] = aligned_scenes
    return project


def main() -> None:
    parser = argparse.ArgumentParser(description="Alinha storyboard.json com words.json para Remotion.")
    parser.add_argument("--storyboard", required=True, help="Caminho do storyboard.json")
    parser.add_argument("--words", required=True, help="Caminho do words.json")
    parser.add_argument("--out", default="engine/src/projects/current.json", help="Arquivo de saída do projeto")
    args = parser.parse_args()

    storyboard = json.load(open(args.storyboard, encoding="utf-8"))
    words_data = json.load(open(args.words, encoding="utf-8"))
    project = align_scenes(storyboard, words_data)

    os.makedirs(os.path.dirname(args.out) or ".", exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(project, f, ensure_ascii=False, indent=2)

    print(
        f"[ok] Projeto alinhado: {len(project['scenes'])} cenas, "
        f"{project['durationInFrames']} frames ({project['durationInFrames'] / project['fps']:.2f}s) -> {args.out}"
    )


if __name__ == "__main__":
    main()
