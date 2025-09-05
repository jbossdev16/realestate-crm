# Docker Setup for Real Estate CRM

This directory contains all the necessary files to run your Real Estate CRM in both development and production environments using Docker.

## 🚀 Quick Start - Development

### Prerequisites
- Docker Desktop installed and running
- Docker Compose installed

### Start Development Environment

**For Windows:**
```bash
# Navigate to docker directory
cd infra/docker

# Run setup (first time only)
setup-dev.bat

# Start development environment
start-dev.bat
```

**For Linux/macOS:**
```bash
# Navigate to docker directory
cd infra/docker

# Make scripts executable
chmod +x setup-dev.sh start-dev.sh

# Run setup (first time only)
./setup-dev.sh

# Start development environment
./start-dev.sh
```

### Access Your Enhanced Dashboard
- **Web App**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **Qdrant**: http://localhost:6333
- **MinIO Console**: http://localhost:9001

---

## 🏭 Production Setup

This directory contains all the necessary files to deploy your Real Estate CRM to a production server using Docker.

## 📁 Files Overview

- `docker-compose.prod.yml` - Production Docker Compose configuration
- `env.prod.example` - Environment variables template
- `nginx.conf` - Nginx reverse proxy configuration
- `setup.sh` - Linux/macOS setup script
- `setup.bat` - Windows setup script
- `init.sql` - PostgreSQL initialization script

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Docker Compose installed
- Domain name configured (optional for local testing)

### Setup Steps

#### Option 1: Automated Setup (Recommended)

**For Windows:**
```bash
# Navigate to docker directory
cd infra/docker

# Run setup script
setup.bat
```

**For Linux/macOS:**
```bash
# Navigate to docker directory
cd infra/docker

# Make script executable
chmod +x setup.sh

# Run setup script
./setup.sh
```

#### Option 2: Manual Setup

1. **Configure Environment:**
   ```bash
   # Copy environment template
   cp env.prod.example .env
   
   # Edit with your secure passwords
   nano .env
   ```

2. **Start Services:**
   ```bash
   # Start all services
   docker-compose -f docker-compose.prod.yml up -d
   
   # Check status
   docker-compose -f docker-compose.prod.yml ps
   ```

## 🔧 Configuration

### Environment Variables

Edit the `.env` file with your secure passwords:

```bash
# Database
POSTGRES_PASSWORD=your_secure_postgres_password
REDIS_PASSWORD=your_secure_redis_password

# MinIO
MINIO_ROOT_USER=your_minio_username
MINIO_ROOT_PASSWORD=your_secure_minio_password

# Qdrant
QDRANT_API_KEY=your_qdrant_api_key

# Application
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

### SSL Certificates

1. **Get SSL certificates** (Let's Encrypt recommended):
   ```bash
   # Install Certbot
   sudo apt install certbot
   
   # Get certificate
   sudo certbot certonly --standalone -d yourdomain.com
   ```

2. **Copy certificates to Docker volume:**
   ```bash
   # Create SSL directory
   mkdir -p ssl
   
   # Copy certificates
   sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/cert.pem
   sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/key.pem
   ```

3. **Update nginx.conf** with your domain name

## 📊 Service Ports

| Service | Port | Description |
|---------|------|-------------|
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache & Sessions |
| Qdrant | 6333 | Vector Database |
| MinIO | 9000 | File Storage |
| MinIO Console | 9001 | File Storage UI |
| Nginx | 80/443 | Web Server |

## 🔍 Monitoring & Maintenance

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f postgres
```

### Backup Database
```bash
# Create backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres realcrm > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres realcrm < backup.sql
```

### Update Services
```bash
# Pull latest images
docker-compose -f docker-compose.prod.yml pull

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build
```

### Health Checks
```bash
# Check all services
docker-compose -f docker-compose.prod.yml ps

# Test individual services
curl http://localhost:6333/health  # Qdrant
curl http://localhost:9000/minio/health/live  # MinIO
```

## 🛠️ Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Check what's using the port
netstat -tulpn | grep :5432

# Change port in .env file
POSTGRES_PORT=5433
```

**Permission issues:**
```bash
# Fix SSL certificate permissions
sudo chown -R $USER:$USER ssl/
chmod 600 ssl/*.pem
```

**Service won't start:**
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs service_name

# Restart specific service
docker-compose -f docker-compose.prod.yml restart service_name
```

**Out of disk space:**
```bash
# Clean up unused images
docker system prune -a

# Clean up volumes (WARNING: deletes data)
docker-compose -f docker-compose.prod.yml down -v
```

### Reset Everything
```bash
# Stop and remove all containers and volumes
docker-compose -f docker-compose.prod.yml down -v

# Remove all images
docker system prune -a

# Start fresh
./setup.sh
```

## 🔒 Security Checklist

- [ ] Changed all default passwords
- [ ] Set up SSL certificates
- [ ] Configured firewall (ports 80, 443, 22 only)
- [ ] Set up automated backups
- [ ] Configured log rotation
- [ ] Set up monitoring alerts
- [ ] Updated all Docker images to latest versions
- [ ] Configured rate limiting in Nginx
- [ ] Set up fail2ban for SSH protection

## 📞 Support

If you encounter issues:

1. Check the logs: `docker-compose -f docker-compose.prod.yml logs -f`
2. Verify environment variables in `.env`
3. Check service health: `docker-compose -f docker-compose.prod.yml ps`
4. Review this documentation
5. Contact: jbossdev16 (jboss.dev16@gmail.com)

---

**Last Updated**: September 2024
