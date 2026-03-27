import { defineField, defineType } from "sanity";

export const linkType = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Etichetta bottone/link",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(80),
    }),
    defineField({
      name: "href",
      title: "URL o percorso",
      type: "string",
      description:
        "Esempi: /chi-siamo, /sedi, https://maps.app.goo.gl/...",
      validation: (Rule) => Rule.required().min(1).max(500),
    }),
    defineField({
      name: "newTab",
      title: "Apri in una nuova scheda",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "href",
    },
  },
});
