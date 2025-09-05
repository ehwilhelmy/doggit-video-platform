-- Drop the existing policy that isn't working
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;

-- Create a policy that works with the current auth setup
-- This allows any authenticated user to see subscriptions where user_id matches auth.uid()
CREATE POLICY "Enable read access for authenticated users" 
ON public.subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Also grant usage on the auth schema to make sure auth.uid() works
GRANT USAGE ON SCHEMA auth TO anon, authenticated;

-- Grant execute permission on auth functions
GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.role() TO anon, authenticated;

-- Test the new policy
SELECT 
  'Policy test' as test_type,
  COUNT(*) as subscription_count
FROM public.subscriptions 
WHERE user_id = '27b86a05-158b-41b3-bb10-af6dd67368e7';

-- Check the new policy was created
SELECT 
  'New policy' as check_type,
  policyname,
  qual
FROM pg_policies 
WHERE tablename = 'subscriptions';