-- Create video_notes table to store user notes for videos
CREATE TABLE IF NOT EXISTS video_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- Ensure one notes record per user per video
  UNIQUE(user_id, video_id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE video_notes ENABLE ROW LEVEL SECURITY;

-- Create policy: users can only access their own notes
CREATE POLICY "Users can manage their own video notes" ON video_notes
  FOR ALL USING (auth.uid() = user_id);

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_video_notes_user_video ON video_notes(user_id, video_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_video_notes_updated_at 
  BEFORE UPDATE ON video_notes 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();