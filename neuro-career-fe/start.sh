#!/bin/bash

# Script to start both the Python API and Next.js frontend

echo "Starting AI Career Assessment Application..."

# Check if Python virtual environment exists
if [ ! -d "api/venv" ]; then
    echo "Setting up Python API environment..."
    cd api
    ./setup.sh
    cd ..
fi

# Start Python API in background
echo "Starting Python API server..."
cd api
source venv/bin/activate
python main.py &
API_PID=$!
cd ..

# Wait a moment for API to start
sleep 3

# Start Next.js frontend
echo "Starting Next.js frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🚀 Application started successfully!"
echo "📡 API Server: http://localhost:8000"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $API_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for processes
wait