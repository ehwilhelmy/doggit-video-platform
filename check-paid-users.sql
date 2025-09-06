-- Check which users are "paid users" (have stripe_customer_id)
-- This identifies users who actually paid through Stripe vs manual/demo users

SELECT 
  u.email,
  p.first_name,
  p.last_name,
  s.status as subscription_status,
  s.stripe_customer_id,
  s.created_at as subscription_created,
  CASE 
    WHEN u.email IN ('erica@doggit.app', 'thor@doggit.app') THEN '🔴 Admin User'
    WHEN u.email = 'demo@doggit.app' THEN '🟡 Demo User'
    WHEN s.stripe_customer_id IS NOT NULL THEN '🟢 Paid User (Stripe)'
    WHEN s.stripe_customer_id IS NULL AND s.status = 'active' THEN '🔵 Manual/Free User'
    ELSE '❌ No Active Subscription'
  END as user_type,
  CASE 
    WHEN s.stripe_customer_id IS NOT NULL 
         AND u.email NOT IN ('erica@doggit.app', 'thor@doggit.app') 
    THEN 'YES - Can manage subscription'
    ELSE 'NO - Subscription management hidden'
  END as shows_manage_subscription
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.subscriptions s ON s.user_id = u.id
ORDER BY 
  CASE 
    WHEN s.stripe_customer_id IS NOT NULL THEN 1  -- Paid users first
    WHEN u.email IN ('erica@doggit.app', 'thor@doggit.app') THEN 2  -- Admin users
    WHEN u.email = 'demo@doggit.app' THEN 3  -- Demo user
    WHEN s.status = 'active' THEN 4  -- Manual users
    ELSE 5  -- Inactive users
  END,
  u.email;

-- Summary counts
SELECT 
  'SUMMARY' as section,
  COUNT(CASE WHEN s.stripe_customer_id IS NOT NULL AND u.email NOT IN ('erica@doggit.app', 'thor@doggit.app') THEN 1 END) as paid_users,
  COUNT(CASE WHEN s.stripe_customer_id IS NULL AND s.status = 'active' AND u.email NOT IN ('erica@doggit.app', 'thor@doggit.app', 'demo@doggit.app') THEN 1 END) as manual_users,
  COUNT(CASE WHEN u.email IN ('erica@doggit.app', 'thor@doggit.app') THEN 1 END) as admin_users,
  COUNT(CASE WHEN u.email = 'demo@doggit.app' THEN 1 END) as demo_users,
  COUNT(CASE WHEN s.id IS NULL OR s.status != 'active' THEN 1 END) as inactive_users,
  COUNT(*) as total_users
FROM auth.users u
LEFT JOIN public.subscriptions s ON s.user_id = u.id;

-- Show only paid users (those who can manage subscriptions)
SELECT 
  '--- PAID USERS ONLY ---' as section,
  u.email,
  p.first_name,
  p.last_name,
  s.stripe_customer_id,
  s.status,
  s.created_at as subscription_date
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
INNER JOIN public.subscriptions s ON s.user_id = u.id
WHERE s.stripe_customer_id IS NOT NULL
  AND u.email NOT IN ('erica@doggit.app', 'thor@doggit.app')
ORDER BY s.created_at DESC;