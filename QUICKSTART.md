# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1️⃣ Load Extension in Chrome
```
1. Open Chrome → chrome://extensions/
2. Enable "Developer mode" (top-right)
3. Click "Load unpacked"
4. Select: d:\password strength\password-checker-extension
5. COPY the Extension ID (looks like: abcdefghijklmnopqrstuvwxyz123456)
```

### 2️⃣ Register Native Host
```
1. Open Command Prompt
2. cd "d:\password strength\native-host"
3. register.bat
4. Paste the Extension ID when prompted
```

### 3️⃣ Test It!
```
1. Restart Chrome
2. Visit any login page
3. Click a password field
4. Type a password → See real-time analysis!
```

## 📍 Where are passwords saved?
`d:\password strength\vault\[website]_[username].txt`

## ❓ Not working?
- Make sure Python is installed: `python --version`
- Restart Chrome completely
- Check extension is enabled in chrome://extensions/
- Re-run register.bat if needed

---

**Need detailed help?** See [README.md](README.md)
