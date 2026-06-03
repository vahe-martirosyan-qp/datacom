import { notFound, redirect } from "next/navigation";
import { ensureContentStoreHydrated, getLanguages } from "@/lib/server/contentStore";

interface Props {
  params: Promise<{ lang: string }>;
}

/** Legacy singular URL (`/integration`) → `/integrations`. */
export default async function SiteIntegrationAliasPage({ params }: Props) {
  const { lang } = await params;
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(lang)) {
    notFound();
  }
  redirect(`/${lang}/integrations`);
}
