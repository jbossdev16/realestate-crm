@echo off
echo Setting up Real Estate CRM Development Environment...
echo.

echo Checking Docker installation...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not in PATH
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo Docker is installed ✓
echo.

echo Checking if Docker is running...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running
    echo Please start Docker Desktop and try again
    pause
    exit /b 1
)

echo Docker is running ✓
echo.

echo Cleaning up any existing containers...
docker-compose -f docker-compose.dev.yml down -v

echo.
echo Setup complete! You can now run start-dev.bat to start the development environment
echo.
pause
