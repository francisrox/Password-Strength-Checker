@echo off
echo ========================================
echo Password Manager Extension - Full Check
echo ========================================
echo.

echo [1/6] Checking Python...
C:\Python314\python.exe --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python not found!
    pause
    exit /b 1
)
echo OK: Python found
echo.

echo [2/6] Checking vault folder...
if exist "d:\password strength\vault" (
    echo OK: Vault folder exists
) else (
    echo Creating vault folder...
    mkdir "d:\password strength\vault"
)
echo.

echo [3/6] Checking passwords.txt...
if exist "d:\password strength\vault\passwords.txt" (
    echo OK: passwords.txt exists
) else (
    echo Creating passwords.txt...
    echo PASSWORD VAULT - ALL SAVED PASSWORDS > "d:\password strength\vault\passwords.txt"
    echo ============================================================ >> "d:\password strength\vault\passwords.txt"
    echo. >> "d:\password strength\vault\passwords.txt"
)
echo.

echo [4/6] Checking registry entry...
reg query "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.password_manager.host" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo OK: Registry entry exists
) else (
    echo ERROR: Registry entry missing!
    echo Run: cd "d:\password strength\native-host" then register.bat
    pause
    exit /b 1
)
echo.

echo [5/6] Checking extension files...
if exist "d:\password strength\password-checker-extension\manifest.json" (
    echo OK: manifest.json exists
) else (
    echo ERROR: manifest.json missing!
    pause
    exit /b 1
)

if exist "d:\password strength\password-checker-extension\background.js" (
    echo OK: background.js exists
) else (
    echo ERROR: background.js missing!
    pause
    exit /b 1
)

if exist "d:\password strength\password-checker-extension\contentScript.js" (
    echo OK: contentScript.js exists
) else (
    echo ERROR: contentScript.js missing!
    pause
    exit /b 1
)
echo.

echo [6/6] Testing Python host...
echo Testing if Python can save files...
C:\Python314\python.exe "d:\password strength\test_vault.py"
if %ERRORLEVEL% EQU 0 (
    echo OK: Python host works
) else (
    echo ERROR: Python host failed!
    pause
    exit /b 1
)
echo.

echo ========================================
echo ALL CHECKS PASSED!
echo ========================================
echo.
echo Next steps:
echo 1. Open Chrome: chrome://extensions/
echo 2. Find "Password Security Manager"
echo 3. Click RELOAD button
echo 4. Open test page: file:///d:/password strength/test-login.html
echo 5. Type a password - you should see purple popup
echo 6. Submit form - password should save
echo.
echo If purple popup doesn't appear:
echo - Check extension is ENABLED (toggle is blue)
echo - Click "Errors" button if it appears
echo - Refresh the test page
echo.
pause
