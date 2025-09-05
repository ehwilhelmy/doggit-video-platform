-- Complete RLS audit for subscriptions table

-- 1. Check if RLS is enabled
SELECT 
  'RLS Status' as check,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'subscriptions';

-- 2. Show ALL policies on subscriptions (with full details)
SELECT 
  'Policy Details' as check,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual as policy_condition,
  with_check
FROM pg_policies 
WHERE tablename = 'subscriptions'
ORDER BY policyname;

-- 3. Check what roles have what permissions
SELECT 
  'Table Permissions' as check,
  grantee as role_name,
  privilege_type as permission
FROM information_schema.role_table_grants 
WHERE table_name = 'subscriptions'
ORDER BY grantee, privilege_type;

-- 4. Test if we can simplify by temporarily disabling RLS
-- ONLY uncomment and run this if you want to disable RLS completely:
-- ALTER TABLE public.subscriptions DISABLE ROW LEVEL SECURITY;

-- 5. Alternative: Create a simple policy that allows all authenticated users to read ALL subscriptions
-- This is less secure but will help identify if the issue is with auth.uid() matching
-- DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.subscriptions;
-- CREATE POLICY "Simple read for authenticated" 
-- ON public.subscriptions 
-- FOR SELECT 
-- TO authenticated
-- USING (true);  -- This allows ALL authenticated users to read ALL subscriptions