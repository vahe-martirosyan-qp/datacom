import { cookies } from "next/headers";
import { COOKIE_ACCESS } from "@/lib/cookieNames";
import { verifyAccessToken } from "@/lib/server/jwt";

export async function assertAdminSession(): Promise<void> {
  const token = cookies().get(COOKIE_ACCESS)?.value;
  if (!token) {
    throw new Error("UNAUTHORIZED");
  }
  await verifyAccessToken(token);
}
