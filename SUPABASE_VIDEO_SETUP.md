# Supabase Storage Video Setup

## Quick Setup (5 minutes)

### 1. Go to your Supabase Dashboard
- Navigate to Storage section
- Create a new bucket called `videos`
- Make it PUBLIC (important!)

### 2. Upload your video
- Click "Upload files" 
- Select your `puppy-basics.mp4` video
- Wait for upload to complete

### 3. Get the public URL
Your video URL will be:
```
https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/videos/puppy-basics.mp4
```

### 4. Update your code
Replace the Google Drive URL in `/app/dashboard/page.tsx` (line 104):

```javascript
// OLD:
video_url: "https://drive.usercontent.google.com/download?id=1Cb0R2HcNtovUx0gSuF_L6KQeoLZZhaDk&export=download",

// NEW:
video_url: "https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/videos/puppy-basics.mp4",
```

Also update in `/app/watch/page.tsx` (line 36):
```javascript
// OLD:
videoUrl: "https://drive.usercontent.google.com/download?id=1Cb0R2HcNtovUx0gSuF_L6KQeoLZZhaDk&export=download",

// NEW:  
videoUrl: "https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/videos/puppy-basics.mp4",
```

## Why Supabase Storage is Perfect

✅ **Direct video URLs** - Works with HTML5 `<video>` tag  
✅ **No CORS issues** - Proper headers set automatically  
✅ **Built-in CDN** - Fast streaming globally  
✅ **Simple pricing** - Clear, predictable costs  
✅ **Dashboard upload** - Easy drag-and-drop interface  

## Test It
1. Update the URLs
2. Run `npm run dev`
3. Videos should play perfectly with all custom controls working!

## Need your Supabase Project?
If you don't have a Supabase project:
1. Go to https://supabase.com
2. Create a free project
3. Get your project URL from Settings → API