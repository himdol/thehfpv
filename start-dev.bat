@echo off
REM TheHFPV Full Stack Development Server Startup Script for Windows

echo 🚀 Starting TheHFPV Full Stack Development Environment...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if Java is installed
java -version >nul 2>&1
if errorlevel 1 (
    echo ❌ Java is not installed. Please install Java 17 first.
    pause
    exit /b 1
)

echo 📦 Checking dependencies...

REM Install frontend dependencies
if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
)

REM Install backend dependencies
if not exist "backend\.gradle" (
    echo Installing backend dependencies...
    cd backend
    gradlew.bat build --no-daemon
    cd ..
)

echo.
echo 🔧 Starting backend server...
cd backend
start "Backend Server" cmd /k "gradlew.bat bootRun"
cd ..

REM Wait a moment for backend to start
timeout /t 5 /nobreak >nul

echo 🎨 Starting frontend server...
start "Frontend Server" cmd /k "npm start"

echo.
echo ✅ Full stack development environment is running!
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:8080
echo 📚 API Docs: http://localhost:8080/api/test/hello
echo.
echo Press any key to exit...
pause >nul
