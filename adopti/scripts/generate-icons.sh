#!/bin/bash

# Script para generar iconos PWA desde adopti_app.jpg
# Requiere ImageMagick (brew install imagemagick)

SOURCE_IMAGE="public/adopti_app.jpg"
OUTPUT_DIR="public"

# Tamaños de iconos necesarios para PWA
SIZES=(72 96 128 144 152 192 384 512)

echo "Generando iconos PWA desde $SOURCE_IMAGE..."

for size in "${SIZES[@]}"; do
  output_file="$OUTPUT_DIR/icon-${size}x${size}.png"
  echo "Generando $output_file..."
  
  # Convertir y redimensionar la imagen
  convert "$SOURCE_IMAGE" \
    -resize "${size}x${size}" \
    -gravity center \
    -extent "${size}x${size}" \
    -background white \
    "$output_file"
done

echo "✅ Iconos generados exitosamente!"
