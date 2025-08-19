# Firebase Storage Video Setup

## 1. Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Create a project" (or use existing)
3. Give it a name (e.g., "doggit-videos")
4. Disable Google Analytics (not needed)

## 2. Set Up Storage
1. In Firebase Console, click "Storage" in left sidebar
2. Click "Get Started"
3. Choose "Start in production mode" (we'll make it public)
4. Select location closest to you
5. Click "Done"

## 3. Make Storage Public
In Firebase Console → Storage → Rules tab, replace with:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;  // Public read access
      allow write: if false; // No public writes
    }
  }
}
```
Click "Publish"

## 4. Upload Your Video
1. Go to "Files" tab in Storage
2. Click "Upload file"
3. Select your 350MB video
4. Wait for upload (shows progress)

## 5. Get Video URL
1. Click on uploaded video
2. In right panel, find "Access token" section
3. Copy the URL - it looks like:
```
https://firebasestorage.googleapis.com/v0/b/YOUR-PROJECT.appspot.com/o/puppy-basics.mp4?alt=media&token=YOUR-TOKEN
```

## 6. Update Your Code

In `/app/dashboard/page.tsx` (line 104):
```javascript
video_url: "https://firebasestorage.googleapis.com/v0/b/YOUR-PROJECT.appspot.com/o/puppy-basics.mp4?alt=media&token=YOUR-TOKEN",
```

In `/app/watch/page.tsx` (line 36):
```javascript
videoUrl: "https://firebasestorage.googleapis.com/v0/b/YOUR-PROJECT.appspot.com/o/puppy-basics.mp4?alt=media&token=YOUR-TOKEN",
```

## That's it! 

✅ **No compression needed** - Firebase handles 350MB easily  
✅ **Direct URLs** - Works with HTML5 video tag  
✅ **No CORS issues** - Proper headers automatically  
✅ **Free tier** - 5GB storage, 1GB/day bandwidth  
✅ **Fast CDN** - Google's global network  

## Test it
1. Update the URLs
2. Run `npm run dev`
3. Videos play perfectly with all controls!