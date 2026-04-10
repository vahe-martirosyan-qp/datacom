import type { ReactNode } from "react";
import { resolveLanguageDir } from "@/lib/languageDirection";
import {
  ensureContentStoreHydrated,
  getLanguageByCode,
} from "@/lib/server/contentStore";

export const dynamic = "force-dynamic";

interface SiteLangLayoutProps {
  children: ReactNode;
  params: { lang: string };
}

export default async function SiteLangLayout({
  children,
  params,
}: SiteLangLayoutProps) {
  await ensureContentStoreHydrated();
  const meta = getLanguageByCode(params.lang);
  const dir = resolveLanguageDir(meta, params.lang);
  const rtl = dir === "rtl";

  return (
    <div
      className={`site-lang-root${rtl ? " site-lang-root--rtl" : ""}`}
      lang={params.lang}
      dir={dir}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}
