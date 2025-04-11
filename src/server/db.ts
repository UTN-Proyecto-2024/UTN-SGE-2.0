import { PrismaClient } from "@/generated/prisma";

import { env } from "@/env";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db: PrismaClient =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
