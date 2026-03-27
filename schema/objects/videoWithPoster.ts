import { defineField, defineType } from "sanity";

export const videoWithPosterType = defineType({
  name: "videoWithPoster",
  title: "Video con poster",
  type: "object",
  fields: [
    defineField({
      name: "video",
      title: "File video",
      type: "file",
      options: {
        accept: "video/*",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "poster",
      title: "Poster desktop",
      type: "imageWithAlt",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mobilePoster",
      title: "Poster mobile",
      type: "imageWithAlt",
      description:
        "Opzionale. Se assente, il sito usera il poster desktop anche su mobile.",
    }),
  ],
  preview: {
    select: {
      media: "poster.image",
      title: "poster.alt",
    },
    prepare(selection) {
      return {
        title: selection.title || "Video hero",
        subtitle: "Video con poster",
        media: selection.media,
      };
    },
  },
});
