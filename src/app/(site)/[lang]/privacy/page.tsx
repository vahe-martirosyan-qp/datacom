import { redirect } from "next/navigation";
import { getLanguages, ensureContentStoreHydrated } from "@/lib/server/contentStore";

interface Props {
  params: { lang: string };
}

/** Legacy short URL → canonical `/[lang]/privacy-policy`. */
export default async function SitePrivacyRedirectPage({ params }: Props) {
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(params.lang)) {
    redirect("/en/privacy-policy");
  }
  redirect(`/${params.lang}/privacy-policy`);
}
