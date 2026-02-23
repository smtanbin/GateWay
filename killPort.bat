@echo off
set PORT=3000

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%PORT% ^| findstr LISTENING') do (
    echo Killing PID %%a running on port %PORT% ...
    taskkill /F /PID %%a
)

echo Done.
pause