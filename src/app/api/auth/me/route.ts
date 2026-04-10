import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_ACCESS } from "@/lib/cookieNames";
import { verifyAccessToken } from "@/lib/server/jwt";
import type { AuthMeResponse } from "@/types";

export async function GET() {
  const token = cookies().get(COOKIE_ACCESS)?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await verifyAccessToken(token);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: AuthMeResponse = {
    user: { id: "admin", login: "admin" },
  };
  return NextResponse.json(body);
}
