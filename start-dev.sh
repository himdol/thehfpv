#!/bin/bash

# TheHFPV Full Stack Development Server Startup Script

echo "🚀 Starting TheHFPV Full Stack Development Environment..."
echo ""

# Function to kill processes on specific ports
kill_port() {
    local port=$1
    local pids=""
    
    # Try lsof first (Linux/Mac)
    if command -v lsof &> /dev/null; then
        pids=$(lsof -ti:$port 2>/dev/null)
    # Fallback to netstat (if lsof is not available)
    elif command -v netstat &> /dev/null; then
        pids=$(netstat -tlnp 2>/dev/null | grep ":$port " | awk '{print $7}' | cut -d'/' -f1 | sort -u)
    fi
    
    if [ ! -z "$pids" ]; then
        echo "🛑 Killing processes on port $port: $pids"
        echo $pids | xargs kill -9 2>/dev/null
        sleep 2
    else
        echo "✅ Port $port is available"
    fi
}

# Kill existing processes on ports 3000 and 8080
echo "🧹 Cleaning up existing processes..."
kill_port 3000
kill_port 8080
kill_port 8081
kill_port 8082
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17 first."
    exit 1
fi

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Install dependencies if needed
echo "📦 Checking dependencies..."

# Install frontend dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Install backend dependencies
if [ ! -d "backend/.gradle" ]; then
    echo "Installing backend dependencies..."
    cd backend
    ./gradlew build --no-daemon
    cd ..
fi

echo ""
echo "🔧 Starting backend server..."
cd backend
# Google OAuth 환경 변수 설정 (사용 시 실제 값으로 교체하거나 시스템 환경변수에서 읽어오세요)
# export GOOGLE_CLIENT_ID="your-google-client-id"
# export GOOGLE_CLIENT_SECRET="your-google-client-secret"
./gradlew bootRun &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 5

echo "🎨 Starting frontend server..."
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Full stack development environment is running!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8080"
echo "📚 API Docs: http://localhost:8080/api/test/hello"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user to stop
wait
