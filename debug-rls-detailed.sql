-- Debug RLS policy issues

-- 1. Check current authentication context
SELECT 
  'Current auth context' as check_type,
  auth.uid() as current_user_id,
  auth.role() as current_role;

-- 2. Check all policies on subscriptions
SELECT 
  'Policy details' as check_type,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'subscriptions';

-- 3. Check table permissions
SELECT 
  'Table permissions' as check_type,
  grantee,
  privilege_type
FROM information_schema.role_table_grants 
WHERE table_name = 'subscriptions';

-- 4. Test policy with specific user ID
-- (This simulates what happens when a user queries their own subscriptions)
SET role authenticated;
SET request.jwt.claim.sub = '27b86a05-158b-41b3-bb10-af6dd67368e7';

SELECT 
  'Policy test' as check_type,
  id,
  user_id,
  status
FROM public.subscriptions 
WHERE user_id = '27b86a05-158b-41b3-bb10-af6dd67368e7';

-- 5. Reset to default role
RESET role;

-- 6. Check if auth.uid() returns anything in current context
SELECT 
  'Auth functions' as check_type,
  auth.uid() as uid_result,
  auth.role() as role_result;