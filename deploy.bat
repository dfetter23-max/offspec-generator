@echo off
cd /d "%~dp0"
echo Deploying to Firebase...
firebase deploy --only hosting --project ec-receiving
echo.
pause
