@echo off
cd /d "%~dp0"
echo Getting the latest changes from GitHub...
git pull --ff-only
if errorlevel 1 (
  echo.
  echo Could not update from GitHub, so nothing was deployed.
  echo Deploying now could overwrite newer changes made from work.
  echo.
  pause
  exit /b 1
)
echo.
echo Deploying to Firebase...
firebase deploy --only hosting --project ec-receiving
echo.
pause
