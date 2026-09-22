"""Keeps property photos off a VPS's disk budget.

Nothing here validates *whether* a photo should be kept — it just makes sure
whatever gets kept is web-sized: a phone camera or a professional DSLR easily
produces 5-20MB originals, and none of that extra resolution is visible in a
listing card or even the full-bleed hero. Every photo that reaches an Image
row, from a manual upload or from an imported listing, passes through here
first.
"""
import io

from django.core.files.base import ContentFile
from PIL import Image as PILImage, ImageOps

# 2400px on the long edge comfortably exceeds any on-site display size (the
# full-bleed hero) even on a hi-dpi screen, and JPEG quality 82 is well past
# the point of visible loss for a photograph. Together these typically turn
# 5-15MB originals into a few hundred KB.
MAX_DIMENSION = 2400
JPEG_QUALITY = 82


def compress_image(source, filename_hint="foto.jpg"):
    """`source` is raw bytes or a Django UploadedFile. Returns (ContentFile,
    filename) resized and re-encoded as JPEG. Falls back to the original
    bytes, unchanged, if Pillow can't make sense of it — a compression
    hiccup should never be the reason a photo fails to save."""
    raw = bytes(source) if isinstance(source, (bytes, bytearray)) else source.read()
    base = (filename_hint or "foto.jpg").rsplit(".", 1)[0] or "foto"

    try:
        img = PILImage.open(io.BytesIO(raw))
        img.load()
        img = ImageOps.exif_transpose(img)  # camera rotation, before we lose the EXIF tag
        if img.mode not in ("RGB", "L"):
            img = img.convert("RGB")

        width, height = img.size
        longest = max(width, height)
        if longest > MAX_DIMENSION:
            scale = MAX_DIMENSION / longest
            img = img.resize((round(width * scale), round(height * scale)), PILImage.LANCZOS)

        out = io.BytesIO()
        img.save(out, format="JPEG", quality=JPEG_QUALITY, optimize=True)
        return ContentFile(out.getvalue()), f"{base}.jpg"
    except Exception:
        return ContentFile(raw), filename_hint or "foto.jpg"
