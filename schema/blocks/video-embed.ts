import { defineType, defineField } from "sanity";

export const videoEmbedType = defineType({
  name: "videoEmbed",
  title: "Video Embed",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "Video URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
