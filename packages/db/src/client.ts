import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

try {
  prisma = globalThis.__prisma || new PrismaClient();
} catch (error) {
  console.error('❌ Failed to initialize Prisma client. Make sure to run "pnpm db:generate" first.');
  throw error;
}

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export { prisma };
