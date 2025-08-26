-- ========================================
-- COMBINED MIGRATION SCRIPT FOR SUPABASE
-- Run this in your Supabase Dashboard SQL Editor
-- ========================================

-- Migration 001: Create user profiles table
-- This extends the built-in auth.users with additional profile information

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  pup_name TEXT, -- For the personalized experience
  training_goals TEXT[], -- Array of selected training goals
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles table
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'firstName'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', NEW.raw_user_meta_data->>'lastName')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- Migration 002: Create subscriptions table
-- ========================================

CREATE TYPE subscription_status AS ENUM (
  'active',
  'canceled',
  'past_due',
  'unpaid',
  'incomplete',
  'incomplete_expired',
  'trialing',
  'paused'
);

CREATE TYPE billing_interval AS ENUM ('month', 'year');

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Stripe subscription details
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  stripe_price_id TEXT,
  
  -- Subscription details
  status subscription_status NOT NULL DEFAULT 'incomplete',
  billing_interval billing_interval DEFAULT 'month',
  amount_cents INTEGER, -- Amount in cents (e.g., 999 for $9.99)
  currency TEXT DEFAULT 'usd',
  
  -- Dates
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Ensure one active subscription per user
  UNIQUE(user_id, status) DEFERRABLE INITIALLY DEFERRED
);

-- Add partial unique index to allow only one active subscription per user
CREATE UNIQUE INDEX idx_user_active_subscription 
ON public.subscriptions (user_id) 
WHERE status = 'active';

-- Create updated_at trigger for subscriptions
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for subscriptions table
-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Only service role can insert/update subscriptions (for webhook handlers)
CREATE POLICY "Service role can manage subscriptions" ON public.subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION public.has_active_subscription(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.subscriptions 
    WHERE user_id = user_uuid 
    AND status = 'active'
    AND (current_period_end IS NULL OR current_period_end > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's current subscription
CREATE OR REPLACE FUNCTION public.get_user_subscription(user_uuid UUID DEFAULT auth.uid())
RETURNS TABLE(
  id UUID,
  status subscription_status,
  billing_interval billing_interval,
  amount_cents INTEGER,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.status,
    s.billing_interval,
    s.amount_cents,
    s.current_period_end,
    s.cancel_at_period_end
  FROM public.subscriptions s
  WHERE s.user_id = user_uuid
  AND s.status IN ('active', 'trialing', 'past_due')
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- Migration 003: Create user progress tracking tables
-- ========================================

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

-- ========================================
-- MIGRATION COMPLETE
-- ========================================
-- All tables, triggers, policies, and functions have been created.
-- Users will now be automatically added to the profiles table when they sign up.