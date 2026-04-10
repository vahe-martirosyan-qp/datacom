const DEV_JWT_SECRET =
  "development-only-jwt-secret-min-32-chars-x";
const DEV_JWT_REFRESH =
  "development-only-refresh-secret-min-32-y";

export function getJwtSecretBytes(): Uint8Array {
  const value =
    process.env.JWT_SECRET ??
    (process.env.NODE_ENV === "production" ? "" : DEV_JWT_SECRET);
  if (!value || value.length < 32) {
    throw new Error("JWT_SECRET must be set and at least 32 characters");
  }
  return new TextEncoder().encode(value);
}

export function getJwtRefreshSecretBytes(): Uint8Array {
  const value =
    process.env.JWT_REFRESH_SECRET ??
    (process.env.NODE_ENV === "production" ? "" : DEV_JWT_REFRESH);
  if (!value || value.length < 32) {
    throw new Error("JWT_REFRESH_SECRET must be at least 32 characters");
  }
  return new TextEncoder().encode(value);
}

export function getAdminLogin(): string {
  return process.env.ADMIN_LOGIN ?? "datacom";
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "12345678";
}
