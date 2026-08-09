@echo off
setlocal enabledelayedexpansion

REM Backend start script (Windows cmd/PowerShell).
REM Usage: from repository root run: cd backend && start_backend.bat

cd /d "%~dp0"

REM Skip virtual env and use system Python
echo [INFO] Using system Python.cd 


python -m uvicorn app:socket_app --reload --host 0.0.0.0 --port 8000



