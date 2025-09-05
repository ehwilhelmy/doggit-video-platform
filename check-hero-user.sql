-- Check herohomesolutionswa@gmail.com user specifically
SELECT 
  s.*,
  u.email,
  u.id as user_id
FROM public.subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE u.id = '27b86a05-158b-41b3-bb10-af6dd67368e7'
   OR u.email = 'herohomesolutionswa@gmail.com';

-- Also check if this user exists in auth.users
SELECT 
  id,
  email,
  created_at
FROM auth.users 
WHERE id = '27b86a05-158b-41b3-bb10-af6dd67368e7';