import { defineField, defineType } from "sanity";

export const imageWithAltType = defineType({
  name: "imageWithAlt",
  title: "Immagine",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "File immagine",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Testo alternativo",
      type: "string",
      description:
        "Descrizione breve dell'immagine per accessibilita e SEO.",
      validation: (Rule) => Rule.required().min(2).max(180),
    }),
    defineField({
      name: "caption",
      title: "Didascalia",
      type: "string",
      description: "Testo opzionale mostrabile a video o usabile come nota.",
    }),
  ],
  preview: {
    select: {
      title: "alt",
      media: "image",
      subtitle: "caption",
    },
    prepare(selection) {
      return {
        title: selection.title || "Immagine senza alt",
        subtitle: selection.subtitle || "Nessuna didascalia",
        media: selection.media,
      };
    },
  },
});
