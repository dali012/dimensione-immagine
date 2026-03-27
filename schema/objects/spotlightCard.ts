import { defineField, defineType } from "sanity";

export const spotlightCardType = defineType({
  name: "spotlightCard",
  title: "Card spotlight",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Etichetta piccola",
      type: "string",
      validation: (Rule) => Rule.max(50),
    }),
    defineField({
      name: "title",
      title: "Titolo",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(80),
    }),
    defineField({
      name: "description",
      title: "Descrizione",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().min(10).max(320),
    }),
    defineField({
      name: "mood",
      title: "Tagline mood",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(120),
    }),
    defineField({
      name: "image",
      title: "Immagine",
      type: "imageWithAlt",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cta",
      title: "Call to action",
      type: "link",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "mood",
      media: "image.image",
    },
  },
});
