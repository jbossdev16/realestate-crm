# RealEstate CRM — Monorepo

A vertical CRM for real-estate agencies with integrated AI (chat + voice), document analysis, property recommendations, and automation.

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** (package manager - project uses npm, not pnpm)
- **Docker Desktop** with WSL2 backend
- **Git** configured with your identity

### Initial Setup (COMPLETED ✅)
```bash
# 1. Install all dependencies
npm install

# 2. Start infrastructure services
npm run dx:up

# 3. Set up database (run from packages/db directory)
cd packages/db
npm install
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/realcrm"
npm run db:generate
npm run db:push
npm run db:seed
cd ../..

# 4. Start development servers (when apps are built)
npm run dev
```

### Current Status
✅ **All infrastructure services are running:**
- PostgreSQL (port 5432) - Database with demo data
- Redis (port 6379) - Cache and sessions  
- Qdrant (port 6333) - Vector database for AI
- MinIO (port 9000/9001) - File storage

✅ **Database is set up with:**
- 1 Demo agency: "Demo Real Estate Agency"
- 1 Admin user: admin@demo.local
- 3 Demo leads for testing

## 🏗️ Project Structure

```
realestate-crm/
├── apps/                    # Applications
│   ├── api/                # NestJS Backend API
│   ├── web/                # Next.js Frontend
│   ├── workers/            # Background job workers
│   └── docs/               # Documentation site
├── packages/               # Shared packages
│   ├── ai/                 # AI/ML functionality
│   ├── config/             # Environment configuration
│   ├── db/                 # Database (Prisma)
│   ├── telemetry/          # Monitoring & analytics
│   ├── types/              # TypeScript type definitions
│   ├── ui/                 # Shared UI components
│   └── utils/              # Utility functions
└── infra/                  # Infrastructure
    └── docker/             # Docker configurations
```

## 🐳 Infrastructure Services

### Docker Services (Development) - CURRENTLY RUNNING ✅
- **PostgreSQL** (port 5432) - Main database
  - Database: `realcrm`
  - User: `postgres`
  - Password: `postgres`
  - Status: ✅ Healthy and seeded with demo data
- **Redis** (port 6379) - Caching & sessions
  - Status: ✅ Healthy and responding
- **Qdrant** (port 6333) - Vector database for AI
  - Dashboard: http://localhost:6333/dashboard
  - Status: ✅ Running
- **MinIO** (port 9000/9001) - S3-compatible file storage
  - Console: http://localhost:9001
  - Access: `minio` / `minio123`
  - Status: ✅ Running

### Service Management
```bash
# Start all services
npm run dx:up

# Stop all services
npm run dx:down

# View service logs
docker-compose -f infra/docker/docker-compose.dev.yml logs -f

# Check service health
docker ps

# Test database connection
docker exec realcrm-postgres psql -U postgres -d realcrm -c "SELECT COUNT(*) FROM agencies;"

# Test Redis connection
docker exec realcrm-redis redis-cli ping
```

### Production Docker Setup
Complete production deployment files have been created in `infra/docker/`:

- **`docker-compose.prod.yml`** - Production Docker Compose configuration
- **`env.prod.example`** - Environment variables template
- **`nginx.conf`** - Nginx reverse proxy with SSL
- **`setup.sh`** / **`setup.bat`** - Automated setup scripts
- **`README.md`** - Complete deployment documentation

**Dockerfiles created for:**
- `apps/api/Dockerfile` - NestJS API production build
- `apps/web/Dockerfile` - Next.js web app production build  
- `apps/workers/Dockerfile` - Background workers production build

## 🗄️ Database

### Schema Overview - SET UP ✅
- **Agency** - Real estate agencies (1 demo agency created)
- **User** - Agency users (owners, admins, agents, viewers) (1 admin user created)
- **Lead** - Potential clients with status tracking (3 demo leads created)

### Database Commands
```bash
# Navigate to db package
cd packages/db

# Set environment variable
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/realcrm"

# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Create and run migrations
npm run db:migrate

# Seed with demo data
npm run db:seed
```

### Database Connection - ACTIVE ✅
- **Host**: localhost:5432
- **Database**: realcrm
- **Username**: postgres
- **Password**: postgres
- **Status**: ✅ Connected and operational
- **Demo Data**: ✅ 1 agency, 1 user, 3 leads loaded

### Current Database Contents
```sql
-- Check agencies
SELECT * FROM agencies;
-- Result: 1 agency - "Demo Real Estate Agency"

-- Check users  
SELECT * FROM users;
-- Result: 1 user - admin@demo.local

-- Check leads
SELECT * FROM leads;
-- Result: 3 demo leads with different statuses
```

## 🔧 Development Commands

### Package Management
```bash
# Install dependencies (COMPLETED ✅)
npm install

# Add package to specific workspace
npm install <package> --workspace=packages/<workspace>

# Run command in specific workspace
npm run <command> --workspace=packages/<workspace>
```

### Build & Development
```bash
# Start all development servers (when apps are built)
npm run dev

# Build all packages
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint

# Clean build artifacts
npm run clean
```

### Infrastructure Management
```bash
# Start Docker services (COMPLETED ✅)
npm run dx:up

# Stop Docker services
npm run dx:down

# View service logs
docker-compose -f infra/docker/docker-compose.dev.yml logs -f

# Check service status
docker ps
```

### Database Management
```bash
# Navigate to db package
cd packages/db

# Set environment variable
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/realcrm"

# Generate Prisma client (COMPLETED ✅)
npm run db:generate

# Push schema to database (COMPLETED ✅)
npm run db:push

# Seed with demo data (COMPLETED ✅)
npm run db:seed

# Create and run migrations
npm run db:migrate
```

## 🌐 Environment Configuration

### Required Environment Variables
Copy `env.example` to `.env` and configure:

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/realcrm

# Authentication (Clerk)
CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_secret_here

# AI Services
OPENAI_API_KEY=your_openai_key

# Communication
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
RESEND_API_KEY=your_resend_key

# Payments
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

## 📋 Development Workflow

### Git Configuration
```bash
# Set up your identity (already done)
git config --global user.email "jboss.dev16@gmail.com"
git config --global user.name "jbossdev16"
```

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature development
- `hotfix/*` - Critical fixes

### Commit Convention
```
type(scope): description

feat(api): add lead creation endpoint
fix(web): resolve dashboard loading issue
docs(readme): update setup instructions
```

## 🎯 Project Goals & Features

### Core CRM Features
- [ ] Lead management and tracking
- [ ] User role management (Owner, Admin, Agent, Viewer)
- [ ] Agency multi-tenancy
- [ ] Contact management
- [ ] Property listings
- [ ] Deal pipeline tracking

### AI-Powered Features
- [ ] Property recommendations
- [ ] Document analysis (contracts, listings)
- [ ] Chat assistant for agents
- [ ] Voice interactions
- [ ] Lead scoring and qualification

### Technical Features
- [ ] Real-time notifications
- [ ] File upload and management
- [ ] Email/SMS automation
- [ ] Payment processing
- [ ] Analytics and reporting

## 🛠️ Technology Stack

### Backend
- **NestJS** - API framework
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions
- **Bull** - Job queues

### Frontend
- **Next.js** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - Component library
- **React Query** - Data fetching

### AI & ML
- **OpenAI API** - Language models
- **Qdrant** - Vector database
- **LangChain** - AI orchestration

### Infrastructure
- **Docker** - Containerization
- **pnpm** - Package management
- **Turbo** - Build system
- **GitHub Actions** - CI/CD

## 📚 Rules & Guidelines

- [Project Rules](.cursor/rules/project.mdc) - Core project constraints and principles
- [Backend Rules](.cursor/rules/backend.mdc) - NestJS, Prisma, and API guidelines
- [Frontend Rules](.cursor/rules/frontend.mdc) - Next.js, React, and UI guidelines

## 🆘 Troubleshooting

### Common Issues

**Docker not starting:**
```bash
# Ensure Docker Desktop is running
# Check WSL2 backend is enabled
# Restart Docker Desktop if needed
```

**Database connection issues:**
```bash
# Check if PostgreSQL container is running
docker ps | grep postgres

# View database logs
docker logs realcrm-postgres
```

**Package installation issues:**
```bash
# Clear pnpm cache
pnpm store prune

# Reinstall dependencies
rm -rf node_modules
pnpm install
```

**Port conflicts:**
- PostgreSQL: 5432
- Redis: 6379
- Qdrant: 6333
- MinIO: 9000, 9001

## ✅ What's Been Completed

### Infrastructure Setup (100% Complete)
- ✅ **Docker Services**: All 4 services running and healthy
- ✅ **Database**: PostgreSQL with schema and demo data
- ✅ **Cache**: Redis operational
- ✅ **Vector DB**: Qdrant ready for AI features
- ✅ **File Storage**: MinIO configured
- ✅ **Environment**: All configurations set up

### Production Ready Files Created
- ✅ **Docker Compose**: Production configuration
- ✅ **Dockerfiles**: For API, Web, and Workers
- ✅ **Nginx Config**: Reverse proxy with SSL
- ✅ **Setup Scripts**: Automated deployment
- ✅ **Documentation**: Complete deployment guide

### Development Environment
- ✅ **Dependencies**: All packages installed
- ✅ **Database Schema**: Prisma models created
- ✅ **Demo Data**: Agency, user, and leads seeded
- ✅ **Git Configuration**: Identity set up

## 🚧 Next Steps - What to Build

### Priority 1: Core Applications
1. **API Development** (`apps/api/`)
   - NestJS backend with authentication
   - CRUD operations for leads, users, agencies
   - API documentation with Swagger

2. **Web Application** (`apps/web/`)
   - Next.js frontend with dashboard
   - Lead management interface
   - User authentication and roles

3. **Background Workers** (`apps/workers/`)
   - Email/SMS automation
   - File processing
   - Scheduled tasks

### Priority 2: AI Features
4. **AI Package** (`packages/ai/`)
   - Property recommendations
   - Document analysis
   - Chat assistant integration

### Priority 3: Production Deployment
5. **Server Deployment**
   - Use production Docker files
   - Set up SSL certificates
   - Configure domain and DNS

## 📞 Support

- **Developer**: jbossdev16 (jboss.dev16@gmail.com)
- **Repository**: [GitHub Repository URL]
- **Documentation**: [Docs URL]

---

**Last Updated**: September 2024
**Version**: 0.0.0
**Status**: Infrastructure Complete ✅ | Ready for Application Development 🚀
