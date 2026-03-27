import { defineField, defineType } from "sanity";

export const heroSlideType = defineType({
  name: "heroSlide",
  title: "Slide hero",
  type: "object",
  fields: [
    defineField({
      name: "mediaType",
      title: "Tipo contenuto",
      type: "string",
      initialValue: "video",
      options: {
        list: [
          { title: "Video", value: "video" },
          { title: "Immagine", value: "image" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Immagine slide",
      type: "imageWithAlt",
      hidden: ({ parent }) => parent?.mediaType !== "image",
    }),
    defineField({
      name: "video",
      title: "Video slide",
      type: "videoWithPoster",
      hidden: ({ parent }) => parent?.mediaType !== "video",
    }),
  ],
  validation: (Rule) =>
    Rule.custom((value: any) => {
      if (!value?.mediaType) return "Seleziona il tipo della slide.";
      if (value.mediaType === "image" && !value.image) {
        return "Aggiungi l'immagine della slide.";
      }
      if (value.mediaType === "video" && !value.video) {
        return "Aggiungi il video della slide.";
      }
      return true;
    }),
  preview: {
    select: {
      mediaType: "mediaType",
      imageAlt: "image.alt",
      videoAlt: "video.poster.alt",
      media: "image.image",
      videoMedia: "video.poster.image",
    },
    prepare(selection) {
      const title =
        selection.mediaType === "image"
          ? selection.imageAlt || "Slide immagine"
          : selection.videoAlt || "Slide video";

      return {
        title,
        subtitle:
          selection.mediaType === "image" ? "Hero immagine" : "Hero video",
        media: selection.media || selection.videoMedia,
      };
    },
  },
});
