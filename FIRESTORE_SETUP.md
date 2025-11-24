# Firestore Security Rules & Indexes Setup

## Step 1: Firestore Security Rules

Go to Firebase Console → Firestore Database → Rules tab, and paste the following:

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
      // Users cannot delete their profile (optional - remove if you want to allow deletion)
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

## Step 2: Firestore Indexes

**Good news!** You don't need to manually create indexes for the current queries.

Firestore automatically creates single-field indexes, so these queries work without manual setup:
- Threads ordered by `createdAt` (single field)
- Notifications ordered by `timestamp` (single field)

### When you'll need to create indexes:

You'll only need to create indexes manually if you:
1. **Query multiple fields** (composite indexes)
   - Example: `where('authorId', '==', userId).orderBy('createdAt', 'desc')`
2. **Use array-contains or array-contains-any**
3. **Use range queries on different fields**

If you add more complex queries in the future, Firebase will show you a link to create the required index when you run the query. Just click the link and create it!

### Optional: Check existing indexes

You can view all indexes (including automatic ones) in:
Firebase Console → Firestore Database → Indexes tab

## Step 3: Enable Firestore (if not already enabled)

1. Go to Firebase Console → Firestore Database
2. If you see "Create database", click it
3. Choose "Start in test mode" (we'll update rules above)
4. Select a location closest to your users
5. Click "Enable"

## Step 3: Enable Authentication Methods

1. Go to Firebase Console → Authentication → Sign-in method
2. Enable the following providers:
   - **Email/Password**: Not needed for now (we're using Google and Anonymous)
   - **Google**: 
     - Click "Enable"
     - Add a support email
     - Save
   - **Anonymous**:
     - Click "Enable"
     - Save

## Step 4: Verify Setup

After setting up the rules and indexes:

1. **Test Authentication**:
   - Try signing in with Google
   - Try signing in anonymously
   - Both should work

2. **Test Thread Creation**:
   - Create a thread
   - It should appear in Firestore under `threads` collection
   - Check that `authorId` matches your user ID

3. **Test Real-time Sync**:
   - Open the app on two devices
   - Create a thread on one device
   - It should appear in real-time on the other device

4. **Test Notifications**:
   - Create a thread
   - Check that notifications are created in `notifications/{userId}/userNotifications`
   - Notifications should appear in real-time on other users' devices

## Troubleshooting

### If you get "Missing or insufficient permissions" error:
- Check that you're signed in
- Verify the security rules are deployed correctly
- Check the browser console for specific rule violations

### If queries are slow or fail:
- For single-field queries, indexes are automatic - no action needed
- For complex queries, Firebase will show a link to create missing indexes when you run the query
- Wait a few minutes for indexes to build (can take 1-5 minutes)

### If real-time updates don't work:
- Check browser console for errors
- Verify Firestore is enabled
- Make sure you're authenticated
- Check network tab for WebSocket connections

## Notes

- **Test Mode**: The rules above are secure for authenticated users. For production, you may want to add additional restrictions.
- **Indexes**: Single-field indexes are automatic. Composite indexes (multiple fields) will be suggested by Firebase when you run complex queries - just click the link in the error message.
- **Performance**: Automatic indexes are ready immediately. Manual composite indexes can take a few minutes to build.

