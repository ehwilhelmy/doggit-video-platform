-- ========================================
-- CHECK SUBSCRIPTIONS TABLE
-- ========================================

-- 1. First, let's see what's actually in the subscriptions table
SELECT 
  s.*,
  u.email
FROM public.subscriptions s
JOIN auth.users u ON s.user_id = u.id
ORDER BY s.created_at DESC;

-- 2. If the table is empty, let's check if there's a constraint issue
-- Check the table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'subscriptions'
ORDER BY ordinal_position;

-- 3. Let's try a simpler insert without the metadata field
-- This might work if there's an issue with the metadata column
INSERT INTO public.subscriptions (
  user_id,
  status
)
SELECT 
  u.id as user_id,
  'active'::subscription_status
FROM auth.users u
WHERE 
  u.email IN (
    'herohomesolutionswa@gmail.com',
    'carleyjsimpson@gmail.com',
    'josimpson55@gmail.com',
    'collinbutkus95@gmail.com',
    'cameron@doggit.app',
    'cameron.simpson99@gmail.com'
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.subscriptions s 
    WHERE s.user_id = u.id
  );

-- 4. Now check again
SELECT 
  s.id,
  s.user_id,
  s.status,
  u.email,
  s.created_at
FROM public.subscriptions s
JOIN auth.users u ON s.user_id = u.id
ORDER BY s.created_at DESC;

-- 5. If still empty, let's check for any errors or constraints
SELECT 
  conname AS constraint_name,
  contype AS constraint_type,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.subscriptions'::regclass;