-- Alternative RLS Solutions

-- Option 1: Use a simpler policy that checks if user is authenticated (less secure but works)
-- DROP POLICY IF EXISTS "Users can read their own subscriptions v2" ON public.subscriptions;
-- CREATE POLICY "Allow authenticated users to read their subscriptions" 
-- ON public.subscriptions 
-- FOR SELECT 
-- TO authenticated
-- USING (auth.uid()::text = user_id::text OR auth.jwt() IS NOT NULL AND (auth.jwt()->>'sub')::text = user_id::text);

-- Option 2: Create a function that properly extracts the user ID
CREATE OR REPLACE FUNCTION auth.user_id() 
RETURNS UUID 
LANGUAGE SQL 
STABLE
AS $$
  SELECT COALESCE(
    auth.uid(),
    (current_setting('request.jwt.claims', true)::json->>'sub')::uuid,
    (auth.jwt()->>'sub')::uuid
  )
$$;

-- Then use this function in the policy
DROP POLICY IF EXISTS "Users can read their own subscriptions v2" ON public.subscriptions;
CREATE POLICY "Users can read their own subscriptions v3" 
ON public.subscriptions 
FOR SELECT 
USING (user_id = auth.user_id());

-- Option 3: Check what's in the current session/JWT
SELECT 
  'Current session info' as check,
  current_setting('request.jwt.claims', true) as jwt_claims,
  current_setting('request.jwt.claim.sub', true) as jwt_sub,
  auth.jwt() as full_jwt,
  auth.uid() as uid_result;

-- Test the new function
SELECT auth.user_id() as extracted_user_id;