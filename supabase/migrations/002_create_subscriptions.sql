-- Create subscriptions table
-- This tracks user subscription status and billing information

CREATE TYPE subscription_status AS ENUM (
  'active',
  'canceled',
  'past_due',
  'unpaid',
  'incomplete',
  'incomplete_expired',
  'trialing',
  'paused'
);

CREATE TYPE billing_interval AS ENUM ('month', 'year');

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Stripe subscription details
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  stripe_price_id TEXT,
  
  -- Subscription details
  status subscription_status NOT NULL DEFAULT 'incomplete',
  billing_interval billing_interval DEFAULT 'month',
  amount_cents INTEGER, -- Amount in cents (e.g., 999 for $9.99)
  currency TEXT DEFAULT 'usd',
  
  -- Dates
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Ensure one active subscription per user
  UNIQUE(user_id, status) DEFERRABLE INITIALLY DEFERRED
);

-- Add partial unique index to allow only one active subscription per user
CREATE UNIQUE INDEX idx_user_active_subscription 
ON public.subscriptions (user_id) 
WHERE status = 'active';

-- Create updated_at trigger for subscriptions
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for subscriptions table
-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Only service role can insert/update subscriptions (for webhook handlers)
CREATE POLICY "Service role can manage subscriptions" ON public.subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION public.has_active_subscription(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.subscriptions 
    WHERE user_id = user_uuid 
    AND status = 'active'
    AND (current_period_end IS NULL OR current_period_end > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's current subscription
CREATE OR REPLACE FUNCTION public.get_user_subscription(user_uuid UUID DEFAULT auth.uid())
RETURNS TABLE(
  id UUID,
  status subscription_status,
  billing_interval billing_interval,
  amount_cents INTEGER,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.status,
    s.billing_interval,
    s.amount_cents,
    s.current_period_end,
    s.cancel_at_period_end
  FROM public.subscriptions s
  WHERE s.user_id = user_uuid
  AND s.status IN ('active', 'trialing', 'past_due')
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;