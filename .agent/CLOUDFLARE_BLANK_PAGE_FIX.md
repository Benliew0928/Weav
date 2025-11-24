# Cloudflare Pages Blank Page Fix

## Problem
After deploying to Cloudflare Pages, the site shows a blank page.

## Root Cause
**Missing Firebase environment variables** - Cloudflare doesn't have access to your `.env.local` file.

## Solution: Add Environment Variables to Cloudflare

### Step 1: Get Your Environment Variables

Your Firebase config from `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

### Step 2: Add to Cloudflare Pages

1. **Go to Cloudflare Dashboard**: https://dash.cloudflare.com/
2. **Select your Pages project**
3. **Go to Settings** → **Environment variables**
4. **Add each variable**:
   - Click "Add variable"
   - Name: `NEXT_PUBLIC_FIREBASE_API_KEY`
   - Value: (your actual value from `.env.local`)
   - Environment: **Production** (and Preview if needed)
   - Click "Save"

5. **Repeat for ALL Firebase variables**:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

### Step 3: Redeploy

After adding all environment variables:
1. **Go to Deployments** tab
2. Click **"Retry deployment"** on the latest deployment
   - OR -
3. Push a new commit to trigger a rebuild

### Step 4: Check Browser Console

If still blank after redeployment:
1. Open the deployed site
2. Press **F12** to open DevTools
3. Check the **Console** tab for errors
4. Look for Firebase initialization errors

## Common Issues

### Issue 1: Build Framework Not Set
**Fix**: In Cloudflare Pages settings:
- Framework preset: **Next.js**
- Build command: `npm run build`
- Build output directory: `.next`

### Issue 2: Node Version Too Old
**Fix**: Add environment variable:
- Name: `NODE_VERSION`
- Value: `18` or `20`

### Issue 3: Missing Dependencies
**Fix**: Make sure `package.json` includes all dependencies:
```json
{
  "dependencies": {
    "firebase": "^10.x.x",
    "next": "^14.x.x",
    "react": "^18.x.x",
    // ... all your dependencies
  }
}
```

## Verification Steps

1. ✅ All environment variables added to Cloudflare
2. ✅ Build succeeds (check Deployments → Build logs)
3. ✅ No errors in browser console
4. ✅ Firebase initializes correctly

## Quick Checklist

- [ ] Added all 7 Firebase environment variables
- [ ] Set to "Production" environment
- [ ] Redeployed after adding variables
- [ ] Checked browser console for errors
- [ ] Framework preset is "Next.js"
- [ ] Build output directory is `.next`

## Still Blank?

Check the **Cloudflare Pages build logs**:
1. Go to your project
2. Click **Deployments**
3. Click on the latest deployment
4. Check **Build logs** for errors

Common errors:
- Missing environment variables
- Build failures
- Import errors
- Firebase initialization errors

## Alternative: Check Locally First

Before deploying, test the production build locally:
```bash
npm run build
npm start
```

If it works locally but not on Cloudflare, it's definitely an environment variable issue!
