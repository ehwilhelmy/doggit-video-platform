-- ========================================
-- GRANT ACCESS TO ALL YOUR USERS
-- Run this in Supabase SQL Editor
-- ========================================

-- STEP 1: Check current status of all users
SELECT 
  u.id,
  u.email,
  u.created_at as user_created,
  s.status as subscription_status,
  CASE 
    WHEN u.email IN ('erica@doggit.app', 'thor@doggit.app', 'demo@doggit.app') THEN 'Admin/Demo'
    WHEN s.status = 'active' THEN 'Active Subscriber'
    WHEN s.id IS NULL THEN 'No Subscription'
    ELSE s.status::text
  END as access_status
FROM auth.users u
LEFT JOIN public.subscriptions s ON u.id = s.user_id
WHERE u.email IN (
  'thor@doggit.app',
  'erica@doggit.app',
  'herohomesolutionswa@gmail.com',
  'carleyjsimpson@gmail.com',
  'josimpson55@gmail.com',
  'cameron@doggit.app',
  'cameron.simpson99@gmail.com'
)
ORDER BY 
  CASE 
    WHEN u.email IN ('erica@doggit.app', 'thor@doggit.app', 'demo@doggit.app') THEN 0
    ELSE 1
  END,
  u.email;

-- ========================================
-- STEP 2: GRANT ACCESS TO ALL NON-ADMIN USERS
-- This will give all regular users access to the platform
-- ========================================

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
    'granted_at', NOW(),
    'note', 'Initial user batch - friends and family'
  )
FROM auth.users u
WHERE 
  u.email IN (
    -- Regular users who need access
    'herohomesolutionswa@gmail.com',
    'carleyjsimpson@gmail.com',
    'josimpson55@gmail.com',
    'collinbutkus95@gmail.com',
    'cameron@doggit.app',
    'cameron.simpson99@gmail.com'
  )
  -- Only create subscription if they don't already have an active one
  AND NOT EXISTS (
    SELECT 1 FROM public.subscriptions s 
    WHERE s.user_id = u.id AND s.status = 'active'
  );

-- ========================================
-- STEP 3: VERIFY EVERYONE HAS ACCESS
-- This should show all users with their access status
-- ========================================

SELECT 
  u.email,
  CASE 
    WHEN u.email IN ('erica@doggit.app', 'thor@doggit.app', 'demo@doggit.app') THEN 'Admin (Built-in Access)'
    WHEN s.status = 'active' THEN 'Active Subscription ✅'
    WHEN s.id IS NULL THEN '❌ NO ACCESS - Need to fix!'
    ELSE '❌ Inactive - ' || s.status::text
  END as access_status,
  s.created_at as subscription_granted,
  s.metadata->>'note' as note
FROM auth.users u
LEFT JOIN public.subscriptions s ON u.id = s.user_id
WHERE u.email IN (
  -- All your users
  'thor@doggit.app',
  'demo@doggit.app',
  'erica@doggit.app',
  'herohomesolutionswa@gmail.com',
  'carleyjsimpson@gmail.com',
  'josimpson55@gmail.com',
  'collinbutkus95@gmail.com',
  'cameron@doggit.app',
  'cameron.simpson99@gmail.com'
)
ORDER BY 
  CASE 
    WHEN u.email IN ('erica@doggit.app', 'thor@doggit.app', 'demo@doggit.app') THEN 0
    WHEN s.status = 'active' THEN 1
    ELSE 2
  END,
  u.email;

-- ========================================
-- SUMMARY COUNT
-- ========================================

SELECT 
  COUNT(*) as total_users,
  SUM(CASE WHEN u.email IN ('erica@doggit.app', 'thor@doggit.app', 'demo@doggit.app') THEN 1 ELSE 0 END) as admin_users,
  SUM(CASE WHEN s.status = 'active' AND u.email NOT IN ('erica@doggit.app', 'thor@doggit.app', 'demo@doggit.app') THEN 1 ELSE 0 END) as active_subscribers,
  SUM(CASE 
    WHEN u.email IN ('erica@doggit.app', 'thor@doggit.app', 'demo@doggit.app') THEN 1
    WHEN s.status = 'active' THEN 1
    ELSE 0
  END) as total_with_access
FROM auth.users u
LEFT JOIN public.subscriptions s ON u.id = s.user_id
WHERE u.email IN (
  'thor@doggit.app',
  'demo@doggit.app',
  'erica@doggit.app',
  'herohomesolutionswa@gmail.com',
  'carleyjsimpson@gmail.com',
  'josimpson55@gmail.com',
  'collinbutkus95@gmail.com',
  'cameron@doggit.app',
  'cameron.simpson99@gmail.com'
);