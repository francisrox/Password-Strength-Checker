@echo off
echo ========================================
echo Password Manager - Native Host Setup
echo ========================================
echo.

REM Get the extension ID from user
set /p EXTENSION_ID="Enter your Chrome Extension ID (from chrome://extensions): "

if "%EXTENSION_ID%"=="" (
    echo ERROR: Extension ID cannot be empty!
    pause
    exit /b 1
)

echo.
echo Updating manifest with Extension ID: %EXTENSION_ID%
echo.

REM Update the manifest file with the actual extension ID
powershell -Command "(Get-Content 'com.password_manager.host.json') -replace 'EXTENSION_ID_PLACEHOLDER', '%EXTENSION_ID%' | Set-Content 'com.password_manager.host.json'"

echo Manifest updated successfully!
echo.

REM Get the full path to the manifest
set MANIFEST_PATH=%~dp0com.password_manager.host.json

echo Registering native messaging host...
echo Manifest path: %MANIFEST_PATH%
echo.

REM Add registry key for Chrome
reg add "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.password_manager.host" /ve /t REG_SZ /d "%MANIFEST_PATH%" /f

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Native host registered.
    echo ========================================
    echo.
    echo The extension can now save passwords to:
    echo d:\password strength\vault\
    echo.
    echo Next steps:
    echo 1. Restart Chrome
    echo 2. Test the extension on any login page
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Failed to register native host
    echo ========================================
    echo.
    echo Please run this script as Administrator
    echo.
)

pause
