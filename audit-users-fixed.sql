-- ========================================
-- AUDIT AND FIX ALL USERS (FIXED VERSION)
-- Run this in Supabase SQL Editor
-- ========================================

-- STEP 1: AUDIT - See the current state of all users
-- Fixed to match your actual database schema

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
-- STEP 2: FIX MISSING PROFILES
-- ========================================

-- Create missing profile records for all users
INSERT INTO public.profiles (id, created_at, updated_at)
SELECT 
  u.id,
  u.created_at,
  NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- STEP 3: GRANT ACCESS TO USERS
-- ========================================

-- Option A: Grant access to specific users (like carleyjsimpson@gmail.com)
-- UNCOMMENT THE LINES BELOW AND ADD THE EMAIL ADDRESSES YOU WANT TO GRANT ACCESS TO:

/*
INSERT INTO public.subscriptions (
  user_id,
  status,
  metadata
)
SELECT 
  u.id as user_id,
  'active'::subscription_status,
  jsonb_build_object(
    'source', 'manual_grant',
    'reason', 'early_adopter',
    'granted_by', 'admin',
    'granted_at', NOW()
  )
FROM auth.users u
WHERE 
  u.email IN (
    'carleyjsimpson@gmail.com'
    -- Add more emails here, separated by commas
    -- 'user2@example.com',
    -- 'user3@example.com'
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.subscriptions s 
    WHERE s.user_id = u.id AND s.status = 'active'
  );
*/

-- Option B: Grant access to ALL users who don't have subscriptions
-- BE CAREFUL WITH THIS - it gives everyone free access!

/*
INSERT INTO public.subscriptions (
  user_id,
  status,
  metadata
)
SELECT 
  u.id as user_id,
  'active'::subscription_status,
  jsonb_build_object(
    'source', 'manual_grant',
    'reason', 'early_adopter_batch',
    'granted_by', 'admin',
    'granted_at', NOW()
  )
FROM auth.users u
WHERE 
  u.email NOT IN ('erica@doggit.app', 'thor@doggit.app', 'demo@doggit.app')
  AND NOT EXISTS (
    SELECT 1 FROM public.subscriptions s 
    WHERE s.user_id = u.id
  );
*/

-- ========================================
-- STEP 4: VERIFY THE RESULTS
-- ========================================

-- Summary statistics
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
  COUNT(DISTINCT u.id) as count
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

-- List users who don't have access (so you can decide who to grant access to)
SELECT 
  u.email,
  u.created_at,
  'No Access' as status
FROM auth.users u
LEFT JOIN public.subscriptions s ON u.id = s.user_id
WHERE 
  u.email NOT IN ('erica@doggit.app', 'thor@doggit.app', 'demo@doggit.app')
  AND (s.id IS NULL OR s.status != 'active')
ORDER BY u.created_at DESC;