# RealEstate CRM — Monorepo

A vertical CRM for real-estate agencies with integrated AI (chat + voice), document analysis, property recommendations, and automation.

## Quick Start

```bash
# Install dependencies
npm install

# Start development environment
npm run dx:up

# Run migrations
npm run db:migrate

# Seed demo data
npm run db:seed
```

## Project Structure

- `apps/` - Applications (web, api, workers, docs)
- `packages/` - Shared packages (db, ai, ui, types, config, utils, telemetry)
- `infra/` - Infrastructure configuration

## Rules & Guidelines

- [Project Rules](.cursor/rules/project.mdc) - Core project constraints and principles
- [Backend Rules](.cursor/rules/backend.mdc) - NestJS, Prisma, and API guidelines
- [Frontend Rules](.cursor/rules/frontend.mdc) - Next.js, React, and UI guidelines

## Development

This monorepo uses:
- **npm** for package management
- **Turbo** for build orchestration
- **TypeScript** strict mode everywhere
- **Zod** for runtime validation
- **Prisma** for database access
- **NestJS** for backend API
- **Next.js** for frontend web app
