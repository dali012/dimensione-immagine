import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  buildLocalBusinessSchema,
  getSiteSettings,
  getStoreLocations,
} from "../sanity/publicContent";
import {
  siteSettingsFallback,
  storeLocationsFallback,
} from "../sanity/publicContentFallbacks.js";
import type {
  SiteSettings,
  StoreLocationContent,
} from "../sanity/publicContentTypes";

interface SiteContentContextValue {
  siteSettings: SiteSettings;
  storeLocations: StoreLocationContent[];
  structuredData: Record<string, unknown>;
}

const SiteContentContext = createContext<SiteContentContextValue>({
  siteSettings: siteSettingsFallback,
  storeLocations: storeLocationsFallback,
  structuredData: buildLocalBusinessSchema(
    siteSettingsFallback,
    storeLocationsFallback,
  ) as Record<string, unknown>,
});

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [siteSettings, setSiteSettings] =
    useState<SiteSettings>(siteSettingsFallback);
  const [storeLocations, setStoreLocations] =
    useState<StoreLocationContent[]>(storeLocationsFallback);

  useEffect(() => {
    let mounted = true;

    Promise.all([getSiteSettings(), getStoreLocations()]).then(
      ([nextSiteSettings, nextStoreLocations]) => {
        if (!mounted) return;
        setSiteSettings(nextSiteSettings);
        setStoreLocations(nextStoreLocations);
      },
    );

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      siteSettings,
      storeLocations,
      structuredData: buildLocalBusinessSchema(siteSettings, storeLocations) as Record<
        string,
        unknown
      >,
    }),
    [siteSettings, storeLocations],
  );

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => useContext(SiteContentContext);
