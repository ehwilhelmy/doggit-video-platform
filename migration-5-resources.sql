-- Create resources table for managing blog articles/resources
CREATE TABLE IF NOT EXISTS resources (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  image_url text,
  url text NOT NULL,
  published_date date DEFAULT CURRENT_DATE,
  tags text[] DEFAULT '{}',
  is_published boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read published resources
CREATE POLICY "Users can view published resources"
  ON resources FOR SELECT
  TO authenticated
  USING (is_published = true);

-- Allow admins to do everything
CREATE POLICY "Admins can insert resources"
  ON resources FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update resources"
  ON resources FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete resources"
  ON resources FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert existing resources as initial data
INSERT INTO resources (title, description, image_url, url, published_date, tags, is_published) VALUES
(
  'Mythbusters! True Or False?',
  'Expert insights and tips from our training professionals',
  'https://resources.doggit.app/wp-content/uploads/2024/03/PuppiesInYard.jpg',
  'https://resources.doggit.app/mythbusters-true-or-false/',
  '2024-03-21',
  ARRAY['Dog''s Health', 'Puppy Guide', 'Tips & Tricks'],
  true
),
(
  'Health Clearances – What To Know And What To Look Out For',
  'Expert insights and tips from our training professionals',
  'https://resources.doggit.app/wp-content/uploads/2024/03/female-veterinarian-examining-parson-russell-terrier-dog-solated-on-white-SBI-305113415.jpg',
  'https://resources.doggit.app/health-clearances-what-to-know-and-what-to-look-out-for/',
  '2024-03-21',
  ARRAY['Dog''s Health'],
  true
),
(
  'Collar Types',
  'Expert insights and tips from our training professionals',
  'https://resources.doggit.app/wp-content/uploads/2024/03/collar_types.jpg',
  'https://resources.doggit.app/collar-types/',
  '2024-03-21',
  ARRAY['Puppy Guide'],
  true
);
