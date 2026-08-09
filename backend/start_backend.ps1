# Backend start script (PowerShell)
# Usage: from repository root run: cd backend; .\start_backend.ps1

$ErrorActionPreference = 'Stop'

Set-Location $PSScriptRoot

# Skip virtual env and use system Python
Write-Host '[INFO] Using system Python.'


python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000

