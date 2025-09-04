-- ========================================
-- AUDIT AND FIX ALL USERS
-- Run this in Supabase SQL Editor
-- ========================================

-- STEP 1: AUDIT - See the current state of all users
-- This shows you who has access and who doesn't

SELECT 
  u.id,
  u.email,
  u.created_at as user_created,
  u.last_sign_in_at,
  p.first_name,
  p.last_name,
  p.pup_name,
  s.id as subscription_id,
  s.status as subscription_status,
  s.current_period_end,
  s.stripe_subscription_id,
  CASE 
    WHEN u.email IN ('erica@doggit.app', 'thor@doggit.app', 'demo@doggit.app') THEN 'Admin/Demo'
    WHEN s.status = 'active' THEN 'Active Subscriber'
    WHEN s.status = 'trialing' THEN 'Trial User'
    WHEN s.status IN ('canceled', 'past_due') THEN 'Expired/Past Due'
    WHEN s.id IS NULL THEN 'No Subscription'
    ELSE 'Other'
  END as access_status,
  CASE
    WHEN u.email IN ('erica@doggit.app', 'thor@doggit.app', 'demo@doggit.app') THEN true
    WHEN s.status = 'active' THEN true
    ELSE false
  END as has_dashboard_access
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.subscriptions s ON u.id = s.user_id
ORDER BY 
  has_dashboard_access DESC,
  u.created_at DESC;

-- ========================================
-- STEP 2: FIX ISSUES
-- ========================================

-- Fix 1: Create missing profile records for all users
INSERT INTO public.profiles (id, created_at, updated_at)
SELECT 
  u.id,
  u.created_at,
  NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Fix 2: Remove duplicate subscriptions (keep only the most recent active one)
WITH ranked_subs AS (
  SELECT 
    id,
    user_id,
    status,
    ROW_NUMBER() OVER (
      PARTITION BY user_id 
      ORDER BY 
        CASE WHEN status = 'active' THEN 0 ELSE 1 END,
        created_at DESC
    ) as rn
  FROM public.subscriptions
)
DELETE FROM public.subscriptions
WHERE id IN (
  SELECT id FROM ranked_subs WHERE rn > 1
);

-- Fix 3: Update expired subscriptions that should be canceled
UPDATE public.subscriptions
SET 
  status = 'canceled',
  updated_at = NOW()
WHERE 
  status = 'active' 
  AND current_period_end < NOW()
  AND stripe_subscription_id IS NULL; -- Only for manually granted ones

-- ========================================
-- STEP 3: GRANT ACCESS TO SPECIFIC USERS
-- ========================================

-- Option A: Grant PERMANENT access to early adopters (no expiration)
-- Uncomment and modify the list of emails below:

/*
INSERT INTO public.subscriptions (
  user_id,
  status,
  billing_interval,
  amount_cents,
  currency,
  current_period_start,
  current_period_end,
  metadata
)
SELECT 
  u.id as user_id,
  'active'::subscription_status,
  'month'::billing_interval,
  0, -- Free
  'usd',
  NOW(),
  '2099-12-31'::timestamptz, -- Far future date
  jsonb_build_object(
    'source', 'manual_grant',
    'reason', 'early_adopter_lifetime',
    'granted_by', 'admin',
    'granted_at', NOW()
  )
FROM auth.users u
LEFT JOIN public.subscriptions s ON u.id = s.user_id
WHERE 
  u.email IN (
    'carleyjsimpson@gmail.com'
    -- Add more early adopter emails here
  )
  AND (s.id IS NULL OR s.status != 'active')
ON CONFLICT (user_id) 
DO UPDATE SET 
  status = 'active',
  current_period_end = '2099-12-31'::timestamptz,
  updated_at = NOW();
*/

-- Option B: Grant 30-day trial to new users without subscriptions
/*
INSERT INTO public.subscriptions (
  user_id,
  status,
  billing_interval,
  amount_cents,
  currency,
  trial_start,
  trial_end,
  current_period_start,
  current_period_end,
  metadata
)
SELECT 
  u.id as user_id,
  'trialing'::subscription_status,
  'month'::billing_interval,
  1000, -- $10 after trial
  'usd',
  NOW(),
  NOW() + INTERVAL '30 days',
  NOW(),
  NOW() + INTERVAL '30 days',
  jsonb_build_object(
    'source', 'manual_grant',
    'reason', '30_day_trial',
    'granted_by', 'admin',
    'granted_at', NOW()
  )
FROM auth.users u
LEFT JOIN public.subscriptions s ON u.id = s.user_id
WHERE 
  s.id IS NULL
  AND u.email NOT IN ('erica@doggit.app', 'thor@doggit.app', 'demo@doggit.app');
*/

-- ========================================
-- STEP 4: FINAL VERIFICATION
-- Run this after fixes to confirm everyone is in good state
-- ========================================

SELECT 
  'Total Users' as metric,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Users with Profiles' as metric,
  COUNT(*) as count
FROM public.profiles
UNION ALL
SELECT 
  'Active Subscriptions' as metric,
  COUNT(*) as count
FROM public.subscriptions
WHERE status = 'active'
UNION ALL
SELECT 
  'Users with Dashboard Access' as metric,
  COUNT(*) as count
FROM auth.users u
LEFT JOIN public.subscriptions s ON u.id = s.user_id
WHERE 
  u.email IN ('erica@doggit.app', 'thor@doggit.app', 'demo@doggit.app')
  OR s.status = 'active'
UNION ALL
SELECT 
  'Users WITHOUT Access' as metric,
  COUNT(*) as count
FROM auth.users u
LEFT JOIN public.subscriptions s ON u.id = s.user_id
WHERE 
  u.email NOT IN ('erica@doggit.app', 'thor@doggit.app', 'demo@doggit.app')
  AND (s.id IS NULL OR s.status != 'active');

-- List users who still don't have access
SELECT 
  'Users without access:' as note,
  u.email,
  u.created_at
FROM auth.users u
LEFT JOIN public.subscriptions s ON u.id = s.user_id
WHERE 
  u.email NOT IN ('erica@doggit.app', 'thor@doggit.app', 'demo@doggit.app')
  AND (s.id IS NULL OR s.status != 'active')
ORDER BY u.created_at DESC;