# Microphone Permission Issues - Troubleshooting Guide

## Problem
- **PC**: Microphone doesn't work on localhost but works on Discord
- **iPhone**: Keeps saying "no permission" even after allowing microphone

## Root Causes & Solutions

### Issue 1: Browser Microphone Permissions (PC)

#### Chrome/Edge
1. **Check Site Permissions**:
   - Click the **lock icon** (or info icon) in the address bar
   - Look for "Microphone" permission
   - Make sure it's set to "Allow"
   - If it says "Blocked", change it to "Allow"
   - **Refresh the page**

2. **Check Browser Settings**:
   - Go to `chrome://settings/content/microphone`
   - Make sure your microphone is selected
   - Check if `http://localhost:3000` is in the "Blocked" list
   - If yes, remove it and add to "Allowed"

3. **Clear Site Data**:
   - Press `F12` to open DevTools
   - Go to **Application** tab
   - Click "Clear site data"
   - Refresh and try again

#### Firefox
1. Click the **microphone icon** in address bar
2. Select "Allow" for microphone
3. Check the "Remember this decision" box
4. Refresh the page

### Issue 2: iPhone Safari Microphone Issues

**Root Cause**: iOS Safari has strict HTTPS requirements for microphone access.

#### Solution 1: Use HTTPS (RECOMMENDED)

Localhost HTTP doesn't work reliably on iOS. You need HTTPS:

1. **Install mkcert** (one-time setup):
```bash
# Install chocolatey first (if not installed)
# Then install mkcert
choco install mkcert
mkcert -install
```

2. **Create local SSL certificate**:
```bash
cd c:\Weav
mkcert localhost 127.0.0.1 ::1
```

3. **Update your dev server** to use HTTPS:
   - Create/update `next.config.js`:
```javascript
const fs = require('fs')
const path = require('path')

module.exports = {
  // ... other config
  webpack: (config, { dev }) => {
    if (dev) {
      config.devServer = {
        ...config.devServer,
        https: {
          key: fs.readFileSync(path.join(__dirname, 'localhost-key.pem')),
          cert: fs.readFileSync(path.join(__dirname, 'localhost.pem')),
        },
      }
    }
    return config
  },
}
```

4. **Access via**: `https://localhost:3000`

#### Solution 2: Use ngrok (QUICK FIX)

This creates a public HTTPS URL for testing:

1. **Install ngrok**:
   - Download from: https://ngrok.com/download
   - Or: `choco install ngrok`

2. **Run ngrok**:
```bash
ngrok http 3000
```

3. **Use the HTTPS URL** it provides (e.g., `https://abc123.ngrok.io`)
4. **Open this URL on your iPhone**
5. **Allow microphone** when prompted

#### Solution 3: Test on Desktop Safari First

1. Open **Safari** on your Mac/PC
2. Go to `http://localhost:3000`
3. Try the microphone - if it works, the issue is iOS-specific
4. If it doesn't work, check Safari preferences

### Issue 3: MediaRecorder API Compatibility

Some browsers don't support certain audio formats.

#### Check Browser Compatibility:
```javascript
// Add this to your console to check
console.log('MediaRecorder supported:', 'MediaRecorder' in window)
console.log('getUserMedia supported:', 'mediaDevices' in navigator)
```

### Quick Diagnostic Steps

1. **Open browser console** (F12)
2. **Look for errors** when clicking the mic button
3. **Common errors**:
   - `NotAllowedError`: Permission denied
   - `NotFoundError`: No microphone found
   - `NotSupportedError`: Browser doesn't support MediaRecorder
   - `SecurityError`: HTTPS required (iOS)

### Recommended Solution for Your Case

**For PC**:
1. Clear browser cache and site data
2. Check Chrome permissions at `chrome://settings/content/microphone`
3. Make sure localhost is allowed

**For iPhone**:
1. Use **ngrok** for quick testing (easiest)
2. Or set up **HTTPS locally** for permanent solution
3. iOS Safari **requires HTTPS** for microphone access

### Testing Checklist

- [ ] Browser has microphone permission
- [ ] Correct microphone is selected in browser settings
- [ ] No other app is using the microphone
- [ ] Using HTTPS on iOS (not HTTP)
- [ ] Browser supports MediaRecorder API
- [ ] No browser extensions blocking microphone

### Still Not Working?

Try this test page to verify your microphone:
1. Go to: https://www.onlinemictest.com/
2. If it works there but not on your site, it's a permission/HTTPS issue
3. If it doesn't work anywhere, it's a system/hardware issue

## Next Steps

1. **For PC**: Check Chrome permissions and clear site data
2. **For iPhone**: Use ngrok to get HTTPS URL
3. **Long-term**: Set up local HTTPS with mkcert

Let me know which solution you'd like to implement!
