-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructor VARCHAR(255) NOT NULL,
  duration VARCHAR(20),
  category VARCHAR(100) NOT NULL,
  level VARCHAR(50) NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  video_url TEXT,
  thumbnail_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  sort_order INTEGER DEFAULT 0
);

-- Create video categories table
CREATE TABLE IF NOT EXISTS video_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO video_categories (name, description, sort_order) VALUES
('Puppy Training', 'Essential training for puppies and young dogs', 1),
('Obedience', 'Basic and advanced obedience commands', 2),
('Walking', 'Leash training and walking techniques', 3),
('Behavior', 'Addressing behavioral issues and problems', 4),
('Agility', 'Physical training and agility courses', 5),
('Socialization', 'Social skills and interaction training', 6);

-- Create instructors table
CREATE TABLE IF NOT EXISTS instructors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  expertise TEXT[],
  years_experience INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample instructors
INSERT INTO instructors (name, bio, expertise, years_experience) VALUES
('Jayme Nolan', 'Expert dog trainer specializing in puppy fundamentals and behavior modification.', ARRAY['Puppy Training', 'Behavior'], 15),
('Mike Chen', 'Professional dog trainer with advanced obedience and competition experience.', ARRAY['Obedience', 'Agility'], 12),
('Emily Rodriguez', 'Certified trainer focusing on leash training and walking techniques.', ARRAY['Walking', 'Socialization'], 8);

-- Create video views tracking table
CREATE TABLE IF NOT EXISTS video_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  watch_duration INTEGER, -- in seconds
  completed BOOLEAN DEFAULT FALSE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_level ON videos(level);
CREATE INDEX IF NOT EXISTS idx_videos_featured ON videos(is_featured);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at);
CREATE INDEX IF NOT EXISTS idx_video_views_video_id ON video_views(video_id);
CREATE INDEX IF NOT EXISTS idx_video_views_user_id ON video_views(user_id);

-- Create function to update video view count
CREATE OR REPLACE FUNCTION update_video_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE videos 
  SET view_count = (
    SELECT COUNT(*) 
    FROM video_views 
    WHERE video_id = NEW.video_id
  )
  WHERE id = NEW.video_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating view count
CREATE TRIGGER trigger_update_video_view_count
  AFTER INSERT ON video_views
  FOR EACH ROW
  EXECUTE FUNCTION update_video_view_count();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for videos updated_at
CREATE TRIGGER trigger_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies

-- Enable RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_views ENABLE ROW LEVEL SECURITY;

-- Videos policies
CREATE POLICY "Videos are viewable by everyone" ON videos
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert videos" ON videos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.email = 'admin@doggit.app' OR auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

CREATE POLICY "Only admins can update videos" ON videos
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.email = 'admin@doggit.app' OR auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

CREATE POLICY "Only admins can delete videos" ON videos
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.email = 'admin@doggit.app' OR auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- Video categories policies (read-only for non-admins)
CREATE POLICY "Categories are viewable by everyone" ON video_categories
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify categories" ON video_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.email = 'admin@doggit.app' OR auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- Instructors policies (read-only for non-admins)
CREATE POLICY "Instructors are viewable by everyone" ON instructors
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify instructors" ON instructors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.email = 'admin@doggit.app' OR auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- Video views policies
CREATE POLICY "Users can view their own video views" ON video_views
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own video views" ON video_views
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all video views" ON video_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.email = 'admin@doggit.app' OR auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- Insert sample video data
INSERT INTO videos (title, description, instructor, duration, category, level, thumbnail_url, video_url, is_featured, view_count, sort_order) VALUES
(
  'Puppy Basics', 
  'Master essential puppy training fundamentals with proven techniques from expert trainer Jayme Nolan. Learn the foundation skills every new puppy owner needs to know.',
  'Jayme Nolan',
  '15:30',
  'Puppy Training',
  'Beginner',
  'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&h=600&fit=crop',
  '/videos/1 Puppy Basics (version 3 - Brian VO).mp4',
  true,
  1250,
  1
),
(
  'Advanced Obedience Commands',
  'Take your dog''s training to the next level with advanced obedience commands and techniques for better control and communication.',
  'Mike Chen',
  '18:45',
  'Obedience',
  'Advanced',
  'https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?w=800&h=600&fit=crop',
  null,
  false,
  890,
  2
),
(
  'Leash Training Techniques',
  'Learn effective leash training techniques to make walks enjoyable for both you and your dog. End pulling and create positive walking experiences.',
  'Emily Rodriguez',
  '15:20',
  'Walking',
  'Intermediate',
  'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=800&h=600&fit=crop',
  null,
  false,
  675,
  3
);