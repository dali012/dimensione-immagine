import { defineField, defineType } from "sanity";

export const locationsPageType = defineType({
  name: "locationsPage",
  title: "Negozi & Sedi",
  type: "document",
  fields: [
    defineField({
      name: "heroLabel",
      title: "Etichetta hero",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroTitle",
      title: "Titolo hero",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Sottotitolo hero",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().min(10).max(320),
    }),
    defineField({
      name: "mapEyebrow",
      title: "Etichetta sezione mappa",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mapTitle",
      title: "Titolo sezione mappa",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mapDescription",
      title: "Descrizione sezione mappa",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().min(10).max(320),
    }),
    defineField({
      name: "listEyebrow",
      title: "Etichetta lista sedi",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "listTitle",
      title: "Titolo lista sedi",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "listDescription",
      title: "Descrizione lista sedi",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().min(10).max(320),
    }),
    defineField({
      name: "seo",
      title: "SEO pagina",
      type: "seoFields",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Negozi & Sedi",
        subtitle: "Intro pagina, testi mappa e testi lista sedi",
      };
    },
  },
});
