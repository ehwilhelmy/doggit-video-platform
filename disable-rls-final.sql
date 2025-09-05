-- Disable RLS completely to fix authentication issues
ALTER TABLE public.subscriptions DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'subscriptions';

-- Test that queries now work
SELECT COUNT(*) as subscription_count
FROM public.subscriptions
WHERE user_id = '27b86a05-158b-41b3-bb10-af6dd67368e7';