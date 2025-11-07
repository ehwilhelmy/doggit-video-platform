-- Add is_promotional column to subscriptions table
-- This tracks whether a subscription started with promotional pricing

ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS is_promotional BOOLEAN DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN public.subscriptions.is_promotional IS 'Indicates if this subscription started with promotional pricing (e.g., $1 first month)';
