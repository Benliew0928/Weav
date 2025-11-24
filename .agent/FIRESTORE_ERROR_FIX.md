# Fixing Firestore Internal Assertion Error

## Problem
You're seeing: `FIRESTORE (12.6.0) INTERNAL ASSERTION FAILED: Unexpected state (ID: ca9)`

This happens because IndexedDB persistence was previously enabled and the browser cached that state.

## Solution: Clear Browser Cache

### Option 1: Hard Refresh (Quickest)
1. **Close all tabs** with your app open
2. Open a **new tab** and navigate to `http://localhost:3000`
3. Press **Ctrl + Shift + Delete** (Windows) or **Cmd + Shift + Delete** (Mac)
4. Select **"Cached images and files"** and **"Cookies and other site data"**
5. Click **Clear data**
6. **Hard refresh**: Press **Ctrl + Shift + R** (Windows) or **Cmd + Shift + R** (Mac)

### Option 2: Clear IndexedDB Manually (Most Reliable)
1. Open **DevTools** (F12)
2. Go to **Application** tab
3. In the left sidebar, expand **Storage** → **IndexedDB**
4. Right-click on **firestore** (or any Firebase-related databases)
5. Click **Delete database**
6. Also clear **Local Storage** and **Session Storage** under Storage
7. **Refresh** the page (F5)

### Option 3: Use Incognito/Private Window (Temporary Fix)
1. Open an **Incognito/Private window**
2. Navigate to `http://localhost:3000`
3. This will start fresh without cached data

### Option 4: Programmatic Fix (If above don't work)
If the error persists, we can add code to clear the cache on startup.

## Why This Happened
- We initially enabled `enableIndexedDbPersistence` 
- This created IndexedDB entries in your browser
- Even after removing the code, the browser still has the old state
- Firestore gets confused when it sees the old persistence data but the code doesn't match

## After Clearing Cache
The app will work normally with Firestore's built-in offline support (which doesn't use IndexedDB persistence).

## Verification
After clearing cache, you should see:
- ✅ No more Firestore errors
- ✅ Messages load correctly
- ✅ Real-time updates work
- ✅ Voice messages work

If you still see errors after trying all options, let me know and I'll add a programmatic fix!
