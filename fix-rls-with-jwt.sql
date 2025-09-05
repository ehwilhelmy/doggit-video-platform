-- Check current RLS and policies
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'subscriptions';

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can read own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Service role full access" ON public.subscriptions;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.subscriptions;

-- Create a new policy using auth.jwt() instead of auth.uid()
-- This extracts the user ID from the JWT token directly
CREATE POLICY "Users can read their own subscriptions v2" 
ON public.subscriptions 
FOR SELECT 
USING (
  user_id = (auth.jwt() ->> 'sub')::uuid
);

-- Also create a policy for service role (webhooks)
CREATE POLICY "Service role bypass" 
ON public.subscriptions 
FOR ALL 
USING (auth.role() = 'service_role');

-- Test the new approach
SELECT 
  'JWT sub claim' as test,
  auth.jwt() ->> 'sub' as jwt_sub,
  (auth.jwt() ->> 'sub')::uuid as jwt_sub_uuid;

-- List new policies
SELECT 
  policyname,
  qual as condition
FROM pg_policies 
WHERE tablename = 'subscriptions';