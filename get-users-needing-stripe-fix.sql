-- Get the actual user IDs and emails of users missing Stripe data
-- This will help you look up their Stripe information to fix their records

SELECT 
  'USERS NEEDING STRIPE DATA FIX' as section,
  u.id as user_id,
  u.email,
  u.created_at as user_created,
  s.id as subscription_id,
  s.created_at as subscription_created,
  '-- Copy this ID to look up in Stripe dashboard --' as note
FROM public.subscriptions s
JOIN auth.users u ON u.id = s.user_id
WHERE s.stripe_customer_id IS NULL
  AND u.created_at >= NOW() - INTERVAL '7 days'  -- Recent users only
  AND u.email NOT IN ('erica@doggit.app', 'thor@doggit.app', 'demo@doggit.app', 'investors@doggit.app')
ORDER BY u.created_at DESC;

-- Template for fixing each user (replace with actual values from Stripe):
-- UPDATE public.subscriptions 
-- SET 
--   stripe_customer_id = 'ACTUAL_CUSTOMER_ID_FROM_STRIPE',
--   stripe_subscription_id = 'ACTUAL_SUBSCRIPTION_ID_FROM_STRIPE',
--   stripe_price_id = 'ACTUAL_PRICE_ID_FROM_STRIPE',
--   billing_interval = 'month'
-- WHERE user_id = 'ACTUAL_USER_ID_FROM_ABOVE_QUERY' 
--   AND stripe_customer_id IS NULL;