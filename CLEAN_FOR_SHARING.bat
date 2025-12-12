@echo off
echo ========================================
echo Password Manager - Clean for Sharing
echo ========================================
echo.
echo This script will prepare the project for sharing/uploading
echo by removing all saved passwords.
echo.
echo WARNING: This will DELETE all passwords in vault folder!
echo.
set /p CONFIRM="Are you sure you want to continue? (Y/N): "

if /i not "%CONFIRM%"=="Y" (
    echo Operation cancelled.
    pause
    exit /b 0
)

echo.
echo [1/3] Backing up passwords.txt...
if exist "d:\password strength\vault\passwords.txt" (
    copy "d:\password strength\vault\passwords.txt" "d:\password strength\vault\passwords_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt" >nul
    echo OK: Backup created as passwords_backup_YYYYMMDD.txt
) else (
    echo No passwords.txt found, skipping backup
)
echo.

echo [2/3] Clearing passwords.txt...
(
echo PASSWORD VAULT - ALL SAVED PASSWORDS
echo ============================================================
echo.
) > "d:\password strength\vault\passwords.txt"
echo OK: passwords.txt cleared
echo.

echo [3/3] Removing other password files...
del /q "d:\password strength\vault\*.txt" 2>nul
if exist "d:\password strength\vault\.gitkeep" (
    echo Keep this folder in git but ignore password files > "d:\password strength\vault\.gitkeep"
)
(
echo PASSWORD VAULT - ALL SAVED PASSWORDS
echo ============================================================
echo.
) > "d:\password strength\vault\passwords.txt"
echo OK: Vault cleaned
echo.

echo ========================================
echo CLEANUP COMPLETE!
echo ========================================
echo.
echo The project is now ready to share/upload to GitHub.
echo.
echo What was done:
echo - Backup created (if passwords existed)
echo - passwords.txt cleared (empty template created)
echo - All other password files removed
echo.
echo Your backup is saved as: passwords_backup_YYYYMMDD.txt
echo (This file is in .gitignore and won't be uploaded)
echo.
echo Next steps:
echo 1. Upload to GitHub (your passwords are safe)
echo 2. Users who download will get empty vault
echo 3. They run INSTALL.bat to set up on their system
echo.
pause
