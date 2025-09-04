-- ========================================
-- SIMPLE FIX FOR SUBSCRIPTIONS
-- ========================================

-- 1. First check what columns exist in subscriptions table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'subscriptions';

-- 2. Check if subscriptions table is empty
SELECT COUNT(*) as total_records FROM public.subscriptions;

-- 3. See current subscriptions (if any)
SELECT * FROM public.subscriptions LIMIT 10;

-- 4. Simple insert without type casting
-- This should work regardless of the exact column types
INSERT INTO public.subscriptions (
  user_id,
  status
)
SELECT 
  u.id as user_id,
  'active' as status
FROM auth.users u
WHERE 
  u.email IN (
    'herohomesolutionswa@gmail.com',
    'carleyjsimpson@gmail.com',
    'josimpson55@gmail.com',
    'collinbutkus95@gmail.com',
    'cameron@doggit.app',
    'cameron.simpson99@gmail.com'
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.subscriptions s 
    WHERE s.user_id = u.id
  );

-- 5. Verify the insertions worked
SELECT 
  s.*,
  u.email
FROM public.subscriptions s
JOIN auth.users u ON s.user_id = u.id
ORDER BY s.created_at DESC;

-- 6. Count how many users now have subscriptions
SELECT 
  COUNT(DISTINCT u.id) as users_with_access
FROM auth.users u
LEFT JOIN public.subscriptions s ON u.id = s.user_id
WHERE 
  u.email IN ('erica@doggit.app', 'thor@doggit.app', 'demo@doggit.app')
  OR s.status = 'active';