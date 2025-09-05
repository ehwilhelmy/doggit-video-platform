-- Check duplicate subscriptions
SELECT 
  user_id,
  COUNT(*) as subscription_count,
  array_agg(id) as subscription_ids,
  array_agg(status) as statuses,
  array_agg(created_at ORDER BY created_at) as created_dates
FROM public.subscriptions
GROUP BY user_id
HAVING COUNT(*) > 1
ORDER BY COUNT(*) DESC;

-- See details for a specific user with duplicates
SELECT 
  id,
  user_id,
  status,
  stripe_customer_id,
  stripe_subscription_id,
  created_at
FROM public.subscriptions
WHERE user_id = '27b86a05-158b-41b3-bb10-af6dd67368e7'
ORDER BY created_at;

-- Clean up duplicates - keep only the most recent subscription per user
-- CAREFUL: Only run this after reviewing the data above!
-- WITH duplicates AS (
--   SELECT 
--     id,
--     user_id,
--     ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
--   FROM public.subscriptions
-- )
-- DELETE FROM public.subscriptions
-- WHERE id IN (
--   SELECT id FROM duplicates WHERE rn > 1
-- );

-- Verify cleanup
-- SELECT 
--   user_id,
--   COUNT(*) as count
-- FROM public.subscriptions
-- GROUP BY user_id
-- HAVING COUNT(*) > 1;