"use client";

import { useMemo } from "react";
import { useHomeContentQuery } from "@/hooks/useHomeContentQuery";
import { useLanguagesQuery } from "@/hooks/useLanguagesQuery";
import { entriesToMap } from "@/lib/contentUtils";
import { SiteAbout } from "./SiteAbout";
import { SiteBlogTeaser } from "./SiteBlogTeaser";
import { SiteChrome } from "./SiteChrome";
import { SiteClients } from "./SiteClients";
import { SiteContactStrip } from "./SiteContactStrip";
import { SiteFeatures } from "./SiteFeatures";
import { SiteHero } from "./SiteHero";
import { SiteLeadForm } from "./SiteLeadForm";
import { SiteProjectsTeaser } from "./SiteProjectsTeaser";
import { SiteSpotlight } from "./SiteSpotlight";
import { SiteStatsRow } from "./SiteStatsRow";
import { SiteSteps } from "./SiteSteps";

interface HomePageViewProps {
  lang: string;
}

/**
 * Homepage section order: hero → stats → spotlight → directions → about →
 * contact strip → lead form → projects → clients → how we work → blog.
 */
export function HomePageView({ lang }: HomePageViewProps) {
  const contentQuery = useHomeContentQuery(lang);
  const languagesQuery = useLanguagesQuery();

  const map = useMemo(
    () =>
      contentQuery.data ? entriesToMap(contentQuery.data.entries) : {},
    [contentQuery.data]
  );

  const languages = languagesQuery.data ?? [];
  const isLoading = contentQuery.isLoading || languagesQuery.isLoading;

  return (
    <SiteChrome
      lang={lang}
      map={map}
      languages={languages}
      isLoading={isLoading}
      loadError={contentQuery.isError}
    >
      <main>
        <SiteHero lang={lang} map={map} isLoading={isLoading} />
        <SiteStatsRow map={map} isLoading={isLoading} />
        <SiteSpotlight lang={lang} map={map} isLoading={isLoading} />
        <SiteFeatures map={map} isLoading={isLoading} />
        <SiteAbout lang={lang} map={map} isLoading={isLoading} />
        <SiteContactStrip lang={lang} map={map} isLoading={isLoading} />
        <SiteLeadForm map={map} isLoading={isLoading} />
        <SiteProjectsTeaser lang={lang} map={map} isLoading={isLoading} />
        <SiteClients map={map} isLoading={isLoading} />
        <SiteSteps map={map} isLoading={isLoading} />
        <SiteBlogTeaser lang={lang} map={map} isLoading={isLoading} />
      </main>
    </SiteChrome>
  );
}
