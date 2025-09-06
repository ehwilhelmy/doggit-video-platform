-- SQL script to automatically create subscription records for new users
-- This should be run every 5 minutes via cron job or scheduled function
-- It finds users who have profiles but no subscription records and creates them

-- Create subscriptions for users who have profiles but no subscription records
WITH users_without_subscriptions AS (
  SELECT DISTINCT p.id as user_id, u.email
  FROM public.profiles p
  JOIN auth.users u ON p.id = u.id
  LEFT JOIN public.subscriptions s ON p.id = s.user_id
  WHERE s.user_id IS NULL
    AND p.id IS NOT NULL
    AND u.email IS NOT NULL
    AND p.created_at > NOW() - INTERVAL '1 day' -- Only process recent users to avoid mass updates
)
INSERT INTO public.subscriptions (
  user_id,
  status
)
SELECT 
  u.user_id,
  'active' -- Give users active status so they can access dashboard
FROM users_without_subscriptions u
ON CONFLICT (user_id) DO NOTHING; -- Don't overwrite existing subscriptions

-- Note: Profiles table doesn't have a role column
-- Roles are managed through subscription status instead

-- Optional: Log the changes made
SELECT 
  'Subscriptions created: ' || COUNT(*) as summary
FROM public.subscriptions s
JOIN public.profiles p ON s.user_id = p.id
WHERE s.created_at > NOW() - INTERVAL '10 minutes'
  AND p.created_at > NOW() - INTERVAL '1 day';