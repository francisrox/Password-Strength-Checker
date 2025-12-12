@echo off
echo ========================================
echo Debugging Native Messaging Connection
echo ========================================
echo.

echo [1] Checking Python installation...
python --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python not found!
    echo Please install Python from python.org
    pause
    exit /b 1
)
echo OK: Python found
echo.

echo [2] Finding Python executable path...
where python
echo.
echo Copy the path above and update host.bat if needed
echo.

echo [3] Checking host.bat...
type "d:\password strength\native-host\host.bat"
echo.
echo Does the Python path in host.bat match the path above? (Y/N)
pause
echo.

echo [4] Checking registry entry...
reg query "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.password_manager.host"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Registry entry not found!
    echo You need to run register.bat
    pause
    exit /b 1
)
echo.

echo [5] Checking manifest file...
type "d:\password strength\native-host\com.password_manager.host.json"
echo.

echo [6] Testing Python host directly...
echo Testing if Python script works...
echo {"action":"save","data":{"hostname":"test.com","username":"test","password":"test123","url":"https://test.com","timestamp":"2025-12-12T00:00:00.000Z"}} | python "d:\password strength\native-host\host.py"
echo.

echo ========================================
echo Debugging Complete
echo ========================================
echo.
echo Next steps:
echo 1. Check if Python path in host.bat matches 'where python' output
echo 2. Make sure Extension ID in manifest.json is correct
echo 3. Check Chrome service worker console for detailed error
echo.
echo To check service worker console:
echo 1. Go to chrome://extensions/
echo 2. Click "service worker" under your extension
echo 3. Look for error messages
echo.
pause
