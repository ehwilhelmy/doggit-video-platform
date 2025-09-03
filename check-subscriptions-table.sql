-- Check if subscriptions table exists and its structure
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'subscriptions' 
ORDER BY ordinal_position;

-- Check RLS policies on subscriptions table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'subscriptions';

-- Check if there are any existing subscription records
SELECT COUNT(*) as total_subscriptions FROM subscriptions;

-- Check sample subscription data (if any exists)
SELECT user_id, stripe_customer_id, status, created_at 
FROM subscriptions 
LIMIT 5;