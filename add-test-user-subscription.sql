-- Add subscription for test user so they can access the platform
-- Replace 'YOUR_TEST_EMAIL_HERE' with the actual test user email

-- First, check if the user exists
SELECT 
  'USER CHECK' as section,
  u.id as user_id,
  u.email,
  u.created_at
FROM auth.users u 
WHERE u.email = 'YOUR_TEST_EMAIL_HERE';

-- Create subscription for the test user
INSERT INTO public.subscriptions (
  user_id,
  status,
  created_at,
  updated_at
)
SELECT 
  u.id,
  'active',
  NOW(),
  NOW()
FROM auth.users u
WHERE u.email = 'YOUR_TEST_EMAIL_HERE'
  AND NOT EXISTS (
    SELECT 1 FROM public.subscriptions s 
    WHERE s.user_id = u.id
  );

-- Verify the subscription was created
SELECT 
  'VERIFICATION' as section,
  u.email,
  s.status,
  s.stripe_customer_id,
  s.created_at as subscription_created,
  'Should now have access to dashboard' as result
FROM auth.users u
LEFT JOIN public.subscriptions s ON s.user_id = u.id
WHERE u.email = 'YOUR_TEST_EMAIL_HERE';