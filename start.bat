@echo off
setlocal
cd /d "%~dp0"
set "NODE_EXE=%ProgramFiles%\nodejs\node.exe"
if not exist "%NODE_EXE%" set "NODE_EXE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist "%NODE_EXE%" (
  echo Node.js was not found. Install it from https://nodejs.org/
  pause
  exit /b 1
)
start "" http://localhost:3000
"%NODE_EXE%" "node_modules\next\dist\bin\next" dev --webpack
pause
