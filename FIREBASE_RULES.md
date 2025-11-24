# Complete Firebase Security Rules

## Firestore Database Rules

Go to **Firebase Console → Firestore Database → Rules** and paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the resource
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      // Anyone authenticated can read user profiles
      allow read: if isAuthenticated();
      // Users can only write their own profile
      allow create, update: if isOwner(userId);
      // Users cannot delete their profile
      allow delete: if false;
    }
    
    // Threads collection
    match /threads/{threadId} {
      // Anyone authenticated can read threads
      allow read: if isAuthenticated();
      // Anyone authenticated can create threads (authorId must match their own ID)
      allow create: if isAuthenticated() 
        && request.resource.data.authorId == request.auth.uid;
      // Only thread author can update their thread
      allow update: if isAuthenticated() 
        && resource.data.authorId == request.auth.uid;
      // Only thread author can delete their thread
      allow delete: if isAuthenticated() 
        && resource.data.authorId == request.auth.uid;
    }
    
    // Notifications subcollection
    match /notifications/{userId}/{document=**} {
      // Users can only read their own notifications
      allow read: if isOwner(userId);
      // System can create notifications for users
      allow create: if isAuthenticated();
      // Users can update their own notifications (e.g., mark as read)
      allow update: if isOwner(userId);
      // Users can delete their own notifications
      allow delete: if isOwner(userId);
    }
  }
}
```

## Firebase Storage Rules

Go to **Firebase Console → Storage → Rules** and paste this:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Thread images
    match /threads/{threadId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && request.resource.size < 10 * 1024 * 1024 // 10MB limit
        && request.resource.contentType.matches('image/.*');
    }
    
    // Avatar images
    match /avatars/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId
        && request.resource.size < 5 * 1024 * 1024 // 5MB limit
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## Setup Steps

1. **Copy Firestore Rules**:
   - Go to Firebase Console → Firestore Database → Rules
   - Delete existing rules
   - Paste the Firestore rules above
   - Click "Publish"

2. **Copy Storage Rules**:
   - Go to Firebase Console → Storage → Rules
   - Delete existing rules
   - Paste the Storage rules above
   - Click "Publish"

3. **Verify**:
   - Rules should be active immediately
   - Test by creating a thread with an image
   - Check that images upload successfully

## What These Rules Do

### Firestore Rules:
- **Users**: Anyone can read profiles, users can only edit their own
- **Threads**: Anyone can read, only authenticated users can create (must be author), only author can update/delete
- **Notifications**: Users can only access their own notifications

### Storage Rules:
- **Thread Images**: Authenticated users can upload images up to 10MB
- **Avatar Images**: Users can only upload their own avatars up to 5MB
- All images must be image/* content type

