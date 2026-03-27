export type RoutePath =
  | "/"
  | "/chi-siamo"
  | "/trovi-da-noi"
  | "/sedi"
  | "/lavora-con-noi"
  | "/distribuzione-in-grosso"
  | "/contatti";

export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "linkedin"
  | "other";

export type StoreOwnershipType = "direct" | "franchise";
export type CatalogCategory = "Donna" | "Uomo" | "Accessori";

export interface ImageAsset {
  src: string;
  alt: string;
  caption?: string;
}

export interface VideoAsset {
  src: string;
  poster?: ImageAsset;
  mobilePoster?: ImageAsset;
}

export interface HeroSlide {
  id: string;
  mediaType: "image" | "video";
  image?: ImageAsset;
  video?: VideoAsset;
}

export interface LinkFields {
  label: string;
  href: string;
  newTab?: boolean;
}

export interface SeoFields {
  title?: string;
  description?: string;
  image?: ImageAsset;
  noIndex?: boolean;
}

export interface NavigationItemContent {
  route: RoutePath;
  label: string;
  visible: boolean;
}

export interface SocialLinkContent {
  platform: SocialPlatform;
  url: string;
  label?: string;
}

export interface BusinessHour {
  label: string;
  value: string;
}

export interface StatItemContent {
  value: string;
  label: string;
}

export interface SpotlightCardContent {
  eyebrow?: string;
  title: string;
  description: string;
  mood: string;
  image: ImageAsset;
  cta?: LinkFields;
}

export interface SiteSettings {
  siteName: string;
  siteUrl: string;
  logo?: ImageAsset;
  navigationItems: NavigationItemContent[];
  primaryPhone?: string;
  primaryWhatsapp?: string;
  primaryEmail?: string;
  primaryMapUrl?: string;
  primaryAddressLine1?: string;
  primaryPostalCode?: string;
  primaryCity?: string;
  primaryRegionCode?: string;
  primaryCountryCode?: string;
  officeHours: BusinessHour[];
  areaServed?: string;
  priceRange?: string;
  socialLinks: SocialLinkContent[];
  legalCompanyName: string;
  vatNumber?: string;
  codiceUnivoco?: string;
  footerNewsletterTitle: string;
  footerNewsletterDescription: string;
  footerNewsletterDisclaimer: string;
  defaultSeo: SeoFields;
}

export interface HomePageContent {
  seo: SeoFields;
  heroTitle: string;
  heroAccent: string;
  heroDescription: string;
  heroCta: LinkFields;
  heroSlides: HeroSlide[];
  stats: StatItemContent[];
  styleSectionLabel: string;
  styleSectionTitle: string;
  styleSectionDescription: string;
  styleTags: string[];
  spotlightCards: SpotlightCardContent[];
  bottomBannerDescription: string;
  bottomCta: LinkFields;
}

export interface AboutValueContent {
  title: string;
  description: string;
}

export interface AboutPageContent {
  seo: SeoFields;
  introEyebrow: string;
  introTitle: string;
  introText: string;
  missionEyebrow: string;
  missionTitle: string;
  missionText: string;
  stats: StatItemContent[];
  valuesTitle: string;
  valuesSubtitle: string;
  values: AboutValueContent[];
}

export interface LocationsPageContent {
  seo: SeoFields;
  heroLabel: string;
  heroTitle: string;
  heroSubtitle: string;
  mapEyebrow: string;
  mapTitle: string;
  mapDescription: string;
  listEyebrow: string;
  listTitle: string;
  listDescription: string;
}

export interface ContactPageContent {
  seo: SeoFields;
  heroTitle: string;
  heroAccent: string;
  heroSubtitle: string;
  heroImage: ImageAsset;
  heroCtaLabel: string;
  formLabel: string;
  formTitle: string;
  formDescription: string;
  locationBlockTitle: string;
  locationLinkLabel: string;
  phoneBlockTitle: string;
  phoneLinkLabel: string;
  emailBlockTitle: string;
  hoursBlockTitle: string;
}

export interface FilterDescriptionGroupContent {
  category: CatalogCategory;
  items: string[];
}

export interface CatalogPageContent {
  seo: SeoFields;
  headerLabel: string;
  headerTitle: string;
  headerSubtitle: string;
  searchPlaceholder: string;
  emptyStateText: string;
  filterDescriptions: FilterDescriptionGroupContent[];
}

export interface StoreLocationContent {
  id: string;
  name: string;
  ownershipType: StoreOwnershipType;
  region: string;
  city: string;
  mapUrl: string;
  address: string;
  image: ImageAsset;
  phone?: string;
  hours: BusinessHour[];
  latitude: number;
  longitude: number;
  markerOffsetX?: number;
  markerOffsetY?: number;
  active: boolean;
  displayOrder: number;
}

export interface CatalogItemContent {
  id: string;
  category: CatalogCategory;
  title: string;
  caption?: string;
  image: ImageAsset;
  active: boolean;
  displayOrder: number;
}
