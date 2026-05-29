#!/bin/bash

echo "=============================================="
echo " AI Integrated Portfolio - Startup Script (Unix)"
echo "=============================================="

# Setup Backend
cd backend
if [ ! -d "venv" ]; then
    echo "[INFO] Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "[INFO] Activating virtual environment and installing backend dependencies..."
source venv/bin/activate
pip install -r requirements.txt

echo "[INFO] Starting FastAPI Backend on port 8000 in background..."
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# Setup Frontend
cd ../frontend

echo "[INFO] Installing Frontend dependencies..."
npm install

echo "[INFO] Starting Next.js Frontend on port 3000..."
npm run dev &
FRONTEND_PID=$!

echo "=============================================="
echo " Both servers are starting."
echo " Backend PID: $BACKEND_PID"
echo " Frontend PID: $FRONTEND_PID"
echo " Press Ctrl+C to stop both servers."
echo "=============================================="

# Trap ctrl-c and call cleanup
trap cleanup INT

function cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
}

wait
