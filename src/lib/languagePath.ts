/** Path after locale segment: `/en` → ``; `/en/a/b` → `/a/b`. */
export function pathAfterLocale(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length <= 1) {
    return "";
  }
  return `/${parts.slice(1).join("/")}`;
}
