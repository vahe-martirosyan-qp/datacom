/**
 * Loads .env, applies Prisma schema, then copies the in-memory CMS snapshot
 * (seeds + data/content-store.json + data/languages.json when present) into PostgreSQL.
 *
 * Usage: pnpm db:import
 */
import { execSync } from "node:child_process";
import { resolve } from "node:path";
import { config } from "dotenv";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

if (!process.env.DATABASE_URL?.trim()) {
  console.error(
    "Missing DATABASE_URL. Add it to .env (see .env.example). With Docker: docker compose up -d, then use the postgres URL shown there."
  );
  process.exit(1);
}

async function main(): Promise<void> {
  console.log("Applying Prisma schema (db push)…");
  execSync("pnpm exec prisma db push", {
    stdio: "inherit",
    cwd: process.cwd(),
    env: process.env as NodeJS.ProcessEnv,
  });

  const { pushLocalStoreToDatabase } = await import(
    "../src/lib/server/contentStore"
  );

  console.log("Importing CMS snapshot (seeds + data/*.json merge)…");
  const { languageCount, entryCount } = await pushLocalStoreToDatabase({
    replace: true,
  });

  console.log(
    `Done. ${languageCount} languages, ${entryCount} content rows in PostgreSQL.`
  );

  const { prisma } = await import("../src/lib/server/prisma");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
