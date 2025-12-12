"""
Manual test script to verify the native messaging host works
Run this to test if the Python script can create files
"""

import json
from pathlib import Path

# Test data
test_data = {
    'hostname': 'test.example.com',
    'username': 'testuser@example.com',
    'password': 'TestPassword123',
    'url': 'https://test.example.com/login'
}

# Vault directory
VAULT_DIR = Path(r"d:\password strength\vault")

# Create vault directory
VAULT_DIR.mkdir(parents=True, exist_ok=True)
print(f"✓ Created vault directory: {VAULT_DIR}")

# Create test file
filename = f"{test_data['hostname']}_{test_data['username'].split('@')[0]}.txt"
filepath = VAULT_DIR / filename

content = f"""Website URL: {test_data['url']}
Username: {test_data['username']}
Password: {test_data['password']}
"""

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"✓ Created test file: {filepath}")
print(f"\nFile contents:")
print(content)
print(f"\n✅ SUCCESS! If you can see this, Python file creation works!")
print(f"Check the vault folder: {VAULT_DIR}")
