# Setup on New System - Quick Guide

## 📋 Prerequisites

1. **Google Chrome** installed
2. **Python 3.7+** installed ([Download](https://python.org/downloads/))
   - ⚠️ Check "Add Python to PATH" during installation

## 🚀 Installation Steps

### Step 1: Copy Files

Copy the entire `password strength` folder to the new system.
Example: `D:\password strength\`

### Step 2: Install Python (if not installed)

1. Download Python from python.org
2. Run installer
3. ✅ Check "Add Python to PATH"
4. Click Install

Verify:
```powershell
python --version
```

### Step 3: Update Python Path in host.bat

1. Find your Python installation path:
   ```powershell
   where python
   ```
   Example output: `C:\Python314\python.exe`

2. Edit `d:\password strength\native-host\host.bat`
3. Update line 3 with your Python path:
   ```batch
   "C:\Python314\python.exe" "%~dp0host.py"
   ```

### Step 4: Load Extension in Chrome

1. Open Chrome
2. Go to: `chrome://extensions/`
3. Enable **Developer mode** (toggle top-right)
4. Click **Load unpacked**
5. Select folder: `d:\password strength\password-checker-extension`
6. **COPY the Extension ID** (long string below extension name)
   - Example: `bmdmmlbcednompaaljhdkjkcafncphco`

### Step 5: Register Native Messaging Host

1. Open Command Prompt or PowerShell
2. Navigate to native-host folder:
   ```powershell
   cd "d:\password strength\native-host"
   ```
3. Run registration script:
   ```powershell
   .\register.bat
   ```
4. When prompted, **paste the Extension ID** from Step 4
5. Press Enter

You should see:
```
========================================
SUCCESS! Native host registered.
========================================
```

### Step 6: Restart Chrome

Close ALL Chrome windows and reopen Chrome.

### Step 7: Test

1. Go to any website with a login form
2. Click password field → Purple popup should appear
3. Fill in credentials and submit
4. Check: `d:\password strength\vault\passwords.txt`

## ✅ Verification Checklist

Run this to verify everything:
```powershell
cd "d:\password strength"
.\check_all.bat
```

All checks should pass!

## 🔧 Troubleshooting

### Issue: Python not found
**Fix:** Install Python and make sure "Add to PATH" is checked

### Issue: Extension not loading
**Fix:** 
1. Go to `chrome://extensions/`
2. Click RELOAD on the extension
3. Check for "Errors" button

### Issue: "Specified native messaging host not found"
**Fix:** Re-run `register.bat` with correct Extension ID

### Issue: Wrong Python path
**Fix:** Edit `host.bat` with correct Python path from `where python`

## 📝 Important Notes

- Extension ID will be **different** on each system
- You must run `register.bat` on each new system
- Python path may be different (update `host.bat`)
- Vault folder will be created automatically

## 🎯 Quick Setup (Summary)

```powershell
# 1. Install Python (if needed)
python --version

# 2. Update host.bat with Python path
# Edit: d:\password strength\native-host\host.bat

# 3. Load extension in Chrome
# chrome://extensions/ → Load unpacked

# 4. Register native host
cd "d:\password strength\native-host"
.\register.bat
# Enter Extension ID when prompted

# 5. Restart Chrome

# 6. Test!
```

That's it! 🚀
