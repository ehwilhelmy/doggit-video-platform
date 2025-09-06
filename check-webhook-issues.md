# Stripe Webhook Troubleshooting

## Why Subscriptions Aren't Being Created Automatically

### Possible Issues:

1. **Webhook Not Configured in Stripe**
   - Go to Stripe Dashboard > Webhooks
   - Endpoint should be: `https://training.doggit.app/api/stripe/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`

2. **Webhook Secret Missing**
   - Check Vercel environment variables for `STRIPE_WEBHOOK_SECRET`
   - This is required to verify webhook signatures

3. **User Not Authenticated During Checkout**
   - If `user?.id` is undefined when creating checkout session
   - The webhook won't have a user_id to create the subscription

4. **Webhook Errors**
   - Check Stripe Dashboard > Webhooks > [Your endpoint] > Attempted webhooks
   - Look for failed attempts and error messages

### How to Fix:

1. **Verify Webhook in Stripe Dashboard**
   ```
   URL: https://training.doggit.app/api/stripe/webhook
   Events:
   - checkout.session.completed
   - customer.subscription.updated
   - customer.subscription.deleted
   ```

2. **Check Environment Variables in Vercel**
   ```
   STRIPE_SECRET_KEY=sk_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

3. **Test Webhook Manually**
   - Use Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
   - Or use Stripe Dashboard webhook testing

4. **Add Logging to Webhook**
   - The webhook already has console.log statements
   - Check Vercel Functions logs for errors

### Manual Fix for Missing Subscriptions:

For users who paid but don't have database records:

```sql
-- Find Stripe customers without subscriptions
-- You'll need to cross-reference with Stripe Dashboard

-- Add subscription for specific user
INSERT INTO public.subscriptions (
  user_id,
  stripe_customer_id,
  status
)
SELECT 
  u.id,
  'cus_XXXXX', -- Get from Stripe Dashboard
  'active'
FROM auth.users u
WHERE u.email = 'user@example.com'
ON CONFLICT (user_id) DO UPDATE SET 
  stripe_customer_id = EXCLUDED.stripe_customer_id,
  status = 'active';
```