# Testing Instructions

## How to Test Password Storage

1. **Open Chrome DevTools**
   - Press `F12` or right-click → Inspect
   - Go to the **Console** tab

2. **Visit a Test Page**
   - Go to any website with a login form
   - Or use this test HTML: https://www.w3schools.com/howto/howto_css_login_form.asp

3. **Fill Out the Form**
   - Enter a username/email
   - Enter a password
   - **IMPORTANT**: Click the Submit/Login button (don't just press Enter)

4. **Check Console Logs**
   You should see messages like:
   ```
   [Password Manager] Attempting to save password for: example.com
   [Background] Received savePassword request for: example.com
   [Background] Connecting to native host: com.password_manager.host
   [Background] Port created, sending message: {action: 'save', data: {...}}
   [Background] Received response from native host: {success: true, ...}
   ✅ Password saved successfully!
   ```

5. **Check for Errors**
   If you see errors like:
   - "Specified native messaging host not found" → Registry issue
   - "Native host has exited" → Python script issue
   - "Access denied" → Permissions issue

6. **Check Vault Folder**
   ```powershell
   explorer "d:\password strength\vault"
   ```
   You should see a new `.txt` file!

## Common Issues

### Error: "Specified native messaging host not found"
**Fix:** Re-run the registration:
```powershell
cd "d:\password strength\native-host"
.\register.bat
# Enter extension ID: bmdmmlbcednompaaljhdkjkcafncphco
```

### Error: "Native host has exited"
**Fix:** Check Python path in `host.bat`:
```batch
"C:\Python314\python.exe" "%~dp0host.py"
```
Make sure this path is correct for your Python installation.

### No Logs Appearing
**Fix:** Make sure you're looking at the right console:
- For content script logs: Main page console (F12)
- For background script logs: Go to `chrome://extensions/` → Click "service worker" link under your extension
