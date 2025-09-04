@echo off
setlocal enabledelayedexpansion

REM Real Estate CRM Docker Setup Script for Windows
REM This script sets up the complete Docker environment for production

echo 🚀 Setting up Real Estate CRM Docker Environment...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running. Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [INFO] Docker is running ✓

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose and try again.
    pause
    exit /b 1
)

echo [INFO] Docker Compose is available ✓

REM Create environment file if it doesn't exist
if not exist .env (
    echo [WARNING] Environment file not found. Creating from example...
    copy env.prod.example .env
    echo [WARNING] Please edit .env file with your secure passwords before continuing!
    echo [WARNING] Press Enter when you're done editing the .env file...
    pause
)

echo [INFO] Environment file ready ✓

REM Create SSL directory
if not exist ssl mkdir ssl

REM Create backups directory
if not exist backups mkdir backups

echo [INFO] Directories created ✓

REM Pull latest images
echo [INFO] Pulling latest Docker images...
docker-compose -f docker-compose.prod.yml pull

echo [INFO] Images pulled ✓

REM Start services
echo [INFO] Starting Docker services...
docker-compose -f docker-compose.prod.yml up -d

echo [INFO] Services started ✓

REM Wait for services to be healthy
echo [INFO] Waiting for services to be healthy...
timeout /t 30 /nobreak >nul

REM Check service health
echo [INFO] Checking service health...

REM Check PostgreSQL
docker-compose -f docker-compose.prod.yml exec -T postgres pg_isready -U postgres >nul 2>&1
if errorlevel 1 (
    echo [ERROR] PostgreSQL is not healthy
) else (
    echo [INFO] PostgreSQL is healthy ✓
)

REM Check Redis
docker-compose -f docker-compose.prod.yml exec -T redis redis-cli ping >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Redis is not healthy
) else (
    echo [INFO] Redis is healthy ✓
)

REM Check Qdrant
curl -s http://localhost:6333/health >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Qdrant is not healthy
) else (
    echo [INFO] Qdrant is healthy ✓
)

REM Check MinIO
curl -s http://localhost:9000/minio/health/live >nul 2>&1
if errorlevel 1 (
    echo [ERROR] MinIO is not healthy
) else (
    echo [INFO] MinIO is healthy ✓
)

REM Show service status
echo [INFO] Service Status:
docker-compose -f docker-compose.prod.yml ps

echo.
echo [INFO] 🎉 Setup Complete!
echo.
echo [INFO] Your services are running on:
echo   📊 PostgreSQL: localhost:5432
echo   🔄 Redis: localhost:6379
echo   🧠 Qdrant: localhost:6333
echo   📁 MinIO: localhost:9000 (Console: localhost:9001)
echo.
echo [INFO] Next steps:
echo   1. Set up SSL certificates in ./ssl/ directory
echo   2. Configure your domain in nginx.conf
echo   3. Update .env file with your domain
echo   4. Run: docker-compose -f docker-compose.prod.yml restart nginx
echo.
echo [INFO] To view logs: docker-compose -f docker-compose.prod.yml logs -f
echo [INFO] To stop services: docker-compose -f docker-compose.prod.yml down

pause
