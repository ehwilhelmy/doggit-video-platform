-- Add subscription for herohomesolutionswa@gmail.com
INSERT INTO public.subscriptions (
  user_id,
  status
)
VALUES (
  '27b86a05-158b-41b3-bb10-af6dd67368e7',
  'active'
);

-- Verify it was added
SELECT 
  s.*,
  u.email
FROM public.subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE u.id = '27b86a05-158b-41b3-bb10-af6dd67368e7';