-- First, see what we're about to delete
SELECT 
  'Before cleanup - Users with duplicates' as status,
  user_id,
  COUNT(*) as subscription_count
FROM public.subscriptions
GROUP BY user_id
HAVING COUNT(*) > 1;

-- Delete duplicates, keeping only the most recent subscription per user
WITH duplicates AS (
  SELECT 
    id,
    user_id,
    created_at,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
  FROM public.subscriptions
)
DELETE FROM public.subscriptions
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- Verify cleanup worked
SELECT 
  'After cleanup - Users with duplicates' as status,
  user_id,
  COUNT(*) as subscription_count
FROM public.subscriptions
GROUP BY user_id
HAVING COUNT(*) > 1;

-- Show final subscription count per user
SELECT 
  'Final check' as status,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) as total_subscriptions,
  MAX(count) as max_subscriptions_per_user
FROM (
  SELECT user_id, COUNT(*) as count
  FROM public.subscriptions
  GROUP BY user_id
) counts;

-- Add a unique constraint to prevent future duplicates
-- This will ensure only one subscription per user
ALTER TABLE public.subscriptions 
ADD CONSTRAINT unique_user_subscription UNIQUE (user_id);

-- Confirm constraint was added
SELECT 
  'Constraint added' as status,
  conname as constraint_name
FROM pg_constraint 
WHERE conrelid = 'public.subscriptions'::regclass 
AND contype = 'u';