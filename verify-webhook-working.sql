-- Check if webhooks are working by looking at recent subscriptions

-- 1. Check subscriptions created in last hour
SELECT 
  'LAST HOUR' as timeframe,
  COUNT(*) as total_subscriptions,
  COUNT(stripe_customer_id) as with_stripe_id,
  COUNT(stripe_subscription_id) as with_subscription_id
FROM public.subscriptions
WHERE created_at > NOW() - INTERVAL '1 hour';

-- 2. Most recent subscription with all details
SELECT 
  'MOST RECENT' as section,
  created_at,
  user_id,
  stripe_customer_id,
  stripe_subscription_id,
  status,
  CASE 
    WHEN stripe_customer_id IS NOT NULL 
     AND stripe_subscription_id IS NOT NULL 
    THEN '✅ Webhook worked!'
    ELSE '❌ Webhook failed'
  END as webhook_status
FROM public.subscriptions
ORDER BY created_at DESC
LIMIT 1;

-- 3. Check if any subscriptions have Stripe data at all
SELECT 
  'ALL TIME STATS' as section,
  COUNT(*) as total_subscriptions,
  COUNT(stripe_customer_id) as have_stripe_customer,
  COUNT(stripe_subscription_id) as have_stripe_subscription,
  ROUND(
    COUNT(stripe_customer_id)::numeric / 
    NULLIF(COUNT(*)::numeric, 0) * 100, 
    2
  ) || '%' as success_rate
FROM public.subscriptions;