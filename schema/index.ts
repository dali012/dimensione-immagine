import { aboutPageType } from "./documents/aboutPage";
import { catalogItemType } from "./documents/catalogItem";
import { catalogPageType } from "./documents/catalogPage";
import { contactPageType } from "./documents/contactPage";
import { homePageType } from "./documents/homePage";
import { locationsPageType } from "./documents/locationsPage";
import { siteSettingsType } from "./documents/siteSettings";
import { storeLocationType } from "./documents/storeLocation";
import { jobPositionType } from "./jobPosition";
import { businessHoursType } from "./objects/businessHours";
import { filterDescriptionGroupType } from "./objects/filterDescriptionGroup";
import { heroSlideType } from "./objects/heroSlide";
import { imageWithAltType } from "./objects/imageWithAlt";
import { linkType } from "./objects/link";
import { navigationItemType } from "./objects/navigationItem";
import { seoFieldsType } from "./objects/seoFields";
import { socialLinkType } from "./objects/socialLink";
import { spotlightCardType } from "./objects/spotlightCard";
import { statItemType } from "./objects/statItem";
import { videoWithPosterType } from "./objects/videoWithPoster";

export const schemaTypes = [
  imageWithAltType,
  linkType,
  businessHoursType,
  videoWithPosterType,
  heroSlideType,
  seoFieldsType,
  statItemType,
  spotlightCardType,
  navigationItemType,
  socialLinkType,
  filterDescriptionGroupType,
  siteSettingsType,
  homePageType,
  aboutPageType,
  locationsPageType,
  contactPageType,
  catalogPageType,
  storeLocationType,
  catalogItemType,
  jobPositionType,
];
