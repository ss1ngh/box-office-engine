import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
    log: ['query', 'error'] // Optional: Helpful for debugging
});
