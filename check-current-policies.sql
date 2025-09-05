-- 1. Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'subscriptions';

-- 2. Show ALL policies with their exact conditions
SELECT 
  policyname,
  cmd as operation,
  permissive,
  roles,
  qual as policy_condition
FROM pg_policies 
WHERE tablename = 'subscriptions';

-- 3. Test what auth.uid() returns in different contexts
SELECT 
  'Direct auth.uid() test' as test,
  auth.uid() as current_uid,
  current_user as db_user;

-- 4. Check if there's a mismatch between auth.uid() and user_id format
SELECT DISTINCT
  user_id,
  LENGTH(user_id) as id_length,
  COUNT(*) as record_count
FROM public.subscriptions
WHERE user_id IS NOT NULL
GROUP BY user_id, LENGTH(user_id)
LIMIT 5;