#!/usr/bin/env python3
"""Build the animated demo reel for the README from the real screenshots.

Cycles through the four example-output screenshots with smooth crossfades and a
short hold on each, plus a caption naming the state. The screenshots are the
project's actual output, so the reel is a faithful ~7s tour, not a mock-up.

Output: docs/screenshots/demo.gif  (looping, README-friendly width)

Usage: python3 scripts/build_demo_gif.py
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SHOTS = ROOT / "docs" / "screenshots"
OUT = SHOTS / "demo.gif"

# Order of the tour and the caption shown for each frame.
SCENES = [
    ("cookie-banner.png", "Cookie banner · opt-in consent, 4 languages, RTL"),
    ("cookie-preferences.png", "Granular consent · necessary / analytics / marketing"),
    ("accessibility-widget.png", "Accessibility widget · font size + 8 toggles"),
    ("high-contrast.png", "High contrast · 120% text, WCAG helpers on"),
]

TARGET_W = 900          # output width in px (height derived per aspect ratio)
FPS = 20                # frames per second
HOLD_S = 1.25           # seconds each scene is held fully visible
FADE_S = 0.45           # seconds of crossfade between scenes
BG = (17, 20, 24)       # letterbox / caption band color
CAPTION_H = 46          # height of the caption band under the image


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for name in (
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ):
        if Path(name).exists():
            return ImageFont.truetype(name, size)
    return ImageFont.load_default()


def fit(img: Image.Image, w: int, h: int) -> Image.Image:
    """Contain img within w x h on a BG canvas, centered."""
    canvas = Image.new("RGB", (w, h), BG)
    scale = min(w / img.width, h / img.height)
    nw, nh = max(1, round(img.width * scale)), max(1, round(img.height * scale))
    resized = img.resize((nw, nh), Image.LANCZOS)
    canvas.paste(resized, ((w - nw) // 2, (h - nh) // 2))
    return canvas


def with_caption(base: Image.Image, text: str, font) -> Image.Image:
    """Stack a caption band under the image."""
    w = base.width
    out = Image.new("RGB", (w, base.height + CAPTION_H), BG)
    out.paste(base, (0, 0))
    draw = ImageDraw.Draw(out)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (w - tw) // 2
    y = base.height + (CAPTION_H - th) // 2 - bbox[1]
    draw.text((x, y), text, fill=(226, 232, 240), font=font)
    return out


def main() -> None:
    font = load_font(20)

    # Determine a common image area from the widest aspect ratio so nothing crops.
    srcs = [Image.open(SHOTS / name).convert("RGB") for name, _ in SCENES]
    max_ratio = max(im.height / im.width for im in srcs)
    img_h = round(TARGET_W * max_ratio)

    # Pre-render each scene (image fitted + caption band) at final size.
    scenes = [
        with_caption(fit(im, TARGET_W, img_h), cap, font)
        for im, (_, cap) in zip(srcs, SCENES)
    ]

    hold_frames = max(1, round(HOLD_S * FPS))
    fade_frames = max(1, round(FADE_S * FPS))

    frames: list[Image.Image] = []
    n = len(scenes)
    for i, cur in enumerate(scenes):
        for _ in range(hold_frames):
            frames.append(cur.copy())
        nxt = scenes[(i + 1) % n]
        for f in range(1, fade_frames + 1):
            frames.append(Image.blend(cur, nxt, f / (fade_frames + 1)))

    duration_ms = round(1000 / FPS)
    frames[0].save(
        OUT,
        save_all=True,
        append_images=frames[1:],
        duration=duration_ms,
        loop=0,
        optimize=True,
        disposal=2,
    )
    total_s = len(frames) * duration_ms / 1000
    kb = OUT.stat().st_size / 1024
    print(f"wrote {OUT.relative_to(ROOT)}  {len(frames)} frames  "
          f"~{total_s:.1f}s  {kb:.0f} KB  {TARGET_W}x{img_h + CAPTION_H}")


if __name__ == "__main__":
    main()
