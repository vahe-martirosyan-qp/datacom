import { SignJWT, jwtVerify } from "jose";
import {
  getJwtRefreshSecretBytes,
  getJwtSecretBytes,
} from "@/lib/server/env";

const ACCESS_MAX_AGE_SEC = 60 * 15;
const REFRESH_MAX_AGE_SEC = 60 * 60 * 24 * 7;

export async function signAccessToken(subject: string): Promise<string> {
  return new SignJWT({ typ: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(subject)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_MAX_AGE_SEC}s`)
    .sign(getJwtSecretBytes());
}

export async function signRefreshToken(subject: string): Promise<string> {
  return new SignJWT({ typ: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(subject)
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_MAX_AGE_SEC}s`)
    .sign(getJwtRefreshSecretBytes());
}

export async function verifyAccessToken(token: string): Promise<void> {
  const { payload } = await jwtVerify(token, getJwtSecretBytes());
  if (payload.typ !== "access") {
    throw new Error("Invalid token type");
  }
}

export async function verifyRefreshToken(token: string): Promise<void> {
  const { payload } = await jwtVerify(token, getJwtRefreshSecretBytes());
  if (payload.typ !== "refresh") {
    throw new Error("Invalid token type");
  }
}

export { ACCESS_MAX_AGE_SEC, REFRESH_MAX_AGE_SEC };
