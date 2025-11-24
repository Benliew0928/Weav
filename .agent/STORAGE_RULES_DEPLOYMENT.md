# Firebase Storage Rules Deployment Guide

## Problem
Voice messages fail to upload with error: `storage/unauthorized`

## Root Cause
Firebase Storage security rules don't allow uploads from your app.

## Solution

### Option 1: Deploy via Firebase Console (RECOMMENDED)

1. **Open Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `weav-ec5b5`
3. **Navigate to Storage**:
   - Click "Storage" in the left sidebar
   - Click "Rules" tab at the top
4. **Replace the rules** with the content from `storage.rules`:

```
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Allow anyone to read files (for public access to attachments)
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Allow authenticated users to upload to threads/{threadId}/attachments
    match /threads/{threadId}/attachments/{fileName} {
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }
  }
}
```

5. **Click "Publish"**

### Option 2: Temporary Fix for Testing (NOT RECOMMENDED FOR PRODUCTION)

If you just want to test quickly, use these permissive rules (⚠️ **INSECURE**):

```
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

**WARNING**: This allows ANYONE to upload/delete files. Only use for testing!

### After Deploying Rules

1. **Refresh your browser**
2. **Try recording a voice message** again
3. It should now upload successfully!

## What These Rules Do

- **Read Access**: Anyone can read/download files (needed for voice message playback)
- **Write Access**: Only authenticated users can upload to `threads/{threadId}/attachments/`
- **Delete Access**: Only authenticated users can delete their uploads

## Verification

After deployment, try:
1. Click the microphone button
2. Record a short message
3. Click stop
4. The voice message should upload and appear in the chat!
