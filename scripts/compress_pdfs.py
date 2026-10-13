"""Compress the thesis and dissertation PDFs into public/docs/.

Originals stay outside git (see .gitignore). Images are downsampled to a
target resolution and the file is rewritten with garbage collection and
deflate. Prints the final size in MB for each output so the link text can
state it.

Usage: python -I scripts/compress_pdfs.py [--dpi 150]
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import pymupdf as fitz

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "docs"
LIMIT_MB = 10.0

JOBS = [
    (ROOT / "TeseJaline_correcoesProfeFatima.pdf", OUT_DIR / "tese-clat-jaline-mombach.pdf"),
    (ROOT / "dissertacaoJaline.pdf", OUT_DIR / "dissertacao-jaline-mombach.pdf"),
]


def downsample_images(doc: fitz.Document, target_dpi: float) -> int:
    """Downsample each embedded image to target_dpi at its placed size."""
    done: set[int] = set()
    changed = 0
    for page in doc:
        for info in page.get_images(full=True):
            xref = info[0]
            if xref in done:
                continue
            done.add(xref)
            rects = page.get_image_rects(xref)
            if not rects:
                continue
            placed_w_in = max(r.width for r in rects) / 72.0
            if placed_w_in <= 0:
                continue
            smask = info[1]
            pix = fitz.Pixmap(doc, xref)
            if pix.alpha:
                pix = fitz.Pixmap(pix, 0)  # drop alpha; the soft mask is handled below
            if pix.colorspace is None or pix.colorspace.n > 3:
                pix = fitz.Pixmap(fitz.csRGB, pix)
            current_dpi = pix.width / placed_w_in
            if current_dpi <= target_dpi * 1.05:
                continue
            scale = target_dpi / current_dpi
            new_w = max(1, round(pix.width * scale))
            new_h = max(1, round(pix.height * scale))
            small = fitz.Pixmap(pix, new_w, new_h)
            # Re-encode as JPEG: a raw pixmap would inflate the file.
            page.replace_image(xref, stream=small.tobytes("jpg", jpg_quality=80))
            if smask:
                # Downsample the soft mask to the same size so the two stay aligned.
                mask = fitz.Pixmap(doc, smask)
                if mask.n > 1:
                    mask = fitz.Pixmap(fitz.csGRAY, mask)
                mask_small = fitz.Pixmap(mask, new_w, new_h)
                page.replace_image(smask, stream=mask_small.tobytes("jpg", jpg_quality=80))
            changed += 1
    return changed


def compress(src: Path, dst: Path, target_dpi: float) -> float:
    doc = fitz.open(src)
    try:
        n = downsample_images(doc, target_dpi)
        dst.parent.mkdir(parents=True, exist_ok=True)
        doc.save(dst, garbage=4, deflate=True, clean=True)
        print(f"{dst.name}: {n} images downsampled to ~{target_dpi:g} dpi")
    finally:
        doc.close()
    return dst.stat().st_size / (1024 * 1024)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dpi", type=float, default=150.0)
    args = parser.parse_args()

    # Start at --dpi and step down through lower resolutions until every
    # output is under the limit or the floor is reached.
    steps = [args.dpi] + [d for d in (120.0, 100.0) if d < args.dpi]
    for dpi in steps:
        sizes = {}
        for src, dst in JOBS:
            if not src.exists():
                print(f"missing original: {src}", file=sys.stderr)
                return 1
            sizes[dst] = compress(src, dst, dpi)
        if all(mb < LIMIT_MB for mb in sizes.values()):
            break
        print(f"some output still >= {LIMIT_MB} MB at {dpi:g} dpi; trying a lower resolution")

    for dst, mb in sizes.items():
        print(f"{dst.relative_to(ROOT).as_posix()}: {mb:.2f} MB")
    return 0 if all(mb < LIMIT_MB for mb in sizes.values()) else 2


if __name__ == "__main__":
    raise SystemExit(main())
