# Firestore Composite Index Setup

## The Error You're Seeing

When you open a chat, you'll see an error in the console that says something like:
```
The query requires an index. You can create it here: https://console.firebase.google.com/...
```

This is because the query uses both `where` and `orderBy` on different fields, which requires a composite index.

## How to Create the Index

### Option 1: Click the Link (Easiest)

1. Open your browser console (F12)
2. Look for the Firestore error message
3. Click the link in the error message
4. It will take you directly to Firebase Console with the index pre-configured
5. Click "Create Index"
6. Wait 1-2 minutes for the index to build
7. Refresh your app and try again

### Option 2: Manual Creation

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click "Firestore Database" in the left sidebar
4. Click the "Indexes" tab
5. Click "Create Index"
6. Configure the index:
   - **Collection ID**: `messages`
   - **Collection group**: No
   - **Fields to index**:
     - Field: `isDeleted`, Order: `Ascending`
     - Field: `timestamp`, Order: `Ascending`
   - **Query scope**: `Collection`
7. Click "Create"
8. Wait for the index to build (usually 1-2 minutes)

### Option 3: Using Firebase CLI

If you have Firebase CLI installed:

1. Create a file `firestore.indexes.json` in your project root:

```json
{
  "indexes": [
    {
      "collectionGroup": "messages",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "isDeleted",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "timestamp",
          "order": "ASCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

2. Run:
```bash
firebase deploy --only firestore:indexes
```

## Why This Index is Needed

The query in `subscribeToMessages` is:
```typescript
query(
  messagesRef,
  where('isDeleted', '==', false),  // Filter deleted messages
  orderBy('timestamp', 'asc'),       // Sort by time
  limit(messageLimit)
)
```

Firestore requires a composite index when you:
- Use `where` on one field (`isDeleted`)
- AND `orderBy` on a different field (`timestamp`)

## After Creating the Index

1. Wait for the index status to show "Enabled" (green checkmark)
2. Refresh your browser
3. Open a chat - it should now load without errors!
4. The first time will show an empty chat (no messages yet)
5. Send a message to test - it should appear instantly!

## Troubleshooting

### Index is building but still getting errors?
- Wait a full 2-3 minutes
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check the index status in Firebase Console

### Still seeing "Failed to load messages"?
- Open browser console (F12)
- Look for the actual error message
- Share the error with me and I'll help debug

### Want to test without the index first?
- I can temporarily remove the `where` clause
- Messages will load but deleted ones won't be filtered
- Let me know if you want this temporary fix
