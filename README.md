<<<<<<< HEAD
# Password Security Manager - Chrome Extension

A Chrome extension for cybersecurity that analyzes password strength in real-time and securely stores credentials locally.

## ✨ Features

- 🔍 **Real-time Password Analysis** - Character-by-character strength checking
- 🎯 **Auto-Detection** - Automatically detects password fields on any website
- ⚠️ **Duplicate Prevention** - Warns if you reuse passwords across sites
- 💾 **Local Storage** - Saves all passwords in a single text file on YOUR computer
- 🔄 **Smart Updates** - Only saves when password changes, no duplicates
- 🛡️ **Privacy First** - No cloud, no external servers, 100% local

## 🚀 Installation

### Prerequisites

- **Google Chrome** (or Chromium-based browser)
- **Python 3.7+** ([Download here](https://python.org/downloads/))
  - ⚠️ **Important:** Check "Add Python to PATH" during installation

### Quick Install (Automated)

**One-Click Setup** ⭐ Recommended

```powershell
cd "d:\password strength"
.\INSTALL.bat
```

This script will:
- ✅ Detect Python automatically
- ✅ Prompt for Extension ID
- ✅ Configure everything for you
- ✅ Create vault folder

**That's it!** Restart Chrome and start using the extension.

## 📖 Usage

1. **Load Extension:**
   - Open Chrome → `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select: `password-checker-extension` folder
   - **Copy the Extension ID** (long string)

2. **Run Setup:**
   ```powershell
   .\INSTALL.bat
   ```
   Paste the Extension ID when prompted

3. **Restart Chrome**

4. **Test:**
   - Visit any login page
   - Type a password → See purple popup with strength analysis
   - Submit form → Password saved to `vault/passwords.txt`

## 📁 File Structure

```
password strength/
├── password-checker-extension/    # Chrome Extension
│   ├── manifest.json
│   ├── background.js
│   ├── contentScript.js
│   ├── popup.html/js
│   ├── styles.css
│   └── utils/password_analyzer.js
├── native-host/                   # Python Native Messaging
│   ├── host.py
│   ├── host.bat
│   ├── com.password_manager.host.json
│   └── register.bat
├── vault/                         # Password Storage
│   └── passwords.txt              # All passwords stored here
├── INSTALL.bat                    # ⭐ Automated setup script
├── CLEAN_FOR_SHARING.bat          # 🧹 Clean before sharing
├── README.md
└── .gitignore
```

## 🔧 How It Works

```
┌─────────────┐
│  Web Page   │ Password field detected
└──────┬──────┘
       │
       ▼
┌─────────────┐
│Content Script│ Analyzes password, shows popup
└──────┬──────┘
       │ Form submitted
       ▼
┌─────────────┐
│ Background  │ Sends to native host
└──────┬──────┘
       │ Native Messaging
       ▼
┌─────────────┐
│ Python Host │ Saves to passwords.txt
└─────────────┘
```

## 🎯 Password Storage Format

All passwords are saved in: `vault/passwords.txt`

```
PASSWORD VAULT - ALL SAVED PASSWORDS
============================================================

============================================================
SAVED ON: 2025-12-12T14:30:00.000Z
============================================================
Website URL: https://github.com/login
Username: user@example.com
Password: MyPassword123

============================================================
SAVED ON: 2025-12-12T14:35:00.000Z
============================================================
Website URL: https://facebook.com
Username: another@example.com
Password: AnotherPass456
```

## 🔐 Security Features

✅ **No Duplicates** - Same website+username+password won't be saved twice  
✅ **Smart Updates** - Updates entry only when password changes  
✅ **Local Only** - All data stays on YOUR computer  
✅ **No Cloud** - Zero external connections  
✅ **Plain Text** - Easy to backup and read (encrypt the vault folder for extra security)

## 🐛 Troubleshooting

### Extension not saving passwords?

Run the diagnostic:
```powershell
.\check_all.bat
```

### "Failed to save password" error?

1. Check Python is installed: `python --version`
2. Re-run setup: `.\INSTALL.bat`
3. Restart Chrome completely

### Extension ID changed?

This happens when you load the extension on a new system. Just run:
```powershell
.\INSTALL.bat
```
And enter the new Extension ID.

## 📤 Sharing/Uploading to GitHub

### **Before Sharing - IMPORTANT!** ⚠️

**Run this to remove your passwords:**
```powershell
.\CLEAN_FOR_SHARING.bat
```

This will:
- ✅ Create a backup of your passwords (kept locally)
- ✅ Clear `passwords.txt` (empty template)
- ✅ Remove all password files from vault
- ✅ Keep folder structure intact

## 📝 License

Educational project for cybersecurity learning.

## 🤝 Contributing

This is a personal cybersecurity project. Feel free to fork and modify!

---

**Built for Cybersecurity Education** 🔐
=======
# Password-Strength-Checker
A Chrome extension for real-time password strength analysis and secure local storage. Features character-by-character analysis, duplicate detection, password reuse warnings, and saves credentials to local text files. Built with Chrome Native Messaging and Python. Educational project.
