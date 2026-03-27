import { useEffect, useState } from "react";
import { client } from "./client";
import {
  aboutPageFallback,
  catalogItemsFallback,
  catalogPageFallback,
  contactPageFallback,
  homePageFallback,
  locationsPageFallback,
  siteSettingsFallback,
  storeLocationsFallback,
} from "./publicContentFallbacks.js";
import type {
  AboutPageContent,
  BusinessHour,
  CatalogItemContent,
  CatalogPageContent,
  ContactPageContent,
  HeroSlide,
  HomePageContent,
  ImageAsset,
  LinkFields,
  LocationsPageContent,
  NavigationItemContent,
  SeoFields,
  SiteSettings,
  SocialLinkContent,
  SpotlightCardContent,
  StatItemContent,
  StoreLocationContent,
} from "./publicContentTypes";

const imageProjection = `{
  alt,
  caption,
  "src": image.asset->url
}`;

const linkProjection = `{
  label,
  href,
  newTab
}`;

const seoProjection = `{
  title,
  description,
  noIndex,
  image ${imageProjection}
}`;

const heroSlideProjection = `{
  _key,
  mediaType,
  image ${imageProjection},
  video {
    "src": video.asset->url,
    poster ${imageProjection},
    mobilePoster ${imageProjection}
  }
}`;

const siteSettingsQuery = `*[_id == "siteSettings"][0]{
  siteName,
  siteUrl,
  logo ${imageProjection},
  navigationItems[]{
    route,
    label,
    visible
  },
  primaryPhone,
  primaryWhatsapp,
  primaryEmail,
  primaryMapUrl,
  primaryAddressLine1,
  primaryPostalCode,
  primaryCity,
  primaryRegionCode,
  primaryCountryCode,
  officeHours[]{
    label,
    value
  },
  areaServed,
  priceRange,
  socialLinks[]{
    platform,
    label,
    url
  },
  legalCompanyName,
  vatNumber,
  codiceUnivoco,
  footerNewsletterTitle,
  footerNewsletterDescription,
  footerNewsletterDisclaimer,
  defaultSeo ${seoProjection}
}`;

const homePageQuery = `*[_id == "homePage"][0]{
  heroTitle,
  heroAccent,
  heroDescription,
  heroCta ${linkProjection},
  heroSlides[]${heroSlideProjection},
  stats[]{
    value,
    label
  },
  styleSectionLabel,
  styleSectionTitle,
  styleSectionDescription,
  styleTags,
  spotlightCards[]{
    eyebrow,
    title,
    description,
    mood,
    image ${imageProjection},
    cta ${linkProjection}
  },
  bottomBannerDescription,
  bottomCta ${linkProjection},
  seo ${seoProjection}
}`;

const aboutPageQuery = `*[_id == "aboutPage"][0]{
  introEyebrow,
  introTitle,
  introText,
  missionEyebrow,
  missionTitle,
  missionText,
  stats[]{
    value,
    label
  },
  valuesTitle,
  valuesSubtitle,
  values[]{
    title,
    description
  },
  seo ${seoProjection}
}`;

const locationsPageQuery = `*[_id == "locationsPage"][0]{
  heroLabel,
  heroTitle,
  heroSubtitle,
  mapEyebrow,
  mapTitle,
  mapDescription,
  listEyebrow,
  listTitle,
  listDescription,
  seo ${seoProjection}
}`;

const contactPageQuery = `*[_id == "contactPage"][0]{
  heroTitle,
  heroAccent,
  heroSubtitle,
  heroImage ${imageProjection},
  heroCtaLabel,
  formLabel,
  formTitle,
  formDescription,
  locationBlockTitle,
  locationLinkLabel,
  phoneBlockTitle,
  phoneLinkLabel,
  emailBlockTitle,
  hoursBlockTitle,
  seo ${seoProjection}
}`;

const catalogPageQuery = `*[_id == "catalogPage"][0]{
  headerLabel,
  headerTitle,
  headerSubtitle,
  searchPlaceholder,
  emptyStateText,
  filterDescriptions[]{
    category,
    items
  },
  seo ${seoProjection}
}`;

const storeLocationsQuery = `*[_type == "storeLocation" && active == true] | order(displayOrder asc, name asc){
  "_id": _id,
  name,
  ownershipType,
  region,
  city,
  mapUrl,
  address,
  image ${imageProjection},
  phone,
  hours[]{
    label,
    value
  },
  latitude,
  longitude,
  markerOffsetX,
  markerOffsetY,
  active,
  displayOrder
}`;

const catalogItemsQuery = `*[_type == "catalogItem" && active == true] | order(displayOrder asc, title asc){
  "_id": _id,
  category,
  title,
  caption,
  image ${imageProjection},
  active,
  displayOrder
}`;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const normalizeString = (value: unknown, fallback: string) =>
  isNonEmptyString(value) ? value.trim() : fallback;

const normalizeNumber = (value: unknown, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const normalizeBoolean = (value: unknown, fallback = false) =>
  typeof value === "boolean" ? value : fallback;

const normalizeImage = (
  raw: any,
  fallback?: ImageAsset,
): ImageAsset | undefined => {
  if (!raw && !fallback) return undefined;
  const src = normalizeString(raw?.src, fallback?.src || "");
  if (!src) return fallback;

  return {
    src,
    alt: normalizeString(raw?.alt, fallback?.alt || ""),
    caption: normalizeString(raw?.caption, fallback?.caption || ""),
  };
};

const normalizeLink = (raw: any, fallback: LinkFields): LinkFields => ({
  label: normalizeString(raw?.label, fallback.label),
  href: normalizeString(raw?.href, fallback.href),
  newTab: normalizeBoolean(raw?.newTab, fallback.newTab || false),
});

const normalizeSeo = (raw: any, fallback: SeoFields): SeoFields => ({
  title: normalizeString(raw?.title, fallback.title || ""),
  description: normalizeString(raw?.description, fallback.description || ""),
  image: normalizeImage(raw?.image, fallback.image),
  noIndex: normalizeBoolean(raw?.noIndex, fallback.noIndex || false),
});

const normalizeHours = (raw: any, fallback: BusinessHour[]): BusinessHour[] => {
  if (!Array.isArray(raw) || raw.length === 0) return fallback;

  const normalized = raw
    .map((item) => ({
      label: normalizeString(item?.label, ""),
      value: normalizeString(item?.value, ""),
    }))
    .filter((item) => item.label && item.value);

  return normalized.length > 0 ? normalized : fallback;
};

const normalizeNavigationItems = (
  raw: any,
  fallback: NavigationItemContent[],
): NavigationItemContent[] => {
  if (!Array.isArray(raw) || raw.length === 0) return fallback;

  const normalized = raw
    .map((item) => ({
      route: normalizeString(item?.route, ""),
      label: normalizeString(item?.label, ""),
      visible: normalizeBoolean(item?.visible, true),
    }))
    .filter((item) => item.route && item.label);

  return normalized.length > 0
    ? (normalized as NavigationItemContent[])
    : fallback;
};

const normalizeSocialLinks = (
  raw: any,
  fallback: SocialLinkContent[],
): SocialLinkContent[] => {
  if (!Array.isArray(raw) || raw.length === 0) return fallback;

  const normalized = raw
    .map((item) => ({
      platform: normalizeString(item?.platform, "other"),
      url: normalizeString(item?.url, ""),
      label: normalizeString(item?.label, ""),
    }))
    .filter((item) => item.url);

  return normalized.length > 0
    ? (normalized as SocialLinkContent[])
    : fallback;
};

const normalizeStats = (
  raw: any,
  fallback: StatItemContent[],
): StatItemContent[] => {
  if (!Array.isArray(raw) || raw.length === 0) return fallback;
  const normalized = raw
    .map((item) => ({
      value: normalizeString(item?.value, ""),
      label: normalizeString(item?.label, ""),
    }))
    .filter((item) => item.value && item.label);

  return normalized.length > 0 ? normalized : fallback;
};

const normalizeHeroSlides = (
  raw: any,
  fallback: HeroSlide[],
): HeroSlide[] => {
  if (!Array.isArray(raw) || raw.length === 0) return fallback;

  const normalized = raw
    .map((item: any, index: number) => {
      const mediaType = normalizeString(item?.mediaType, "video");
      const image = normalizeImage(item?.image);
      const poster = normalizeImage(item?.video?.poster);
      const mobilePoster = normalizeImage(item?.video?.mobilePoster, poster);
      const videoSrc = normalizeString(item?.video?.src, "");

      if (mediaType === "image" && image) {
        return {
          id: normalizeString(item?._key, `hero-image-${index}`),
          mediaType: "image",
          image,
        } satisfies HeroSlide;
      }

      if (mediaType === "video" && videoSrc) {
        return {
          id: normalizeString(item?._key, `hero-video-${index}`),
          mediaType: "video",
          video: {
            src: videoSrc,
            poster,
            mobilePoster,
          },
        } satisfies HeroSlide;
      }

      return null;
    })
    .filter(Boolean);

  return normalized.length > 0 ? normalized : fallback;
};

const normalizeSpotlightCards = (
  raw: any,
  fallback: SpotlightCardContent[],
): SpotlightCardContent[] => {
  if (!Array.isArray(raw) || raw.length === 0) return fallback;

  const normalized = raw
    .map((item: any, index: number) => {
      const image = normalizeImage(item?.image, fallback[index]?.image);
      if (!image) return null;

      return {
        eyebrow: normalizeString(item?.eyebrow, fallback[index]?.eyebrow || ""),
        title: normalizeString(item?.title, fallback[index]?.title || ""),
        description: normalizeString(
          item?.description,
          fallback[index]?.description || "",
        ),
        mood: normalizeString(item?.mood, fallback[index]?.mood || ""),
        image,
        cta: normalizeLink(item?.cta, fallback[index]?.cta || fallback[0].cta!),
      } satisfies SpotlightCardContent;
    })
    .filter((item) => item && item.title && item.description && item.mood);

  return normalized.length > 0 ? normalized : fallback;
};

const splitList = (raw: any, fallback: string[]) => {
  if (!Array.isArray(raw) || raw.length === 0) return fallback;
  const normalized = raw.filter(isNonEmptyString).map((item) => item.trim());
  return normalized.length > 0 ? normalized : fallback;
};

async function fetchContent<T>(
  query: string,
  fallback: T,
  normalize: (raw: any, fallbackValue: T) => T,
): Promise<T> {
  try {
    const data = await client.fetch(query);
    return normalize(data, fallback);
  } catch {
    return fallback;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return fetchContent(siteSettingsQuery, siteSettingsFallback, (raw, fallback) => ({
    siteName: normalizeString(raw?.siteName, fallback.siteName),
    siteUrl: normalizeString(raw?.siteUrl, fallback.siteUrl),
    logo: normalizeImage(raw?.logo, fallback.logo),
    navigationItems: normalizeNavigationItems(
      raw?.navigationItems,
      fallback.navigationItems,
    ),
    primaryPhone: normalizeString(raw?.primaryPhone, fallback.primaryPhone || ""),
    primaryWhatsapp: normalizeString(
      raw?.primaryWhatsapp,
      fallback.primaryWhatsapp || "",
    ),
    primaryEmail: normalizeString(raw?.primaryEmail, fallback.primaryEmail || ""),
    primaryMapUrl: normalizeString(
      raw?.primaryMapUrl,
      fallback.primaryMapUrl || "",
    ),
    primaryAddressLine1: normalizeString(
      raw?.primaryAddressLine1,
      fallback.primaryAddressLine1 || "",
    ),
    primaryPostalCode: normalizeString(
      raw?.primaryPostalCode,
      fallback.primaryPostalCode || "",
    ),
    primaryCity: normalizeString(raw?.primaryCity, fallback.primaryCity || ""),
    primaryRegionCode: normalizeString(
      raw?.primaryRegionCode,
      fallback.primaryRegionCode || "",
    ),
    primaryCountryCode: normalizeString(
      raw?.primaryCountryCode,
      fallback.primaryCountryCode || "IT",
    ),
    officeHours: normalizeHours(raw?.officeHours, fallback.officeHours),
    areaServed: normalizeString(raw?.areaServed, fallback.areaServed || ""),
    priceRange: normalizeString(raw?.priceRange, fallback.priceRange || ""),
    socialLinks: normalizeSocialLinks(raw?.socialLinks, fallback.socialLinks),
    legalCompanyName: normalizeString(
      raw?.legalCompanyName,
      fallback.legalCompanyName,
    ),
    vatNumber: normalizeString(raw?.vatNumber, fallback.vatNumber || ""),
    codiceUnivoco: normalizeString(
      raw?.codiceUnivoco,
      fallback.codiceUnivoco || "",
    ),
    footerNewsletterTitle: normalizeString(
      raw?.footerNewsletterTitle,
      fallback.footerNewsletterTitle,
    ),
    footerNewsletterDescription: normalizeString(
      raw?.footerNewsletterDescription,
      fallback.footerNewsletterDescription,
    ),
    footerNewsletterDisclaimer: normalizeString(
      raw?.footerNewsletterDisclaimer,
      fallback.footerNewsletterDisclaimer,
    ),
    defaultSeo: normalizeSeo(raw?.defaultSeo, fallback.defaultSeo),
  }));
}

export async function getHomePageContent(): Promise<HomePageContent> {
  return fetchContent(homePageQuery, homePageFallback, (raw, fallback) => ({
    seo: normalizeSeo(raw?.seo, fallback.seo),
    heroTitle: normalizeString(raw?.heroTitle, fallback.heroTitle),
    heroAccent: normalizeString(raw?.heroAccent, fallback.heroAccent),
    heroDescription: normalizeString(
      raw?.heroDescription,
      fallback.heroDescription,
    ),
    heroCta: normalizeLink(raw?.heroCta, fallback.heroCta),
    heroSlides: normalizeHeroSlides(raw?.heroSlides, fallback.heroSlides),
    stats: normalizeStats(raw?.stats, fallback.stats),
    styleSectionLabel: normalizeString(
      raw?.styleSectionLabel,
      fallback.styleSectionLabel,
    ),
    styleSectionTitle: normalizeString(
      raw?.styleSectionTitle,
      fallback.styleSectionTitle,
    ),
    styleSectionDescription: normalizeString(
      raw?.styleSectionDescription,
      fallback.styleSectionDescription,
    ),
    styleTags: splitList(raw?.styleTags, fallback.styleTags),
    spotlightCards: normalizeSpotlightCards(
      raw?.spotlightCards,
      fallback.spotlightCards,
    ),
    bottomBannerDescription: normalizeString(
      raw?.bottomBannerDescription,
      fallback.bottomBannerDescription,
    ),
    bottomCta: normalizeLink(raw?.bottomCta, fallback.bottomCta),
  }));
}

export async function getAboutPageContent(): Promise<AboutPageContent> {
  return fetchContent(aboutPageQuery, aboutPageFallback, (raw, fallback) => ({
    seo: normalizeSeo(raw?.seo, fallback.seo),
    introEyebrow: normalizeString(raw?.introEyebrow, fallback.introEyebrow),
    introTitle: normalizeString(raw?.introTitle, fallback.introTitle),
    introText: normalizeString(raw?.introText, fallback.introText),
    missionEyebrow: normalizeString(
      raw?.missionEyebrow,
      fallback.missionEyebrow,
    ),
    missionTitle: normalizeString(raw?.missionTitle, fallback.missionTitle),
    missionText: normalizeString(raw?.missionText, fallback.missionText),
    stats: normalizeStats(raw?.stats, fallback.stats),
    valuesTitle: normalizeString(raw?.valuesTitle, fallback.valuesTitle),
    valuesSubtitle: normalizeString(
      raw?.valuesSubtitle,
      fallback.valuesSubtitle,
    ),
    values:
      Array.isArray(raw?.values) && raw.values.length > 0
        ? raw.values
            .map((item: any) => ({
              title: normalizeString(item?.title, ""),
              description: normalizeString(item?.description, ""),
            }))
            .filter((item: any) => item.title && item.description)
        : fallback.values,
  }));
}

export async function getLocationsPageContent(): Promise<LocationsPageContent> {
  return fetchContent(
    locationsPageQuery,
    locationsPageFallback,
    (raw, fallback) => ({
      seo: normalizeSeo(raw?.seo, fallback.seo),
      heroLabel: normalizeString(raw?.heroLabel, fallback.heroLabel),
      heroTitle: normalizeString(raw?.heroTitle, fallback.heroTitle),
      heroSubtitle: normalizeString(raw?.heroSubtitle, fallback.heroSubtitle),
      mapEyebrow: normalizeString(raw?.mapEyebrow, fallback.mapEyebrow),
      mapTitle: normalizeString(raw?.mapTitle, fallback.mapTitle),
      mapDescription: normalizeString(
        raw?.mapDescription,
        fallback.mapDescription,
      ),
      listEyebrow: normalizeString(raw?.listEyebrow, fallback.listEyebrow),
      listTitle: normalizeString(raw?.listTitle, fallback.listTitle),
      listDescription: normalizeString(
        raw?.listDescription,
        fallback.listDescription,
      ),
    }),
  );
}

export async function getContactPageContent(): Promise<ContactPageContent> {
  return fetchContent(contactPageQuery, contactPageFallback, (raw, fallback) => ({
    seo: normalizeSeo(raw?.seo, fallback.seo),
    heroTitle: normalizeString(raw?.heroTitle, fallback.heroTitle),
    heroAccent: normalizeString(raw?.heroAccent, fallback.heroAccent),
    heroSubtitle: normalizeString(raw?.heroSubtitle, fallback.heroSubtitle),
    heroImage: normalizeImage(raw?.heroImage, fallback.heroImage)!,
    heroCtaLabel: normalizeString(raw?.heroCtaLabel, fallback.heroCtaLabel),
    formLabel: normalizeString(raw?.formLabel, fallback.formLabel),
    formTitle: normalizeString(raw?.formTitle, fallback.formTitle),
    formDescription: normalizeString(
      raw?.formDescription,
      fallback.formDescription,
    ),
    locationBlockTitle: normalizeString(
      raw?.locationBlockTitle,
      fallback.locationBlockTitle,
    ),
    locationLinkLabel: normalizeString(
      raw?.locationLinkLabel,
      fallback.locationLinkLabel,
    ),
    phoneBlockTitle: normalizeString(
      raw?.phoneBlockTitle,
      fallback.phoneBlockTitle,
    ),
    phoneLinkLabel: normalizeString(
      raw?.phoneLinkLabel,
      fallback.phoneLinkLabel,
    ),
    emailBlockTitle: normalizeString(
      raw?.emailBlockTitle,
      fallback.emailBlockTitle,
    ),
    hoursBlockTitle: normalizeString(
      raw?.hoursBlockTitle,
      fallback.hoursBlockTitle,
    ),
  }));
}

export async function getCatalogPageContent(): Promise<CatalogPageContent> {
  return fetchContent(catalogPageQuery, catalogPageFallback, (raw, fallback) => ({
    seo: normalizeSeo(raw?.seo, fallback.seo),
    headerLabel: normalizeString(raw?.headerLabel, fallback.headerLabel),
    headerTitle: normalizeString(raw?.headerTitle, fallback.headerTitle),
    headerSubtitle: normalizeString(
      raw?.headerSubtitle,
      fallback.headerSubtitle,
    ),
    searchPlaceholder: normalizeString(
      raw?.searchPlaceholder,
      fallback.searchPlaceholder,
    ),
    emptyStateText: normalizeString(
      raw?.emptyStateText,
      fallback.emptyStateText,
    ),
    filterDescriptions:
      Array.isArray(raw?.filterDescriptions) && raw.filterDescriptions.length > 0
        ? raw.filterDescriptions
            .map((item: any) => ({
              category: normalizeString(item?.category, ""),
              items: splitList(item?.items, []),
            }))
            .filter((item: any) => item.category && item.items.length > 0)
        : fallback.filterDescriptions,
  }));
}

export async function getStoreLocations(): Promise<StoreLocationContent[]> {
  return fetchContent(
    storeLocationsQuery,
    storeLocationsFallback,
    (raw, fallback) => {
      if (!Array.isArray(raw) || raw.length === 0) return fallback;

      const normalized = raw
        .map((item: any, index: number) => {
          const image = normalizeImage(item?.image, fallback[index]?.image);
          if (!image) return null;

          return {
            id: normalizeString(item?._id, fallback[index]?.id || `store-${index}`),
            name: normalizeString(item?.name, fallback[index]?.name || ""),
            ownershipType:
              normalizeString(
                item?.ownershipType,
                fallback[index]?.ownershipType || "direct",
              ) === "franchise"
                ? "franchise"
                : "direct",
            region: normalizeString(item?.region, fallback[index]?.region || ""),
            city: normalizeString(item?.city, fallback[index]?.city || ""),
            mapUrl: normalizeString(item?.mapUrl, fallback[index]?.mapUrl || ""),
            address: normalizeString(
              item?.address,
              fallback[index]?.address || "",
            ),
            image,
            phone: normalizeString(item?.phone, fallback[index]?.phone || ""),
            hours: normalizeHours(item?.hours, fallback[index]?.hours || []),
            latitude: normalizeNumber(
              item?.latitude,
              fallback[index]?.latitude || 0,
            ),
            longitude: normalizeNumber(
              item?.longitude,
              fallback[index]?.longitude || 0,
            ),
            markerOffsetX: normalizeNumber(
              item?.markerOffsetX,
              fallback[index]?.markerOffsetX || 0,
            ),
            markerOffsetY: normalizeNumber(
              item?.markerOffsetY,
              fallback[index]?.markerOffsetY || 0,
            ),
            active: normalizeBoolean(item?.active, true),
            displayOrder: normalizeNumber(
              item?.displayOrder,
              fallback[index]?.displayOrder || index,
            ),
          } satisfies StoreLocationContent;
        })
        .filter(Boolean);

      return normalized.length > 0 ? normalized : fallback;
    },
  );
}

export async function getCatalogItems(): Promise<CatalogItemContent[]> {
  return fetchContent(catalogItemsQuery, catalogItemsFallback, (raw, fallback) => {
    if (!Array.isArray(raw) || raw.length === 0) return fallback;

    const normalized = raw
      .map((item: any, index: number) => {
        const image = normalizeImage(item?.image, fallback[index]?.image);
        if (!image) return null;

        return {
          id: normalizeString(item?._id, fallback[index]?.id || `catalog-${index}`),
          category: normalizeString(
            item?.category,
            fallback[index]?.category || "Uomo",
          ) as CatalogItemContent["category"],
          title: normalizeString(item?.title, fallback[index]?.title || ""),
          caption: normalizeString(item?.caption, fallback[index]?.caption || ""),
          image,
          active: normalizeBoolean(item?.active, true),
          displayOrder: normalizeNumber(
            item?.displayOrder,
            fallback[index]?.displayOrder || index,
          ),
        } satisfies CatalogItemContent;
      })
      .filter(Boolean);

    return normalized.length > 0 ? normalized : fallback;
  });
}

function useCmsValue<T>(loader: () => Promise<T>, fallback: T) {
  const [data, setData] = useState<T>(fallback);

  useEffect(() => {
    let mounted = true;

    loader().then((value) => {
      if (mounted) {
        setData(value);
      }
    });

    return () => {
      mounted = false;
    };
  }, [loader]);

  return data;
}

export const useHomePageContent = () =>
  useCmsValue(getHomePageContent, homePageFallback);
export const useAboutPageContent = () =>
  useCmsValue(getAboutPageContent, aboutPageFallback);
export const useLocationsPageContent = () =>
  useCmsValue(getLocationsPageContent, locationsPageFallback);
export const useContactPageContent = () =>
  useCmsValue(getContactPageContent, contactPageFallback);
export const useCatalogPageContent = () =>
  useCmsValue(getCatalogPageContent, catalogPageFallback);
export const useCatalogItems = () => useCmsValue(getCatalogItems, catalogItemsFallback);

export const businessHoursToMultiline = (hours: BusinessHour[]) =>
  hours
    .map((item) => [item.label, item.value].filter(Boolean).join(" "))
    .filter(Boolean)
    .join("\n");

export const splitParagraphs = (value: string) =>
  value
    .split(/\n\s*\n/g)
    .map((item) => item.trim())
    .filter(Boolean);

export const toAbsoluteUrl = (value: string | undefined, siteUrl: string) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/")) {
    return `${siteUrl.replace(/\/$/, "")}${value}`;
  }
  return value;
};

export const buildLocalBusinessSchema = (
  siteSettings: SiteSettings,
  storeLocations: StoreLocationContent[],
) => {
  const sameAs = siteSettings.socialLinks.map((item) => item.url).filter(Boolean);
  const directStores = storeLocations.filter(
    (store) => store.ownershipType === "direct",
  );

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteSettings.siteUrl.replace(/\/$/, "")}/#localbusiness`,
    name: siteSettings.siteName,
    url: siteSettings.siteUrl,
    telephone: siteSettings.primaryPhone,
    priceRange: siteSettings.priceRange,
    image: toAbsoluteUrl(
      siteSettings.defaultSeo.image?.src || siteSettings.logo?.src,
      siteSettings.siteUrl,
    ),
    address: {
      "@type": "PostalAddress",
      streetAddress: siteSettings.primaryAddressLine1,
      postalCode: siteSettings.primaryPostalCode,
      addressLocality: siteSettings.primaryCity,
      addressRegion: siteSettings.primaryRegionCode,
      addressCountry: siteSettings.primaryCountryCode || "IT",
    },
    areaServed: siteSettings.areaServed,
    sameAs,
    department: directStores.map((store) => ({
      "@type": "Store",
      name: store.name,
      telephone: store.phone,
      image: toAbsoluteUrl(store.image.src, siteSettings.siteUrl),
      address: {
        "@type": "PostalAddress",
        streetAddress: store.address,
        addressLocality: store.city,
        addressRegion: store.region,
        addressCountry: siteSettings.primaryCountryCode || "IT",
      },
    })),
  };
};
