@echo off
echo ========================================
echo Password Manager - Smart Setup Script
echo ========================================
echo.
echo This script will automatically configure the extension
echo for your system by updating the Extension ID.
echo.

REM Step 1: Check Python
echo [1/5] Checking Python...
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python not found!
    echo Please install Python from https://python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)
echo OK: Python found
echo.

REM Step 2: Find Python path
echo [2/5] Detecting Python path...
for /f "tokens=*" %%i in ('where python') do set PYTHON_PATH=%%i
echo Found Python at: %PYTHON_PATH%
echo.

REM Step 3: Update host.bat with correct Python path
echo [3/5] Updating host.bat with Python path...
(
echo @echo off
echo REM Wrapper script to run Python host
echo "%PYTHON_PATH%" "%%~dp0host.py"
) > "d:\password strength\native-host\host.bat"
echo OK: host.bat updated
echo.

REM Step 4: Get Extension ID from user
echo [4/5] Extension ID Setup
echo.
echo Please follow these steps to get your Extension ID:
echo 1. Open Chrome
echo 2. Go to: chrome://extensions/
echo 3. Enable "Developer mode" (toggle in top-right)
echo 4. Click "Load unpacked"
echo 5. Select folder: d:\password strength\password-checker-extension
echo 6. Find the Extension ID (long string below extension name)
echo    Example: bmdmmlbcednompaaljhdkjkcafncphco
echo.
set /p EXTENSION_ID="Enter your Extension ID here: "

if "%EXTENSION_ID%"=="" (
    echo ERROR: Extension ID cannot be empty!
    pause
    exit /b 1
)

echo.
echo Extension ID received: %EXTENSION_ID%
echo.

REM Step 5: Update manifest with Extension ID
echo [5/5] Updating native messaging manifest...
(
echo {
echo     "name": "com.password_manager.host",
echo     "description": "Password Manager Native Messaging Host",
echo     "path": "d:\\password strength\\native-host\\host.bat",
echo     "type": "stdio",
echo     "allowed_origins": [
echo         "chrome-extension://%EXTENSION_ID%/"
echo     ]
echo }
) > "d:\password strength\native-host\com.password_manager.host.json"
echo OK: Manifest updated
echo.

REM Step 6: Register with Chrome
echo [6/6] Registering native messaging host...
reg add "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.password_manager.host" /ve /t REG_SZ /d "d:\password strength\native-host\com.password_manager.host.json" /f >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo OK: Registry updated
) else (
    echo WARNING: Registry update failed (may need admin rights)
)
echo.

REM Step 7: Create vault folder
echo [7/7] Creating vault folder...
if not exist "d:\password strength\vault" (
    mkdir "d:\password strength\vault"
)
if not exist "d:\password strength\vault\passwords.txt" (
    (
    echo PASSWORD VAULT - ALL SAVED PASSWORDS
    echo ============================================================
    echo.
    ) > "d:\password strength\vault\passwords.txt"
)
echo OK: Vault ready
echo.

echo ========================================
echo SETUP COMPLETE!
echo ========================================
echo.
echo Configuration Summary:
echo - Python: %PYTHON_PATH%
echo - Extension ID: %EXTENSION_ID%
echo - Vault: d:\password strength\vault\passwords.txt
echo.
echo Next steps:
echo 1. RESTART Chrome completely (close all windows)
echo 2. Go to chrome://extensions/ and verify extension is loaded
echo 3. Test on any login page
echo.
echo The extension should now work on this system!
echo.
pause
