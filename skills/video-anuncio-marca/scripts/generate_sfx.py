#!/usr/bin/env python3
"""
generate_sfx.py — Sintetizador de efeitos sonoros (SFX) para a skill video-anuncio-marca.
Gera 8 arquivos WAV 44.1kHz 16-bit limpos sem dependências externas (apenas stdlib Python).

Uso:
  python3 generate_sfx.py --out engine/public/sfx
"""

import argparse
import math
import os
import random
import struct
import wave

SAMPLE_RATE = 44100


def write_wav(path: str, samples: list[float]) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    peak = max((abs(s) for s in samples), default=1.0)
    scale = 0.92 / peak if peak > 1e-6 else 1.0
    with wave.open(path, "w") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        frames = bytearray()
        for s in samples:
            val = max(-1.0, min(1.0, s * scale))
            frames.extend(struct.pack("<h", int(val * 32767)))
        wf.writeframes(bytes(frames))


def lowpass(samples: list[float], cutoff_hz: float) -> list[float]:
    rc = 1.0 / (2.0 * math.pi * max(cutoff_hz, 20.0))
    dt = 1.0 / SAMPLE_RATE
    alpha = dt / (rc + dt)
    out = []
    y = 0.0
    for x in samples:
        y = y + alpha * (x - y)
        out.append(y)
    return out


def gen_pop(dur: float = 0.14) -> list[float]:
    n = int(SAMPLE_RATE * dur)
    out = []
    phase = 0.0
    for i in range(n):
        t = i / SAMPLE_RATE
        p = t / dur
        freq = 240.0 + 520.0 * math.exp(-p * 9.0)
        env = math.sin(min(1.0, p * 8.0) * math.pi / 2.0) * math.exp(-p * 6.5)
        phase += 2.0 * math.pi * freq / SAMPLE_RATE
        out.append(math.sin(phase) * env)
    return out


def gen_click(dur: float = 0.07) -> list[float]:
    rng = random.Random(42)
    n = int(SAMPLE_RATE * dur)
    out = []
    for i in range(n):
        t = i / SAMPLE_RATE
        p = t / dur
        env = math.exp(-p * 18.0)
        tone = math.sin(2 * math.pi * 1650 * t) * 0.7 + math.sin(2 * math.pi * 3400 * t) * 0.3
        noise = (rng.random() * 2.0 - 1.0) * math.exp(-p * 30.0) * 0.45
        out.append((tone + noise) * env)
    return out


def gen_type_key(dur: float = 0.055) -> list[float]:
    rng = random.Random(7)
    n = int(SAMPLE_RATE * dur)
    raw = []
    for i in range(n):
        t = i / SAMPLE_RATE
        p = t / dur
        env = math.exp(-p * 24.0)
        click = math.sin(2 * math.pi * (2400 - 1200 * p) * t) * 0.5
        thock = math.sin(2 * math.pi * 420 * t) * 0.5
        noise = (rng.random() * 2.0 - 1.0) * 0.6
        raw.append((click + thock + noise) * env)
    return lowpass(raw, 4800.0)


def gen_whoosh(dur: float = 0.34) -> list[float]:
    rng = random.Random(101)
    n = int(SAMPLE_RATE * dur)
    raw = []
    y1 = 0.0
    y2 = 0.0
    for i in range(n):
        t = i / SAMPLE_RATE
        p = t / dur
        env = math.sin(math.pi * p) ** 1.35
        cutoff = 280.0 + 2600.0 * (math.sin(math.pi * p) ** 1.5)
        rc = 1.0 / (2.0 * math.pi * cutoff)
        alpha = (1.0 / SAMPLE_RATE) / (rc + 1.0 / SAMPLE_RATE)
        noise = rng.random() * 2.0 - 1.0
        y1 += alpha * (noise - y1)
        y2 += alpha * (y1 - y2)
        sub = math.sin(2 * math.pi * (140 - 60 * p) * t) * 0.22
        raw.append((y2 * 2.2 + sub) * env)
    return raw


def gen_scratch_x(dur: float = 0.22) -> list[float]:
    rng = random.Random(99)
    n = int(SAMPLE_RATE * dur)
    raw = []
    phase = 0.0
    for i in range(n):
        t = i / SAMPLE_RATE
        p = t / dur
        env = math.sin(min(1.0, p * 6.0) * math.pi / 2.0) * math.exp(-p * 3.8)
        freq = 900.0 - 520.0 * p
        phase += 2.0 * math.pi * freq / SAMPLE_RATE
        grit = (rng.random() * 2.0 - 1.0) * 0.75
        tone = math.sin(phase) * 0.35
        raw.append((grit + tone) * env)
    return lowpass(raw, 3400.0)


def gen_ding(dur: float = 0.55) -> list[float]:
    n = int(SAMPLE_RATE * dur)
    out = []
    freqs = [1046.5, 1318.5, 1568.0, 2093.0]  # C6 major sparkle
    weights = [0.55, 0.25, 0.15, 0.12]
    for i in range(n):
        t = i / SAMPLE_RATE
        p = t / dur
        attack = min(1.0, t / 0.008)
        env = attack * math.exp(-p * 4.8)
        val = sum(w * math.sin(2 * math.pi * f * t) for f, w in zip(freqs, weights))
        out.append(val * env)
    return out


def gen_confetti(dur: float = 0.65) -> list[float]:
    rng = random.Random(2026)
    n = int(SAMPLE_RATE * dur)
    out = []
    for i in range(n):
        t = i / SAMPLE_RATE
        p = t / dur
        # Pop inicial + brilho espumante
        pop_env = math.exp(-p * 18.0)
        pop = math.sin(2 * math.pi * (180 + 360 * math.exp(-p * 12)) * t) * pop_env
        shimmer = (rng.random() * 2.0 - 1.0) * (math.sin(math.pi * min(1.0, p * 1.2)) * math.exp(-p * 3.5)) * 0.45
        chime = (
            math.sin(2 * math.pi * 880 * t) * 0.25
            + math.sin(2 * math.pi * 1320 * t) * 0.2
            + math.sin(2 * math.pi * 1760 * t) * 0.15
        ) * math.exp(-max(0.0, p - 0.05) * 4.2)
        out.append(pop * 0.7 + shimmer + chime)
    return lowpass(out, 6800.0)


def gen_bass_drop(dur: float = 0.48) -> list[float]:
    rng = random.Random(55)
    n = int(SAMPLE_RATE * dur)
    out = []
    phase = 0.0
    for i in range(n):
        t = i / SAMPLE_RATE
        p = t / dur
        freq = 165.0 * math.exp(-p * 3.5) + 42.0
        phase += 2.0 * math.pi * freq / SAMPLE_RATE
        env = min(1.0, t / 0.006) * math.exp(-p * 3.2)
        punch = (rng.random() * 2.0 - 1.0) * math.exp(-p * 28.0) * 0.35
        out.append((math.sin(phase) + 0.25 * math.sin(phase * 2.0) + punch) * env)
    return lowpass(out, 2400.0)


SFX_GENERATORS = {
    "pop.wav": gen_pop,
    "click.wav": gen_click,
    "type_key.wav": gen_type_key,
    "whoosh.wav": gen_whoosh,
    "scratch_x.wav": gen_scratch_x,
    "ding.wav": gen_ding,
    "confetti.wav": gen_confetti,
    "bass_drop.wav": gen_bass_drop,
}


def main() -> None:
    parser = argparse.ArgumentParser(description="Gera biblioteca de SFX sintetizados em WAV.")
    parser.add_argument("--out", default="engine/public/sfx", help="Pasta de destino dos arquivos WAV")
    args = parser.parse_args()

    os.makedirs(args.out, exist_ok=True)
    for filename, fn in SFX_GENERATORS.items():
        path = os.path.join(args.out, filename)
        write_wav(path, fn())
        print(f"  [ok] {path}")
    print(f"\nConcluído: {len(SFX_GENERATORS)} efeitos sonoros gerados em {args.out}")


if __name__ == "__main__":
    main()
