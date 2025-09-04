#!/bin/bash

# Real Estate CRM Docker Setup Script
# This script sets up the complete Docker environment for production

set -e

echo "🚀 Setting up Real Estate CRM Docker Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

print_status "Docker is running ✓"

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

print_status "Docker Compose is available ✓"

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    print_warning "Environment file not found. Creating from example..."
    cp env.prod.example .env
    print_warning "Please edit .env file with your secure passwords before continuing!"
    print_warning "Press Enter when you're done editing the .env file..."
    read
fi

print_status "Environment file ready ✓"

# Create SSL directory
mkdir -p ssl

# Create backups directory
mkdir -p backups

print_status "Directories created ✓"

# Pull latest images
print_status "Pulling latest Docker images..."
docker-compose -f docker-compose.prod.yml pull

print_status "Images pulled ✓"

# Start services
print_status "Starting Docker services..."
docker-compose -f docker-compose.prod.yml up -d

print_status "Services started ✓"

# Wait for services to be healthy
print_status "Waiting for services to be healthy..."
sleep 30

# Check service health
print_status "Checking service health..."

# Check PostgreSQL
if docker-compose -f docker-compose.prod.yml exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    print_status "PostgreSQL is healthy ✓"
else
    print_error "PostgreSQL is not healthy"
fi

# Check Redis
if docker-compose -f docker-compose.prod.yml exec -T redis redis-cli ping > /dev/null 2>&1; then
    print_status "Redis is healthy ✓"
else
    print_error "Redis is not healthy"
fi

# Check Qdrant
if curl -s http://localhost:6333/health > /dev/null 2>&1; then
    print_status "Qdrant is healthy ✓"
else
    print_error "Qdrant is not healthy"
fi

# Check MinIO
if curl -s http://localhost:9000/minio/health/live > /dev/null 2>&1; then
    print_status "MinIO is healthy ✓"
else
    print_error "MinIO is not healthy"
fi

# Show service status
print_status "Service Status:"
docker-compose -f docker-compose.prod.yml ps

echo ""
print_status "🎉 Setup Complete!"
echo ""
print_status "Your services are running on:"
echo "  📊 PostgreSQL: localhost:5432"
echo "  🔄 Redis: localhost:6379"
echo "  🧠 Qdrant: localhost:6333"
echo "  📁 MinIO: localhost:9000 (Console: localhost:9001)"
echo ""
print_status "Next steps:"
echo "  1. Set up SSL certificates in ./ssl/ directory"
echo "  2. Configure your domain in nginx.conf"
echo "  3. Update .env file with your domain"
echo "  4. Run: docker-compose -f docker-compose.prod.yml restart nginx"
echo ""
print_status "To view logs: docker-compose -f docker-compose.prod.yml logs -f"
print_status "To stop services: docker-compose -f docker-compose.prod.yml down"
