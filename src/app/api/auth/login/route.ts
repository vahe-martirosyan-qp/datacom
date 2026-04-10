import { NextResponse } from "next/server";
import {
  ACCESS_MAX_AGE_SEC,
  REFRESH_MAX_AGE_SEC,
  signAccessToken,
  signRefreshToken,
} from "@/lib/server/jwt";
import { getAdminLogin, getAdminPassword } from "@/lib/server/env";
import { COOKIE_ACCESS, COOKIE_REFRESH } from "@/lib/cookieNames";
import type { LoginRequest } from "@/types";

export async function POST(request: Request) {
  let body: LoginRequest;
  try {
    body = (await request.json()) as LoginRequest;
  } catch {
    return NextResponse.json(
      { error: "Некорректное тело запроса" },
      { status: 400 }
    );
  }

  const login = typeof body.login === "string" ? body.login.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (login !== getAdminLogin() || password !== getAdminPassword()) {
    return NextResponse.json(
      { error: "Неверный логин или пароль" },
      { status: 401 }
    );
  }

  const subject = "admin";
  const access = await signAccessToken(subject);
  const refresh = await signRefreshToken(subject);

  const res = NextResponse.json({ ok: true } satisfies { ok: boolean });
  const secure = process.env.NODE_ENV === "production";
  res.cookies.set(COOKIE_ACCESS, access, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_MAX_AGE_SEC,
    secure,
  });
  res.cookies.set(COOKIE_REFRESH, refresh, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_MAX_AGE_SEC,
    secure,
  });
  return res;
}
