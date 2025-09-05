-- Check profiles table RLS and policies
SELECT 
  'Profiles RLS Status' as check,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'profiles';

-- Show all policies on profiles table
SELECT 
  'Profiles Policies' as check,
  policyname,
  cmd as operation,
  qual as condition
FROM pg_policies 
WHERE tablename = 'profiles';

-- Check if users have roles in profiles
SELECT 
  'User Roles' as check,
  p.id as user_id,
  u.email,
  p.role,
  p.first_name
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email IN (
  'herohomesolutionswa@gmail.com',
  'cameron.simpson99@gmail.com',
  'erica@doggit.app',
  'thor@doggit.app'
)
ORDER BY u.email;

-- Set roles for users who need them (optional - only run if needed)
-- UPDATE public.profiles 
-- SET role = 'user'
-- WHERE role IS NULL 
-- AND id IN (
--   SELECT id FROM auth.users 
--   WHERE email IN (
--     'herohomesolutionswa@gmail.com',
--     'carleyjsimpson@gmail.com',
--     'josimpson55@gmail.com',
--     'collinbutkus95@gmail.com',
--     'cameron@doggit.app',
--     'cameron.simpson99@gmail.com'
--   )
-- );