import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ACCESS_MAX_AGE_SEC,
  signAccessToken,
  verifyRefreshToken,
} from "@/lib/server/jwt";
import { COOKIE_ACCESS, COOKIE_REFRESH } from "@/lib/cookieNames";

export async function POST() {
  const refresh = cookies().get(COOKIE_REFRESH)?.value;
  if (!refresh) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await verifyRefreshToken(refresh);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const access = await signAccessToken("admin");
  const res = NextResponse.json({ ok: true });
  const secure = process.env.NODE_ENV === "production";
  res.cookies.set(COOKIE_ACCESS, access, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_MAX_AGE_SEC,
    secure,
  });
  return res;
}
