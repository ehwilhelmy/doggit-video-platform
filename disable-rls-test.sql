-- First check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'subscriptions';

-- Show all current policies
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'subscriptions';

-- Temporarily disable RLS to test (can be re-enabled later)
ALTER TABLE public.subscriptions DISABLE ROW LEVEL SECURITY;

-- Confirm RLS is now disabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'subscriptions';