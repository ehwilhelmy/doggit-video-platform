-- Grant SELECT permissions on subscriptions table to anon role
GRANT SELECT ON public.subscriptions TO anon;
GRANT SELECT ON public.subscriptions TO authenticated;

-- Re-enable RLS and create proper policy
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;

-- Create proper RLS policy for authenticated users
CREATE POLICY "Users can view their own subscriptions" 
ON public.subscriptions 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Test the policy works
SELECT 
  'Policy created successfully' as status,
  policyname 
FROM pg_policies 
WHERE tablename = 'subscriptions' 
  AND policyname = 'Users can view their own subscriptions';

-- Check RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'subscriptions';