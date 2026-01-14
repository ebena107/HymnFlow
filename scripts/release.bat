@echo off
REM HymnFlow Release Script for Windows
REM Creates a release package and git tag

setlocal enabledelayedexpansion

REM Get version from package.json
for /f "tokens=2 delims=: " %%a in ('findstr "version" package.json ^| findstr /v "devDependencies"') do (
    set VERSION=%%a
    set VERSION=!VERSION:"=!
    set VERSION=!VERSION:,=!
    goto :found_version
)
:found_version

if "!VERSION!"=="" (
    echo Error: Could not read version from package.json
    exit /b 1
)

echo Releasing HymnFlow v!VERSION!...

REM Create release directory
set RELEASE_DIR=hymnflow-v!VERSION!
if exist "!RELEASE_DIR!" rmdir /s /q "!RELEASE_DIR!"
mkdir "!RELEASE_DIR!"

REM Consolidate translations
echo Consolidating translations...
python scripts\combine_translations.py

REM Copy files
echo Packaging files...
xcopy public\obs-dock "!RELEASE_DIR!\obs-dock\" /E /Y > nul
xcopy public\obs-overlay "!RELEASE_DIR!\obs-overlay\" /E /Y > nul
xcopy public\data "!RELEASE_DIR!\data\" /E /Y > nul
xcopy public\parsers "!RELEASE_DIR!\parsers\" /E /Y > nul
xcopy public\i18n "!RELEASE_DIR!\i18n\" /E /Y > nul
copy public\obs-setup.html "!RELEASE_DIR!\" > nul
copy public\validation.js "!RELEASE_DIR!\" > nul
copy README.md "!RELEASE_DIR!\" > nul
copy doc\SETUP.md "!RELEASE_DIR!\" > nul
copy doc\TROUBLESHOOTING.md "!RELEASE_DIR!\" > nul
copy doc\SECURITY.md "!RELEASE_DIR!\" > nul

REM Create ZIP (requires 7-Zip or built-in compression)
set ZIP_FILE=hymnflow-v!VERSION!-plugin.zip
echo Creating ZIP: !ZIP_FILE!...

REM Using PowerShell for compression (Windows 10+)
powershell -Command "Compress-Archive -Path '!RELEASE_DIR!' -DestinationPath '!ZIP_FILE!' -Force"

echo.
echo Release created successfully!
echo.
echo Summary:
echo    Version: v!VERSION!
echo    Package: !ZIP_FILE!
echo    Git Tag: v!VERSION!
echo.
echo Next steps:
echo    1. Review the ZIP file contents
echo    2. Create GitHub release with the ZIP file
echo    3. Announce release
