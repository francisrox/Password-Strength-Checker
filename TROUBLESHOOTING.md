# TROUBLESHOOTING: Extension Not Saving Passwords

## Current Status
✅ Python works (test file was created)
✅ Vault folder exists
❌ Extension not saving passwords from browser

## Issue: Form submitted but no file created

This means the extension's content script is not detecting the form submission.

## Step-by-Step Debugging

### 1. Check if Content Script is Loaded

1. Open Chrome
2. Go to: `file:///d:/password strength/test-login.html`
3. Press **F12** to open DevTools
4. Go to **Console** tab
5. Look for this message:
   ```
   [Password Manager] Content script initialized
   ```

**If you see it:** ✅ Content script loaded
**If you don't see it:** ❌ Content script not injected

---

### 2. Check if Password Detection Works

1. On the test page, **click on the password field**
2. **Type:** `Test123!`
3. Look at the page (not console)

**Question: Do you see a PURPLE POPUP appear near the password field showing "WEAK" or "MODERATE"?**

**If YES:** ✅ Extension is working, password analysis works
**If NO:** ❌ Extension not injecting properly

---

### 3. Check Console Logs During Submit

1. Keep DevTools Console open
2. Fill the form:
   - Email: `test@example.com`
   - Password: `MyPassword123`
3. Click **"Submit Login"** button
4. Look at Console

**Expected logs:**
```
[Password Manager] Attempting to save password for: test-login.html
[Password Manager] Username: test@example.com
```

**If you see these:** ✅ Form detection works, move to Step 4
**If you see nothing:** ❌ Form listener not attached

---

### 4. Check Background Service Worker

This is the most important step!

1. Open a new tab
2. Go to: `chrome://extensions/`
3. Find "Password Security Manager"
4. Look for **"service worker"** link (might say "inactive")
5. Click on **"service worker"** - this opens a new DevTools window
6. Go to **Console** tab in that window
7. Go back to your test page
8. Submit the form again
9. Look at the service worker console

**Expected logs:**
```
[Background] Received savePassword request for: test-login.html
[Background] Attempting to connect to native host: com.password_manager.host
[Background] Port created, sending message: {...}
[Background] Received response from native host: {success: true, ...}
✅ Password saved successfully!
```

**Common errors you might see:**
- ❌ "Specified native messaging host not found" → Registry issue
- ❌ "Native host has exited" → Python/batch file issue
- ❌ No logs at all → Message not reaching background script

---

## Quick Fixes

### Fix 1: Reload Extension
```
1. Go to chrome://extensions/
2. Find "Password Security Manager"
3. Click the RELOAD button (circular arrow)
4. Try again
```

### Fix 2: Check Extension Permissions
```
1. Go to chrome://extensions/
2. Click "Details" on "Password Security Manager"
3. Scroll down to "Site access"
4. Make sure it says "On all sites" or "On click"
```

### Fix 3: Re-register Native Host
```powershell
cd "d:\password strength\native-host"
.\register.bat
# Enter: bmdmmlbcednompaaljhdkjkcafncphco
```

### Fix 4: Restart Chrome Completely
```
Close ALL Chrome windows
Reopen Chrome
Try again
```

---

## What I Need From You

Please do these steps and tell me:

1. **Do you see the purple popup when you type a password?** (YES/NO)
2. **What logs do you see in the main page Console?** (copy/paste)
3. **What logs do you see in the service worker Console?** (copy/paste)

This will tell me exactly where the problem is!
