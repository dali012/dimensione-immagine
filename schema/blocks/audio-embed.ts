import { defineType, defineField } from "sanity";

export const audioEmbedType = defineType({
  name: "audioEmbed",
  title: "Audio Embed",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "Audio URL",
      type: "url",
    }),
  ],
});
