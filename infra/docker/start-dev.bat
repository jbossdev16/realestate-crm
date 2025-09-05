@echo off
echo Starting Real Estate CRM Development Environment...
echo.

echo Building and starting services...
docker-compose -f docker-compose.dev.yml up --build

echo.
echo Development environment started!
echo Web app: http://localhost:3000
echo PostgreSQL: localhost:5432
echo Redis: localhost:6379
echo Qdrant: http://localhost:6333
echo MinIO: http://localhost:9001
echo.
echo Press Ctrl+C to stop all services
pause
