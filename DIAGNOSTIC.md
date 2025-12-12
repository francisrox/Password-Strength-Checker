# Manual Testing Guide

## Problem: Vault folder not being created
This means the native messaging connection is failing.

## Test 1: Verify Python Works

Run this command to test if Python can create the vault folder:

```powershell
C:\Python314\python.exe "d:\password strength\test_vault.py"
```

**Expected output:**
```
✓ Created vault directory: d:\password strength\vault
✓ Created test file: d:\password strength\vault\test.example.com_testuser.txt
✅ SUCCESS! If you can see this, Python file creation works!
```

**If this works:** Python is fine, the issue is with Chrome native messaging

**If this fails:** Python path is wrong or permissions issue

---

## Test 2: Check Extension Logs

### A. Check if extension is detecting passwords:

1. Open Chrome
2. Go to: `file:///d:/password strength/test-login.html`
3. Press F12 (DevTools)
4. Go to Console tab
5. Click on the password field and type something

**Expected:** You should see `[Password Manager] Content script initialized`

**If you see this:** Extension is loaded ✅
**If nothing:** Extension not injected ❌

### B. Check if form submission is detected:

1. Fill the form (email + password)
2. Click Submit
3. Look at Console

**Expected:** `[Password Manager] Attempting to save password for: ...`

**If you see this:** Form detection works ✅
**If nothing:** Form listener not attached ❌

### C. Check background service worker:

1. Go to `chrome://extensions/`
2. Find "Password Security Manager"
3. Click **"service worker"** (might need to submit a form first to activate it)
4. Look at Console tab

**Expected logs:**
```
[Background] Received savePassword request for: ...
[Background] Attempting to connect to native host: com.password_manager.host
[Background] Port created, sending message: ...
```

**If you see error:**
- "Specified native messaging host not found" → Registry issue
- "Native host has exited" → Python/batch file issue
- "Access is denied" → Permissions issue

---

## Test 3: Verify Registry Entry

```powershell
reg query "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.password_manager.host"
```

**Expected output:**
```
(Default)    REG_SZ    d:\password strength\native-host\com.password_manager.host.json
```

**If different:** Re-run register.bat

---

## Test 4: Verify Manifest File

```powershell
Get-Content "d:\password strength\native-host\com.password_manager.host.json"
```

**Expected:**
```json
{
    "name": "com.password_manager.host",
    "description": "Password Manager Native Messaging Host",
    "path": "d:\\password strength\\native-host\\host.bat",
    "type": "stdio",
    "allowed_origins": [
        "chrome-extension://bmdmmlbcednompaaljhdkjkcafncphco/"
    ]
}
```

**Check:**
- Path points to `host.bat` (not `host.py`) ✓
- Extension ID matches your actual ID ✓

---

## Quick Fix Checklist

Try these in order:

1. **Reload Extension**
   ```
   chrome://extensions/ → Click reload button
   ```

2. **Re-register Native Host**
   ```powershell
   cd "d:\password strength\native-host"
   .\register.bat
   # Enter: bmdmmlbcednompaaljhdkjkcafncphco
   ```

3. **Restart Chrome Completely**
   - Close ALL Chrome windows
   - Reopen Chrome

4. **Test with test-login.html**
   - Open: `file:///d:/password strength/test-login.html`
   - Fill form and submit
   - Check for alert popup

---

## If Still Not Working

Please run these commands and share the output:

```powershell
# 1. Test Python
C:\Python314\python.exe --version

# 2. Test vault creation
C:\Python314\python.exe "d:\password strength\test_vault.py"

# 3. Check if vault was created
Test-Path "d:\password strength\vault"

# 4. Check registry
reg query "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.password_manager.host"
```
