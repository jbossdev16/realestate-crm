# @realestate-crm/db

Database package for the Real Estate CRM monorepo.

## Purpose

This package provides the Prisma database client, schema, and database utilities for the CRM system.

## Features

- **Prisma Schema**: Agency, User, and Lead models with proper relations
- **Database Client**: Singleton PrismaClient instance
- **Seed Data**: Development seed script with demo data
- **Migrations**: Prisma migration support

## Models

### Agency
- Basic agency information (name, domain)
- Soft delete support
- One-to-many relationships with users and leads

### User
- User authentication and role management
- Agency-scoped users with unique email per agency
- Role-based access control (OWNER, ADMIN, AGENT, VIEWER)

### Lead
- Lead management with status tracking
- Assignment to agents
- Source tracking and notes

## Usage

```typescript
import { prisma } from '@realestate-crm/db';

// Query agencies
const agencies = await prisma.agency.findMany();

// Create a lead
const lead = await prisma.lead.create({
  data: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    agencyId: 'agency-id',
  },
});
```

## Development

```bash
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push schema to database
pnpm db:migrate   # Run migrations
pnpm db:seed      # Seed development data
```

## Database Setup

1. Start the database: `pnpm dx:up`
2. Generate client: `pnpm db:generate`
3. Push schema: `pnpm db:push`
4. Seed data: `pnpm db:seed`
