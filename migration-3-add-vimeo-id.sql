-- Migration 3: Add vimeo_id column to videos table
-- This allows storing Vimeo video IDs instead of full URLs

-- Add vimeo_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'videos' AND column_name = 'vimeo_id'
  ) THEN
    ALTER TABLE videos ADD COLUMN vimeo_id text;
  END IF;
END $$;

-- Add comment to explain the column
COMMENT ON COLUMN videos.vimeo_id IS 'Vimeo video ID for embedded videos (e.g., 1114969488)';
