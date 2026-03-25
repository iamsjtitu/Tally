#!/bin/bash
# Create a simple 512x512 placeholder icon using ImageMagick
convert -size 512x512 xc:#0066cc \
  -font Arial -pointsize 200 -fill white \
  -gravity center -annotate +0+0 "T" \
  icon.png
