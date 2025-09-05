-- Add RLS policy to allow users to read their own subscription records
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Check if the policy was created
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'subscriptions' AND policyname = 'Users can view their own subscriptions';

-- Test that the policy works by simulating the client query
-- (This should now return results when run as the authenticated user)
SELECT status 
FROM public.subscriptions 
WHERE user_id = '27b86a05-158b-41b3-bb10-af6dd67368e7' 
  AND status = 'active';