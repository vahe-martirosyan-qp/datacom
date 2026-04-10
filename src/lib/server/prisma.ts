import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

/** Reuse one client per serverless instance (Vercel) and in dev to avoid connection churn. */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;
