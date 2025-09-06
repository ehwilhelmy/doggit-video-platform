-- Fix subscriptions that are missing stripe_customer_id
-- This script will help identify and potentially fix users who paid via Stripe
-- but don't have the Stripe data in their subscription record

-- First, let's see users with subscriptions but no stripe_customer_id
SELECT 
  '=== SUBSCRIPTIONS MISSING STRIPE DATA ===' as section,
  u.email,
  u.created_at as user_created,
  s.status,
  s.created_at as subscription_created,
  s.stripe_customer_id,
  s.stripe_subscription_id,
  CASE 
    WHEN u.created_at >= NOW() - INTERVAL '7 days' THEN '⚠️ RECENT - Likely webhook issue'
    WHEN u.email LIKE '%investors%' OR u.email = 'demo@doggit.app' THEN '✅ EXPECTED - Manual user'
    ELSE '❓ UNKNOWN - Check manually'
  END as likely_cause
FROM public.subscriptions s
JOIN auth.users u ON u.id = s.user_id
WHERE s.stripe_customer_id IS NULL
  AND u.email NOT IN ('erica@doggit.app', 'thor@doggit.app')
ORDER BY s.created_at DESC;

-- Show count of affected users
SELECT 
  'SUMMARY' as section,
  COUNT(*) as total_missing_stripe_data,
  COUNT(CASE WHEN u.created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as recent_missing,
  COUNT(CASE WHEN u.email LIKE '%investors%' OR u.email = 'demo@doggit.app' THEN 1 END) as expected_manual
FROM public.subscriptions s
JOIN auth.users u ON u.id = s.user_id
WHERE s.stripe_customer_id IS NULL
  AND u.email NOT IN ('erica@doggit.app', 'thor@doggit.app');

-- To fix this issue going forward, we need to:
-- 1. Let webhook process properly (fixed in webhook code)
-- 2. Stop cron job from interfering with recent users (fixed in cron job)
-- 3. Manually investigate users who should have Stripe data but don't

-- Example manual fix for a specific user (REPLACE WITH ACTUAL VALUES):
-- UPDATE public.subscriptions 
-- SET 
--   stripe_customer_id = 'cus_XXXXXXXXXX',
--   stripe_subscription_id = 'sub_XXXXXXXXXX',
--   stripe_price_id = 'price_XXXXXXXXXX',
--   billing_interval = 'month'
-- WHERE user_id = 'USER_ID_HERE' 
--   AND stripe_customer_id IS NULL;