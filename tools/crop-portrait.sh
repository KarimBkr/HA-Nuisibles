#!/usr/bin/env bash
# Tight 4/5 crop of the client's technician photo for the home portrait (M43): 560 px + 320 px WebP copies.
# Source: public/images/deratisation-annemasse.webp (1200x1595, technician around x 500-780, y 470-1150).
set -e
cd "$(dirname "$0")/.."
SRC=public/images/deratisation-annemasse.webp
magick "$SRC" -crop 624x780+328+385 +repage -resize 560x700 -quality 72 public/images/technicien-portrait.webp
magick "$SRC" -crop 624x780+328+385 +repage -resize 320x400 -quality 70 public/images/technicien-portrait-320.webp
