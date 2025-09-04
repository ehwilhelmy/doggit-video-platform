-- ========================================
-- CHECK CAMERON USER STATUS
-- ========================================

-- 1. Check if cameron.simpson99@gmail.com exists in auth.users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at
FROM auth.users 
WHERE email = 'cameron.simpson99@gmail.com';

-- 2. Check if they have a subscription record
SELECT 
  s.*,
  u.email
FROM public.subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE u.email = 'cameron.simpson99@gmail.com';

-- 3. Check their profile record
SELECT 
  p.*,
  u.email
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'cameron.simpson99@gmail.com';

-- 4. If they don't have a subscription, add one
INSERT INTO public.subscriptions (
  user_id,
  status
)
SELECT 
  u.id as user_id,
  'active' as status
FROM auth.users u
WHERE 
  u.email = 'cameron.simpson99@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.subscriptions s 
    WHERE s.user_id = u.id
  );

-- 5. Verify they now have access
SELECT 
  'User exists in auth.users:' as check_type,
  CASE WHEN COUNT(*) > 0 THEN 'YES' ELSE 'NO' END as result
FROM auth.users 
WHERE email = 'cameron.simpson99@gmail.com'

UNION ALL

SELECT 
  'User has subscription:' as check_type,
  CASE WHEN COUNT(*) > 0 THEN 'YES' ELSE 'NO' END as result
FROM public.subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE u.email = 'cameron.simpson99@gmail.com';