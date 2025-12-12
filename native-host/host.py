#!/usr/bin/env python3
"""
Native Messaging Host for Password Manager Extension
Handles saving passwords to local file system
"""

import sys
import json
import struct
import os
from pathlib import Path
from datetime import datetime

# Vault directory - try dynamic path first, fallback to hardcoded
# This ensures compatibility while supporting portability
try:
    SCRIPT_DIR = Path(__file__).parent.parent.resolve()
    VAULT_DIR = SCRIPT_DIR / "vault"
    # Test if we can access it
    VAULT_DIR.mkdir(parents=True, exist_ok=True)
except Exception:
    # Fallback to hardcoded path if dynamic fails
    VAULT_DIR = Path(r"d:\password strength\vault")

def send_message(message):
    """Send a message to Chrome extension"""
    encoded_message = json.dumps(message).encode('utf-8')
    sys.stdout.buffer.write(struct.pack('I', len(encoded_message)))
    sys.stdout.buffer.write(encoded_message)
    sys.stdout.buffer.flush()

def read_message():
    """Read a message from Chrome extension"""
    text_length_bytes = sys.stdin.buffer.read(4)
    if len(text_length_bytes) == 0:
        return None
    
    text_length = struct.unpack('I', text_length_bytes)[0]
    text = sys.stdin.buffer.read(text_length).decode('utf-8')
    return json.loads(text)

def ensure_vault_exists():
    """Create vault directory if it doesn't exist"""
    VAULT_DIR.mkdir(parents=True, exist_ok=True)

def sanitize_filename(text):
    """Sanitize text for use in filename"""
    # Remove or replace invalid filename characters
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        text = text.replace(char, '_')
    return text[:100]  # Limit length

def save_password(data):
    """Save password to a single file (append mode), avoiding duplicates"""
    try:
        ensure_vault_exists()
        
        hostname = data.get('hostname', 'unknown')
        username = data.get('username', 'no_username')
        password = data.get('password', '')
        url = data.get('url', '')
        timestamp = data.get('timestamp', datetime.now().isoformat())
        
        # Single file for all passwords
        filepath = VAULT_DIR / "passwords.txt"
        
        # Check if file exists and read existing entries
        existing_entries = []
        entry_found = False
        password_changed = False
        
        if filepath.exists():
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Parse existing entries
            entries = content.split('=' * 60)
            for i, entry in enumerate(entries):
                if 'Website URL:' in entry and 'Username:' in entry and 'Password:' in entry:
                    # Extract details from entry
                    lines = entry.strip().split('\n')
                    entry_url = ''
                    entry_username = ''
                    entry_password = ''
                    
                    for line in lines:
                        if line.startswith('Website URL:'):
                            entry_url = line.replace('Website URL:', '').strip()
                        elif line.startswith('Username:'):
                            entry_username = line.replace('Username:', '').strip()
                        elif line.startswith('Password:'):
                            entry_password = line.replace('Password:', '').strip()
                    
                    # Check if this is the same website + username
                    if entry_url == url and entry_username == username:
                        entry_found = True
                        # Check if password changed
                        if entry_password != password:
                            password_changed = True
                        else:
                            # Same password, don't save again
                            return {
                                'success': True,
                                'message': 'Password already saved (no changes)',
                                'filepath': str(filepath),
                                'skipped': True
                            }
        
        # If password changed, update the file by removing old entry
        if entry_found and password_changed:
            # Read all content
            with open(filepath, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            
            # Find and remove the old entry
            new_lines = []
            skip_until_next_separator = False
            found_old_entry = False
            
            for i, line in enumerate(lines):
                if not found_old_entry and f'Website URL: {url}' in line:
                    # Check if next few lines match username
                    if i + 1 < len(lines) and f'Username: {username}' in lines[i + 1]:
                        found_old_entry = True
                        skip_until_next_separator = True
                        continue
                
                if skip_until_next_separator:
                    if line.strip() == '=' * 60:
                        skip_until_next_separator = False
                    continue
                
                new_lines.append(line)
            
            # Write back without the old entry
            with open(filepath, 'w', encoding='utf-8') as f:
                f.writelines(new_lines)
        
        # Prepare new entry content
        entry = f"""{'=' * 60}
SAVED ON: {timestamp}
{'=' * 60}
Website URL: {url}
Username: {username}
Password: {password}

"""
        
        # Append new entry
        with open(filepath, 'a', encoding='utf-8') as f:
            if not filepath.exists() or filepath.stat().st_size == 0:
                # Add header for new file
                f.write("PASSWORD VAULT - ALL SAVED PASSWORDS\n")
                f.write("=" * 60 + "\n\n")
            f.write(entry)
        
        message = 'Password updated successfully' if password_changed else 'Password saved successfully'
        
        return {
            'success': True,
            'message': message,
            'filepath': str(filepath),
            'updated': password_changed
        }
    
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def main():
    """Main message loop"""
    while True:
        message = read_message()
        
        if message is None:
            break
        
        action = message.get('action')
        
        if action == 'save':
            response = save_password(message.get('data', {}))
            send_message(response)
        else:
            send_message({
                'success': False,
                'error': f'Unknown action: {action}'
            })

if __name__ == '__main__':
    main()
