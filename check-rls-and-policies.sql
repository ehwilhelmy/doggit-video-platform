-- 1. Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'subscriptions';

-- 2. Show ALL policies with their exact conditions
SELECT 
  policyname,
  permissive,
  roles,
  qual as policy_condition
FROM pg_policies 
WHERE tablename = 'subscriptions';

-- 3. Test what auth.uid() returns in SQL editor context
SELECT auth.uid() as current_auth_uid;