-- Check current subscriptions
SELECT 
  u.email,
  s.status,
  s.stripe_customer_id,
  s.created_at
FROM public.subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE s.status = 'active'
ORDER BY u.email;

-- Check if investors@doggit.app exists as a user
SELECT 
  id,
  email,
  created_at
FROM auth.users 
WHERE email = 'investors@doggit.app';

-- Add subscription for investors@doggit.app (if they exist as a user)
INSERT INTO public.subscriptions (user_id, status)
SELECT 
  id,
  'active'
FROM auth.users 
WHERE email = 'investors@doggit.app'
ON CONFLICT (user_id) 
DO UPDATE SET status = 'active';

-- Verify it was added
SELECT 
  u.email,
  s.status,
  s.created_at
FROM public.subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE u.email = 'investors@doggit.app';