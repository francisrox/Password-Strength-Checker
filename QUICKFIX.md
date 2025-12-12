# Quick Fix Guide

## Issue: Service Worker Inactive

The service worker being "Inactive" is normal - it activates when needed.

## Step-by-Step Test

### 1. Check for Extension Errors

1. Go to `chrome://extensions/`
2. Look for **red "Errors" button** on "Password Security Manager"
3. If you see errors, click it and share the error message

### 2. Test Password Detection (Most Important!)

1. Open: `file:///d:/password strength/test-login.html`
2. Press **F12** (DevTools)
3. Go to **Console** tab
4. Click on the **password field**
5. Type: `Test123`

**Expected:** Purple popup appears showing password strength

**If popup appears:** ✅ Extension works!
**If no popup:** ❌ Content script not loading

### 3. Test Password Save

1. Fill the form:
   - Email: `test@example.com`
   - Password: `MyPassword123`
2. Click **"Submit Login"** button
3. Watch the Console

**Expected logs:**
```
[Password Manager] Attempting to save password for: test-login.html
```

**Expected alert:** "✅ Password saved to vault!"

### 4. Check Service Worker Console

1. Go to `chrome://extensions/`
2. Click **"service worker"** (it will activate when you click)
3. A new DevTools window opens
4. Go back to test page and submit form again
5. Look at service worker console

**Expected logs:**
```
[Background] Received savePassword request for: test-login.html
[Background] Connecting to native host...
```

## Common Issues

### Issue: No purple popup
**Fix:**
```
1. chrome://extensions/
2. Check "Password Security Manager" is ENABLED
3. Click RELOAD button
4. Refresh test page
```

### Issue: Extension has errors
**Fix:** Share the error message with me

### Issue: "Content script not loading"
**Fix:** Check manifest.json permissions

## Quick Commands

```powershell
# Check if passwords.txt exists
Test-Path "d:\password strength\vault\passwords.txt"

# View passwords.txt
Get-Content "d:\password strength\vault\passwords.txt"

# Check Python works
C:\Python314\python.exe --version
```

## What to Tell Me

Please answer these questions:

1. **Do you see any red "Errors" button on the extension?** (YES/NO)
2. **Does the purple popup appear when you type a password?** (YES/NO)
3. **What happens when you click Submit?** (Alert? Nothing? Error?)
4. **What do you see in the Console tab?** (Copy/paste logs)
