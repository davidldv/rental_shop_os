import type { PrismaConfig } from "prisma";

export default {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: 'bun prisma/seed.ts',
  },
  datasource: { 
    // Uses the Direct URL (Session mode) for migrations and CLI operations
    url: process.env.DIRECT_URL!
  }
} satisfies PrismaConfig;

// bunx --bun prisma db push