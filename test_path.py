import sys
from pathlib import Path

# Test the path resolution
print("Testing vault path resolution...")
print()

# Simulate the host.py logic
script_file = Path("d:/password strength/native-host/host.py")
print(f"Script location: {script_file}")

script_dir = script_file.parent.parent.resolve()
print(f"Script parent.parent: {script_dir}")

vault_dir = script_dir / "vault"
print(f"Vault directory: {vault_dir}")

print()
print(f"Does vault exist? {vault_dir.exists()}")

if not vault_dir.exists():
    print("Creating vault directory...")
    vault_dir.mkdir(parents=True, exist_ok=True)
    print(f"Created: {vault_dir}")

print()
print("✅ Path resolution test complete!")
