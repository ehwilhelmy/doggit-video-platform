-- Debug recent Stripe/Supabase integration issues
-- Check what's happening with new users in the last 7 days

-- 1. Check recent users and their subscription status
SELECT 
  '=== RECENT USERS (Last 7 Days) ===' as section,
  u.email,
  u.created_at as user_created,
  p.first_name,
  p.last_name,
  s.id as subscription_id,
  s.status as sub_status,
  s.stripe_customer_id,
  s.stripe_subscription_id,
  s.created_at as subscription_created,
  CASE 
    WHEN s.id IS NULL THEN '❌ NO SUBSCRIPTION RECORD'
    WHEN s.stripe_customer_id IS NULL THEN '⚠️ SUBSCRIPTION WITHOUT STRIPE_CUSTOMER_ID'
    WHEN s.stripe_customer_id IS NOT NULL THEN '✅ COMPLETE STRIPE SUBSCRIPTION'
    ELSE '❓ UNKNOWN STATUS'
  END as issue_type
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.subscriptions s ON s.user_id = u.id
WHERE u.created_at >= NOW() - INTERVAL '7 days'
  AND u.email NOT IN ('erica@doggit.app', 'thor@doggit.app', 'demo@doggit.app')
ORDER BY u.created_at DESC;

-- 2. Check for subscription records without stripe_customer_id (webhook failures)
SELECT 
  '=== SUBSCRIPTIONS MISSING STRIPE DATA ===' as section,
  u.email,
  s.status,
  s.stripe_customer_id,
  s.stripe_subscription_id,
  s.created_at,
  'Likely webhook failure or manual creation' as probable_cause
FROM public.subscriptions s
JOIN auth.users u ON u.id = s.user_id
WHERE s.stripe_customer_id IS NULL
  AND s.created_at >= NOW() - INTERVAL '7 days'
  AND u.email NOT IN ('erica@doggit.app', 'thor@doggit.app', 'demo@doggit.app', 'investors@doggit.app')
ORDER BY s.created_at DESC;

-- 3. Check for users with profiles but no subscriptions (missed by cron job)
SELECT 
  '=== USERS WITHOUT SUBSCRIPTIONS ===' as section,
  u.email,
  u.created_at as user_created,
  p.first_name,
  p.last_name,
  'Missing subscription record entirely' as issue
FROM auth.users u
JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.subscriptions s ON s.user_id = u.id
WHERE s.id IS NULL
  AND u.created_at >= NOW() - INTERVAL '7 days'
  AND u.email NOT IN ('erica@doggit.app', 'thor@doggit.app', 'demo@doggit.app')
ORDER BY u.created_at DESC;

-- 4. Summary of issues
SELECT 
  'ISSUE SUMMARY' as section,
  COUNT(CASE WHEN s.id IS NULL THEN 1 END) as users_no_subscription,
  COUNT(CASE WHEN s.stripe_customer_id IS NULL AND s.id IS NOT NULL THEN 1 END) as subscriptions_no_stripe_data,
  COUNT(CASE WHEN s.stripe_customer_id IS NOT NULL THEN 1 END) as complete_stripe_subscriptions,
  COUNT(*) as total_recent_users
FROM auth.users u
LEFT JOIN public.subscriptions s ON s.user_id = u.id
WHERE u.created_at >= NOW() - INTERVAL '7 days'
  AND u.email NOT IN ('erica@doggit.app', 'thor@doggit.app', 'demo@doggit.app');