-- Check all RLS settings for subscriptions table
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'subscriptions';

-- Check all policies on subscriptions
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'subscriptions';

-- Test the exact query the auth context is running
SELECT status 
FROM public.subscriptions 
WHERE user_id = '27b86a05-158b-41b3-bb10-af6dd67368e7' 
  AND status = 'active';