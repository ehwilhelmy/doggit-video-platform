#!/bin/bash

echo "🎥 Compressing video for Supabase (under 50MB)"
echo "============================================"

INPUT="$1"
if [ -z "$INPUT" ]; then
    echo "Usage: ./compress-for-supabase.sh input-video.mp4"
    exit 1
fi

OUTPUT="${INPUT%.*}-compressed.mp4"

echo "Input: $INPUT"
echo "Output: $OUTPUT"
echo ""
echo "Compressing (this may take 5-10 minutes)..."

# Compress to ~45MB for Supabase free tier
ffmpeg -i "$INPUT" \
  -c:v libx264 \
  -crf 28 \
  -preset slow \
  -vf "scale=1280:720" \
  -c:a aac \
  -b:a 96k \
  -movflags +faststart \
  "$OUTPUT" \
  -y

echo ""
echo "✅ Compression complete!"
echo "Original size: $(du -h "$INPUT" | cut -f1)"
echo "New size: $(du -h "$OUTPUT" | cut -f1)"
echo ""
echo "Next steps:"
echo "1. Upload $OUTPUT to Supabase Storage"
echo "2. Get the public URL"
echo "3. Update your code with the new URL"