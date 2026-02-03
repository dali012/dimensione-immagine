import { author } from "./author";
import { post } from "./post";
import { quoteType } from "./blocks/quote";
import { videoEmbedType } from "./blocks/video-embed";
import { callToActionType } from "./blocks/call-to-action";
import { audioEmbedType } from "./blocks/audio-embed";
import { tableType } from "./blocks/table";
import { galleryType } from "./blocks/gallery";
import { mapType } from "./blocks/map";
import { chartType } from "./blocks/chart";
import { timelineType } from "./blocks/timeline";
import { faqType } from "./blocks/faq";
import { categoryType } from "./category";
import { jobPositionType } from "./jobPosition";

export const schemaTypes = [
  categoryType,
  post,
  author,
  jobPositionType,
  videoEmbedType,
  callToActionType,
  quoteType,
  tableType,
  audioEmbedType,
  galleryType,
  mapType,
  chartType,
  timelineType,
  faqType,
];
