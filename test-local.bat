@echo off
echo ========================================
echo   TRADEBE DASHBOARD - LOCAL TEST
echo   Opening http://localhost:5000
echo   Press Ctrl+C here to stop
echo ========================================
echo.

cd /d "D:\CLAUDE\Tradebe Tools"

start http://localhost:5000
firebase serve --only hosting --project ec-receiving

pause
