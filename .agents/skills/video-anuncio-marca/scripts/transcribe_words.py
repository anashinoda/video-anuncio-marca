#!/usr/bin/env python3
"""
transcribe_words.py — Extrai timestamps palavra por palavra (words.json) a partir de:
  1. Um arquivo de áudio (voz.mp3 / voz.wav do ElevenLabs ou gravação própria) via faster-whisper ou whisper.
  2. Um JSON de alinhamento do ElevenLabs (/with-timestamps).
  3. Um arquivo SRT/VTT (distribuição proporcional por caracteres quando não há word-level).

Uso:
  python3 transcribe_words.py --input engine/public/audio/voz.mp3 --out engine/public/audio/words.json --fps 30
  python3 transcribe_words.py --input voz.srt --out engine/public/audio/words.json --fps 30
"""

import argparse
import json
import os
import re
import sys


def to_payload(words: list[dict], fps: int, source: str) -> dict:
    formatted = []
    for w in words:
        start = round(float(w["start"]), 4)
        end = round(float(w["end"]), 4)
        sf = round(start * fps)
        ef = max(sf + 1, round(end * fps))
        formatted.append(
            {
                "word": w["word"].strip(),
                "start": start,
                "end": end,
                "startFrame": sf,
                "endFrame": ef,
            }
        )
    duration = formatted[-1]["end"] + 0.5 if formatted else 0.0
    return {
        "fps": fps,
        "source": source,
        "duration": round(duration, 3),
        "durationInFrames": round(duration * fps),
        "words": formatted,
    }


def parse_timestamp(ts: str) -> float:
    ts = ts.strip().replace(",", ".")
    parts = ts.split(":")
    if len(parts) == 3:
        h, m, s = parts
        return int(h) * 3600 + int(m) * 60 + float(s)
    if len(parts) == 2:
        m, s = parts
        return int(m) * 60 + float(s)
    return float(ts)


def parse_srt_or_vtt(path: str) -> list[dict]:
    content = open(path, encoding="utf-8").read()
    blocks = re.split(r"\r?\n\r?\n", content.strip())
    words = []
    time_re = re.compile(r"(\d{1,2}:\d{2}:\d{2}[.,]\d{3}|\d{2}:\d{2}[.,]\d{3})\s*-->\s*(\d{1,2}:\d{2}:\d{2}[.,]\d{3}|\d{2}:\d{2}[.,]\d{3})")
    for block in blocks:
        lines = [l.strip() for l in block.splitlines() if l.strip()]
        match_idx = -1
        start_s, end_s = 0.0, 0.0
        for i, line in enumerate(lines):
            m = time_re.search(line)
            if m:
                start_s = parse_timestamp(m.group(1))
                end_s = parse_timestamp(m.group(2))
                match_idx = i
                break
        if match_idx < 0:
            continue
        text = " ".join(lines[match_idx + 1 :])
        text = re.sub(r"<[^>]+>", "", text).strip()
        tokens = [t for t in text.split() if t]
        if not tokens:
            continue
        total_chars = sum(max(1, len(t)) for t in tokens)
        cursor = start_s
        span = max(0.05, end_s - start_s)
        for tok in tokens:
            w_dur = span * (max(1, len(tok)) / total_chars)
            words.append({"word": tok, "start": cursor, "end": cursor + w_dur})
            cursor += w_dur
    return words


def parse_elevenlabs_json(path: str) -> list[dict]:
    data = json.load(open(path, encoding="utf-8"))
    alignment = data.get("alignment") or data.get("normalized_alignment") or data
    chars = alignment.get("characters", [])
    starts = alignment.get("character_start_times_seconds", [])
    ends = alignment.get("character_end_times_seconds", [])
    words = []
    cur = []
    w_start = None
    w_end = None
    for ch, st, en in zip(chars, starts, ends):
        if ch.isspace():
            if cur:
                words.append({"word": "".join(cur), "start": w_start, "end": w_end})
                cur = []
                w_start = None
        else:
            if w_start is None:
                w_start = st
            w_end = en
            cur.append(ch)
    if cur:
        words.append({"word": "".join(cur), "start": w_start, "end": w_end})
    return words


def transcribe_audio(path: str, model_size: str, language: str) -> tuple[list[dict], str]:
    try:
        from faster_whisper import WhisperModel

        model = WhisperModel(model_size, device="auto", compute_type="int8")
        segments, _ = model.transcribe(path, language=language, word_timestamps=True, vad_filter=True)
        words = []
        for seg in segments:
            if seg.words:
                for w in seg.words:
                    words.append({"word": w.word.strip(), "start": w.start, "end": w.end})
        return words, f"faster-whisper:{model_size}"
    except ImportError:
        pass

    try:
        import whisper

        model = whisper.load_model(model_size)
        result = model.transcribe(path, language=language, word_timestamps=True)
        words = []
        for seg in result.get("segments", []):
            for w in seg.get("words", []):
                words.append({"word": w["word"].strip(), "start": w["start"], "end": w["end"]})
        return words, f"openai-whisper:{model_size}"
    except ImportError:
        print(
            "ERRO: Instale faster-whisper (recomendado) ou openai-whisper para transcrever áudio:\n"
            "  pip install faster-whisper\n"
            "Ou forneça um arquivo .srt / .vtt / JSON do ElevenLabs.",
            file=sys.stderr,
        )
        sys.exit(1)


def main() -> None:
    parser = argparse.ArgumentParser(description="Extrai timestamps palavra por palavra para Remotion.")
    parser.add_argument("--input", required=True, help="Arquivo de entrada (.mp3, .wav, .m4a, .srt, .vtt, .json)")
    parser.add_argument("--out", default="engine/public/audio/words.json", help="Caminho de saída do words.json")
    parser.add_argument("--fps", type=int, default=30, help="FPS do vídeo (padrão: 30)")
    parser.add_argument("--model", default="small", help="Modelo Whisper (tiny, base, small, medium, large-v3)")
    parser.add_argument("--lang", default="pt", help="Código do idioma (padrão: pt)")
    args = parser.parse_args()

    ext = os.path.splitext(args.input)[1].lower()
    if ext in (".srt", ".vtt"):
        words = parse_srt_or_vtt(args.input)
        source = f"subtitle:{ext}"
    elif ext == ".json":
        words = parse_elevenlabs_json(args.input)
        source = "elevenlabs-alignment"
    else:
        words, source = transcribe_audio(args.input, args.model, args.lang)

    payload = to_payload(words, args.fps, source)
    os.makedirs(os.path.dirname(args.out) or ".", exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"[ok] {len(payload['words'])} palavras extraídas ({source}) -> {args.out}")


if __name__ == "__main__":
    main()
