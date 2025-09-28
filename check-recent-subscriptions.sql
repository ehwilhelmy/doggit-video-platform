-- Check recent subscription activity to see if webhooks are working

-- 1. Check most recent subscriptions (last 24 hours)
SELECT 
  'RECENT SUBSCRIPTIONS (Last 24 hours)' as section,
  s.created_at,
  s.user_id,
  u.email,
  s.status,
  s.stripe_customer_id,
  s.stripe_subscription_id,
  CASE 
    WHEN s.stripe_customer_id IS NOT NULL THEN '✅ Has Stripe Data'
    ELSE '❌ Missing Stripe Data'
  END as webhook_status
FROM public.subscriptions s
LEFT JOIN auth.users u ON u.id = s.user_id
WHERE s.created_at > NOW() - INTERVAL '24 hours'
ORDER BY s.created_at DESC;

-- 2. Check today's new users and their subscription status
SELECT 
  'NEW USERS TODAY' as section,
  u.created_at as user_created,
  u.email,
  u.id as user_id,
  s.id as subscription_id,
  s.status as subscription_status,
  s.stripe_customer_id,
  CASE 
    WHEN s.id IS NOT NULL AND s.stripe_customer_id IS NOT NULL THEN '✅ Complete'
    WHEN s.id IS NOT NULL AND s.stripe_customer_id IS NULL THEN '⚠️ Sub exists, no Stripe'
    ELSE '❌ No subscription'
  END as status
FROM auth.users u
LEFT JOIN public.subscriptions s ON s.user_id = u.id
WHERE u.created_at > CURRENT_DATE
ORDER BY u.created_at DESC;

-- 3. Count of successful vs failed webhook processing (based on stripe_customer_id)
SELECT 
  'WEBHOOK PROCESSING STATS' as section,
  COUNT(*) as total_subscriptions,
  COUNT(CASE WHEN stripe_customer_id IS NOT NULL THEN 1 END) as with_stripe_data,
  COUNT(CASE WHEN stripe_customer_id IS NULL THEN 1 END) as missing_stripe_data,
  ROUND(
    COUNT(CASE WHEN stripe_customer_id IS NOT NULL THEN 1 END)::numeric / 
    COUNT(*)::numeric * 100, 
    2
  ) || '%' as success_rate
FROM public.subscriptions
WHERE created_at > NOW() - INTERVAL '7 days';

-- 4. Most recent webhook processing (check last 5 subscriptions)
SELECT 
  'LAST 5 SUBSCRIPTIONS' as section,
  s.created_at,
  substring(u.email from 1 for 20) || '...' as email_preview,
  s.stripe_customer_id IS NOT NULL as has_stripe,
  s.stripe_subscription_id IS NOT NULL as has_sub_id,
  s.status
FROM public.subscriptions s
LEFT JOIN auth.users u ON u.id = s.user_id
ORDER BY s.created_at DESC
LIMIT 5;