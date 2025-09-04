# Supabase Auth Configuration for Production

## Issue
Users cannot log in to production at https://training.doggit.app

## Root Cause
Supabase Auth settings likely missing production URLs

## Required Configuration

### 1. Supabase Dashboard → Authentication → URL Configuration

Add these URLs to your Supabase project:

**Site URL:**
```
https://training.doggit.app
```

**Redirect URLs:**
```
https://training.doggit.app/auth/callback
https://training.doggit.app/auth/reset-password
```

### 2. How to Fix

1. Go to https://supabase.com/dashboard
2. Select your project: `vbtucyswugifonwodopp`
3. Go to Authentication → URL Configuration
4. Add the URLs above
5. Save changes

### 3. Current Environment Variables (✅ Set)
- NEXT_PUBLIC_SUPABASE_URL: ✅ Set in Vercel
- NEXT_PUBLIC_SUPABASE_ANON_KEY: ✅ Set in Vercel

### 4. Test After Configuration
- Try logging in at https://training.doggit.app
- Check browser dev tools for any auth errors
- Verify redirect flow works properly

## Debug Steps Completed
- ✅ Fixed authentication logic in code
- ✅ Added missing environment variables to Vercel
- ✅ Deployed with new configuration
- 🔄 Need to configure Supabase Auth URLs (next step)