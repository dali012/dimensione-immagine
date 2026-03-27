import { defineField, defineType } from "sanity";

export const socialLinkType = defineType({
  name: "socialLink",
  title: "Social",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      title: "Piattaforma",
      type: "string",
      options: {
        list: [
          { title: "Facebook", value: "facebook" },
          { title: "Instagram", value: "instagram" },
          { title: "TikTok", value: "tiktok" },
          { title: "LinkedIn", value: "linkedin" },
          { title: "Altro", value: "other" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "label",
      title: "Nome visualizzato",
      type: "string",
      description:
        "Opzionale. Se vuoto, il sito userebbe il nome della piattaforma.",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "url",
      platform: "platform",
    },
    prepare(selection) {
      return {
        title: selection.title || selection.platform || "Social",
        subtitle: selection.subtitle,
      };
    },
  },
});
