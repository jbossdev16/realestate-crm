# @realestate-crm/config

Configuration package for the Real Estate CRM monorepo.

## Purpose

This package provides centralized environment configuration with Zod validation for all environment variables used across the workspace.

## Usage

```typescript
import { loadEnv, type Env } from '@realestate-crm/config';

const env = loadEnv();
console.log(env.DATABASE_URL);
```

## Environment Variables

All environment variables are validated against a Zod schema and include:

- **Database**: `DATABASE_URL`
- **Redis**: `REDIS_URL` 
- **S3/MinIO**: `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`
- **AI**: `OPENAI_API_KEY`, `USE_VLLM`, `VLLM_BASE_URL`
- **Auth**: `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- **External Services**: `TWILIO_*`, `RESEND_API_KEY`, `STRIPE_*`

## Development

```bash
pnpm build    # Build the package
pnpm dev      # Watch mode
pnpm clean    # Clean build artifacts
```
