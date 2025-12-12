# Testing Dynamic Vault Path

## Problem
The vault path was hardcoded as `d:\password strength\vault`, which caused:
- ❌ All systems saving to the same location
- ❌ Password mixing between different users/systems
- ❌ Security issue - your passwords accessible to others

## Solution
Changed to dynamic path based on script location:

```python
# OLD (hardcoded):
VAULT_DIR = Path(r"d:\password strength\vault")

# NEW (dynamic):
SCRIPT_DIR = Path(__file__).parent.parent.resolve()
VAULT_DIR = SCRIPT_DIR / "vault"
```

## How It Works

**System 1:**
- Script location: `D:\password strength\native-host\host.py`
- Vault location: `D:\password strength\vault\`

**System 2:**
- Script location: `C:\Users\John\Projects\password-manager\native-host\host.py`
- Vault location: `C:\Users\John\Projects\password-manager\vault\`

**Each system has its own vault!**

## Testing

1. **Test on current system:**
   ```powershell
   cd "d:\password strength"
   python native-host\host.py
   # Should create vault in: d:\password strength\vault\
   ```

2. **Copy to another location and test:**
   ```powershell
   # Copy folder to C:\test\
   cd "C:\test\password strength"
   python native-host\host.py
   # Should create vault in: C:\test\password strength\vault\
   ```

3. **Verify separation:**
   - Each location has its own `vault\passwords.txt`
   - No password mixing!

## Benefits

✅ **Isolated vaults** - Each installation is independent  
✅ **Portable** - Works anywhere you copy the folder  
✅ **Secure** - No cross-system password access  
✅ **GitHub-friendly** - Users get their own vault automatically  

## Migration

If you already have passwords in `d:\password strength\vault\`:
- They will continue to work on that system
- Other systems will create their own vault
- No data loss!
