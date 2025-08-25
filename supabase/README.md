# Supabase Database Setup

This directory contains the database schema and migration files for the DOGGIT video platform.

## Setup Instructions

### 1. Run the Migrations

Go to your Supabase project dashboard → SQL Editor and run the migration files in order:

1. **001_create_user_profiles.sql** - Creates user profiles table with RLS policies
2. **002_create_subscriptions.sql** - Creates subscriptions table for billing management
3. **003_create_user_progress.sql** - Creates video progress and watchlist tracking

Copy and paste each file's contents into the SQL Editor and execute them.

### 2. Verify Tables Created

After running the migrations, you should see these tables in your Database → Tables section:

- `profiles` - Extended user profiles
- `subscriptions` - User subscription status
- `video_progress` - Video watching progress
- `user_watchlist` - User's saved videos

### 3. Enable Row Level Security

All tables have Row Level Security (RLS) enabled automatically by the migrations. This ensures:

- Users can only see/modify their own data
- Subscription management requires service role access (for webhooks)
- Proper data isolation between users

## Database Schema Overview

### Profiles Table
Extends the built-in `auth.users` with additional information:
- Personal details (first_name, last_name, phone)
- Dog training specific data (pup_name, training_goals)
- Automatically created when users sign up

### Subscriptions Table
Tracks user billing and subscription status:
- Stripe integration fields (subscription_id, customer_id, price_id)
- Subscription status and billing cycles
- Trial periods and cancellation handling
- One active subscription per user constraint

### Video Progress Table
Tracks user engagement with video content:
- Watch duration and completion status
- Progress percentages
- First/last watched timestamps
- Unique constraint per user per video

### User Watchlist Table
Simple saved videos functionality:
- User can save videos to watch later
- Easy add/remove operations

## Useful Queries

### Check if user has active subscription:
```sql
SELECT has_active_subscription('user-uuid-here');
```

### Get user's current subscription details:
```sql
SELECT * FROM get_user_subscription('user-uuid-here');
```

### Update video progress:
```sql
SELECT update_video_progress('video-id', 150, 300); -- 150s watched out of 300s total
```

### Get user's video progress:
```sql
SELECT * FROM get_user_progress(); -- All progress
SELECT * FROM get_user_progress('video-id'); -- Specific video
```

## Security Notes

- All tables use Row Level Security (RLS)
- Users can only access their own data
- Subscription management requires elevated permissions
- Database functions run with SECURITY DEFINER for controlled access
- Automatic profile creation on user signup via triggers

## Environment Variables

Make sure these are set in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## TypeScript Types

The database types are defined in `/types/database.ts` and are automatically used by the Supabase clients for full type safety.