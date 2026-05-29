@echo off
setlocal

echo ==============================================
echo  AI Integrated Portfolio - Startup Script
echo ==============================================

:: Navigate to backend and setup venv if not exists
cd backend
if not exist venv (
    echo [INFO] Creating Python virtual environment...
    python -m venv venv
)

echo [INFO] Activating virtual environment and installing backend dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt

echo [INFO] Starting FastAPI Backend on port 8000...
start cmd /k "call venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000"

:: Navigate back to root and then to frontend
cd ..
cd frontend

echo [INFO] Installing Frontend dependencies...
call npm install

echo [INFO] Starting Next.js Frontend on port 3000...
start cmd /k "npm run dev"

echo ==============================================
echo  Both servers are starting in separate windows.
echo  Backend: http://localhost:8000
echo  Frontend: http://localhost:3000
echo ==============================================

endlocal
