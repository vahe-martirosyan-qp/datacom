import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";

export const dynamic = "force-dynamic";

/**
 * Quick check that `DATABASE_URL` works on this deployment (e.g. Vercel → Neon).
 * Open: GET /api/health/db
 */
export async function GET() {
  if (!process.env.DATABASE_URL?.trim()) {
    return NextResponse.json(
      {
        ok: false,
        error: "DATABASE_URL is not set for this environment.",
      },
      { status: 503 }
    );
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, database: "reachable" });
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json(
      {
        ok: false,
        database: "unreachable",
        error: message,
      },
      { status: 503 }
    );
  }
}
