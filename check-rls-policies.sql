-- Check RLS policies on subscriptions table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'subscriptions';

-- Check if RLS is enabled on subscriptions table
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'subscriptions';

-- Test direct query as current user
SELECT 
  id,
  user_id,
  status
FROM public.subscriptions 
WHERE user_id = '27b86a05-158b-41b3-bb10-af6dd67368e7'
LIMIT 5;