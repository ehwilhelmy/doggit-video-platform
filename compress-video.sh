#!/bin/bash

# Video Compression Script
# This will reduce your 350MB video to ~50-100MB with minimal quality loss

echo "🎥 Video Compression Tool"
echo "========================"

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg not found. Install it with: brew install ffmpeg"
    exit 1
fi

INPUT_VIDEO="puppy-basics-original.mp4"
OUTPUT_VIDEO="puppy-basics-compressed.mp4"

echo "Compressing video (this may take a few minutes)..."

# Option 1: Balanced quality/size (aim for ~80-100MB)
ffmpeg -i "$INPUT_VIDEO" \
  -c:v libx264 \
  -crf 28 \
  -preset slow \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  "$OUTPUT_VIDEO"

# Option 2: Maximum compression (aim for ~40-60MB) - uncomment to use
# ffmpeg -i "$INPUT_VIDEO" \
#   -c:v libx264 \
#   -crf 32 \
#   -preset slow \
#   -vf "scale=1280:720" \
#   -c:a aac \
#   -b:a 96k \
#   -movflags +faststart \
#   "${OUTPUT_VIDEO%.mp4}-small.mp4"

echo "✅ Compression complete!"
echo "Original size: $(du -h "$INPUT_VIDEO" | cut -f1)"
echo "New size: $(du -h "$OUTPUT_VIDEO" | cut -f1)"