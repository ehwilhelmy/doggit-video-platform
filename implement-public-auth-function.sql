-- Create the function in public schema instead of auth schema
CREATE OR REPLACE FUNCTION public.auth_user_id() 
RETURNS UUID 
LANGUAGE SQL 
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    auth.uid(),
    (current_setting('request.jwt.claims', true)::json->>'sub')::uuid,
    (auth.jwt()->>'sub')::uuid
  )
$$;

-- Grant execute permission on the new function
GRANT EXECUTE ON FUNCTION public.auth_user_id() TO anon, authenticated;

-- Drop the old policies
DROP POLICY IF EXISTS "Users can read their own subscriptions v2" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can read their own subscriptions v3" ON public.subscriptions;

-- Create new policy using the custom function
CREATE POLICY "Users can read their own subscriptions" 
ON public.subscriptions 
FOR SELECT 
USING (user_id = public.auth_user_id());

-- Keep the service role bypass
DROP POLICY IF EXISTS "Service role bypass" ON public.subscriptions;
CREATE POLICY "Service role bypass" 
ON public.subscriptions 
FOR ALL 
USING (auth.role() = 'service_role');

-- Test the new function
SELECT 
  'Function test' as test,
  public.auth_user_id() as extracted_user_id;

-- Verify the new policies
SELECT 
  policyname,
  qual as condition
FROM pg_policies 
WHERE tablename = 'subscriptions'
ORDER BY policyname;