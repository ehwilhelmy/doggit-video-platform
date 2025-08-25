-- Create user progress tracking tables
-- This tracks what videos users have watched and their progress

CREATE TABLE IF NOT EXISTS public.video_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  video_id TEXT NOT NULL, -- References video ID from your app
  
  -- Progress tracking
  watched_duration_seconds INTEGER DEFAULT 0,
  total_duration_seconds INTEGER,
  progress_percentage DECIMAL(5,2) DEFAULT 0.00, -- 0.00 to 100.00
  completed BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  first_watched_at TIMESTAMPTZ DEFAULT NOW(),
  last_watched_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Ensure unique progress per user per video
  UNIQUE(user_id, video_id)
);

-- Create updated_at trigger for video_progress
CREATE TRIGGER video_progress_updated_at
  BEFORE UPDATE ON public.video_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.video_progress ENABLE ROW LEVEL SECURITY;

-- Policies for video_progress table
-- Users can view their own progress
CREATE POLICY "Users can view own progress" ON public.video_progress
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress" ON public.video_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own progress" ON public.video_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Create user watchlist table
CREATE TABLE IF NOT EXISTS public.user_watchlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  video_id TEXT NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Ensure unique watchlist entries per user per video
  UNIQUE(user_id, video_id)
);

-- Enable Row Level Security for watchlist
ALTER TABLE public.user_watchlist ENABLE ROW LEVEL SECURITY;

-- Policies for user_watchlist table
CREATE POLICY "Users can view own watchlist" ON public.user_watchlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own watchlist" ON public.user_watchlist
  FOR ALL USING (auth.uid() = user_id);

-- Functions for progress tracking
CREATE OR REPLACE FUNCTION public.update_video_progress(
  p_video_id TEXT,
  p_watched_duration INTEGER,
  p_total_duration INTEGER DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  progress_pct DECIMAL(5,2);
  is_completed BOOLEAN DEFAULT FALSE;
BEGIN
  -- Calculate progress percentage
  IF p_total_duration > 0 THEN
    progress_pct = (p_watched_duration::DECIMAL / p_total_duration::DECIMAL) * 100;
    -- Consider video completed if watched >= 95%
    is_completed = progress_pct >= 95.0;
  ELSE
    progress_pct = 0;
  END IF;

  -- Insert or update progress
  INSERT INTO public.video_progress (
    user_id, 
    video_id, 
    watched_duration_seconds, 
    total_duration_seconds,
    progress_percentage,
    completed,
    completed_at,
    last_watched_at
  ) VALUES (
    auth.uid(),
    p_video_id,
    p_watched_duration,
    COALESCE(p_total_duration, 0),
    progress_pct,
    is_completed,
    CASE WHEN is_completed THEN NOW() ELSE NULL END,
    NOW()
  )
  ON CONFLICT (user_id, video_id) 
  DO UPDATE SET
    watched_duration_seconds = GREATEST(video_progress.watched_duration_seconds, p_watched_duration),
    total_duration_seconds = COALESCE(p_total_duration, video_progress.total_duration_seconds),
    progress_percentage = progress_pct,
    completed = is_completed,
    completed_at = CASE 
      WHEN is_completed AND video_progress.completed_at IS NULL 
      THEN NOW() 
      ELSE video_progress.completed_at 
    END,
    last_watched_at = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's video progress
CREATE OR REPLACE FUNCTION public.get_user_progress(p_video_id TEXT DEFAULT NULL)
RETURNS TABLE(
  video_id TEXT,
  watched_duration_seconds INTEGER,
  progress_percentage DECIMAL(5,2),
  completed BOOLEAN,
  last_watched_at TIMESTAMPTZ
) AS $$
BEGIN
  IF p_video_id IS NOT NULL THEN
    -- Get specific video progress
    RETURN QUERY
    SELECT 
      vp.video_id,
      vp.watched_duration_seconds,
      vp.progress_percentage,
      vp.completed,
      vp.last_watched_at
    FROM public.video_progress vp
    WHERE vp.user_id = auth.uid() AND vp.video_id = p_video_id;
  ELSE
    -- Get all user progress
    RETURN QUERY
    SELECT 
      vp.video_id,
      vp.watched_duration_seconds,
      vp.progress_percentage,
      vp.completed,
      vp.last_watched_at
    FROM public.video_progress vp
    WHERE vp.user_id = auth.uid()
    ORDER BY vp.last_watched_at DESC;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;