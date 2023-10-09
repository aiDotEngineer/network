import { PrismaClient } from '@prisma/client';

function createPrisma() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
}

const cached: { prisma?: PrismaClient } = {};

export function getPrisma() {
  return cached.prisma ?? (cached.prisma = createPrisma());
}
