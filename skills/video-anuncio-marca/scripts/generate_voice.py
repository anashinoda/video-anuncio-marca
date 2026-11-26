#!/usr/bin/env python3
"""
generate_voice.py — Gera locução neural em PT-BR (grátis via edge-tts)
com arquivo MP3, legendas VTT e timestamps palavra por palavra (words.json)
prontos para sincronização no Remotion.

Requisitos:
  pip install edge-tts

Uso:
  python3 generate_voice.py --text-file roteiro_voz.txt --voice pt-BR-AntonioNeural --out engine/public/audio --fps 30
"""

import argparse
import asyncio
import json
import os
import re
import sys


VOICES = {
    "antonio": "pt-BR-AntonioNeural",
    "francisca": "pt-BR-FranciscaNeural",
    "thalita": "pt-BR-ThalitaMultilingualNeural",
}


def clean_script_for_tts(raw_text: str) -> str:
    """Remove marcações de direção/ElevenLabs como [sighs], [whispers], <break.../>."""
    text = re.sub(r"\[[^\]]+\]", "", raw_text)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


async def synthesize(
    text: str,
    voice: str,
    rate: str,
    pitch: str,
    out_dir: str,
    fps: int,
    prefix: str,
) -> None:
    try:
        import edge_tts
    except ImportError:
        print(
            "ERRO: edge-tts não está instalado. Instale com:\n  pip install edge-tts",
            file=sys.stderr,
        )
        sys.exit(1)

    os.makedirs(out_dir, exist_ok=True)
    mp3_path = os.path.join(out_dir, f"{prefix}.mp3")
    words_path = os.path.join(out_dir, "words.json")
    srt_path = os.path.join(out_dir, f"{prefix}.srt")

    communicate = edge_tts.Communicate(
        text,
        voice=voice,
        rate=rate,
        pitch=pitch,
        boundary="WordBoundary",
    )

    words = []
    with open(mp3_path, "wb") as audio_file:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_file.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                start_sec = chunk["offset"] / 10_000_000.0
                dur_sec = chunk["duration"] / 10_000_000.0
                end_sec = start_sec + dur_sec
                word_text = chunk["text"].strip()
                if word_text:
                    words.append(
                        {
                            "word": word_text,
                            "start": round(start_sec, 4),
                            "end": round(end_sec, 4),
                            "startFrame": round(start_sec * fps),
                            "endFrame": max(round(start_sec * fps) + 1, round(end_sec * fps)),
                        }
                    )

    total_duration = words[-1]["end"] + 0.5 if words else 0.0
    payload = {
        "fps": fps,
        "voice": voice,
        "duration": round(total_duration, 3),
        "durationInFrames": round(total_duration * fps),
        "words": words,
    }

    with open(words_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    # Gera SRT agrupado (3 palavras por bloco)
    def fmt_srt(sec: float) -> str:
        ms = int(round(sec * 1000))
        h = ms // 3600000
        ms %= 3600000
        m = ms // 60000
        ms %= 60000
        s = ms // 1000
        ms %= 1000
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

    with open(srt_path, "w", encoding="utf-8") as sf:
        idx = 1
        for i in range(0, len(words), 3):
            group = words[i : i + 3]
            sf.write(f"{idx}\n")
            sf.write(f"{fmt_srt(group[0]['start'])} --> {fmt_srt(group[-1]['end'])}\n")
            sf.write(" ".join(w["word"] for w in group) + "\n\n")
            idx += 1

    print(f"[ok] Áudio:     {mp3_path}")
    print(f"[ok] Timestamps:{words_path} ({len(words)} palavras, ~{total_duration:.2f}s)")
    print(f"[ok] Legendas:  {srt_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Gera locução pt-BR + words.json via edge-tts.")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--text", help="Texto direto para narrar")
    group.add_argument("--text-file", help="Arquivo .txt com o texto da locução")
    parser.add_argument(
        "--voice",
        default="antonio",
        help="Voz (antonio, francisca, thalita ou nome completo Edge-TTS)",
    )
    parser.add_argument("--rate", default="+6%", help="Velocidade da fala (ex: +0%, +6%, +12%)")
    parser.add_argument("--pitch", default="+0Hz", help="Tom da voz (ex: +0Hz, -2Hz, +3Hz)")
    parser.add_argument("--out", default="engine/public/audio", help="Pasta de saída")
    parser.add_argument("--prefix", default="voz", help="Prefixo do arquivo MP3/SRT")
    parser.add_argument("--fps", type=int, default=30, help="FPS do vídeo para calcular frames")
    args = parser.parse_args()

    voice_name = VOICES.get(args.voice.lower(), args.voice)
    raw = args.text if args.text else open(args.text_file, encoding="utf-8").read()
    clean = clean_script_for_tts(raw)

    asyncio.run(synthesize(clean, voice_name, args.rate, args.pitch, args.out, args.fps, args.prefix))


if __name__ == "__main__":
    main()
