-- Grant Access to Existing Users
-- Run this in your Supabase SQL Editor

-- This script will create active subscriptions for existing users
-- who registered but haven't gone through the Stripe payment flow yet

-- First, let's see who needs access (users without subscriptions)
SELECT 
  u.id,
  u.email,
  u.created_at,
  s.status as subscription_status
FROM auth.users u
LEFT JOIN public.subscriptions s ON u.id = s.user_id
WHERE s.id IS NULL
ORDER BY u.created_at DESC;

-- Grant access to specific users by email
-- Replace the emails below with your actual users who should have access

-- Option 1: Grant access to specific users (RECOMMENDED)
-- Uncomment and modify the emails below:

/*
INSERT INTO public.subscriptions (
  user_id,
  status,
  billing_interval,
  amount_cents,
  currency,
  current_period_start,
  current_period_end,
  metadata
)
SELECT 
  id as user_id,
  'active'::subscription_status,
  'month'::billing_interval,
  1000, -- $10.00
  'usd',
  NOW(),
  NOW() + INTERVAL '30 days',
  jsonb_build_object(
    'source', 'manual_grant',
    'reason', 'early_adopter',
    'granted_by', 'admin',
    'granted_at', NOW()
  )
FROM auth.users
WHERE email IN (
  'carleyjsimpson@gmail.com'
  -- Add more emails here, separated by commas
  -- 'user2@example.com',
  -- 'user3@example.com'
)
ON CONFLICT (user_id) 
DO UPDATE SET 
  status = 'active',
  updated_at = NOW();
*/

-- Option 2: Grant access to ALL existing users (USE WITH CAUTION)
-- This will give free access to everyone who has registered

/*
INSERT INTO public.subscriptions (
  user_id,
  status,
  billing_interval,
  amount_cents,
  currency,
  current_period_start,
  current_period_end,
  metadata
)
SELECT 
  id as user_id,
  'active'::subscription_status,
  'month'::billing_interval,
  1000, -- $10.00
  'usd',
  NOW(),
  NOW() + INTERVAL '30 days',
  jsonb_build_object(
    'source', 'manual_grant',
    'reason', 'early_adopter_batch',
    'granted_by', 'admin',
    'granted_at', NOW()
  )
FROM auth.users
WHERE id NOT IN (
  SELECT user_id FROM public.subscriptions
)
ON CONFLICT (user_id) 
DO UPDATE SET 
  status = 'active',
  updated_at = NOW();
*/

-- Option 3: Grant temporary trial access (30 days)
/*
INSERT INTO public.subscriptions (
  user_id,
  status,
  billing_interval,
  amount_cents,
  currency,
  trial_start,
  trial_end,
  current_period_start,
  current_period_end,
  metadata
)
SELECT 
  id as user_id,
  'trialing'::subscription_status,
  'month'::billing_interval,
  1000, -- $10.00 after trial
  'usd',
  NOW(),
  NOW() + INTERVAL '30 days',
  NOW(),
  NOW() + INTERVAL '30 days',
  jsonb_build_object(
    'source', 'manual_grant',
    'reason', 'trial_access',
    'granted_by', 'admin',
    'granted_at', NOW()
  )
FROM auth.users
WHERE email IN (
  'carleyjsimpson@gmail.com'
  -- Add more emails here
);
*/

-- After running the INSERT, verify the results:
-- SELECT 
--   u.email,
--   s.status,
--   s.current_period_end,
--   s.metadata
-- FROM public.subscriptions s
-- JOIN auth.users u ON s.user_id = u.id
-- ORDER BY s.created_at DESC;