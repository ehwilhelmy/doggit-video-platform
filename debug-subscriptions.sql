-- ========================================
-- DEBUG SUBSCRIPTIONS TABLE
-- ========================================

-- 1. Check all subscriptions and their exact status values
SELECT 
  s.id,
  s.user_id,
  s.status,
  LENGTH(s.status) as status_length,
  ASCII(SUBSTRING(s.status FROM 1 FOR 1)) as first_char_ascii,
  u.email,
  s.created_at
FROM public.subscriptions s
JOIN auth.users u ON s.user_id = u.id
ORDER BY s.created_at DESC;

-- 2. Check for any non-standard status values
SELECT DISTINCT 
  status,
  LENGTH(status) as length,
  COUNT(*) as count
FROM public.subscriptions
GROUP BY status, LENGTH(status);

-- 3. Specifically check Cameron's subscription
SELECT 
  s.*,
  u.email
FROM public.subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE u.email = 'cameron.simpson99@gmail.com';

-- 4. Test the exact query from the auth context
SELECT 
  s.status,
  u.email,
  u.id as user_id
FROM public.subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE u.email IN (
  'cameron.simpson99@gmail.com',
  'carleyjsimpson@gmail.com',
  'herohomesolutionswa@gmail.com'
)
AND s.status = 'active';

-- 5. Same query but without the status filter to see what we get
SELECT 
  s.status,
  u.email,
  u.id as user_id,
  s.created_at
FROM public.subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE u.email IN (
  'cameron.simpson99@gmail.com',
  'carleyjsimpson@gmail.com',
  'herohomesolutionswa@gmail.com'
);