import { defineField, defineType } from "sanity";

export const seoFieldsType = defineType({
  name: "seoFields",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Meta title",
      type: "string",
      description: "Titolo mostrato nei risultati di ricerca e nei social.",
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(180),
    }),
    defineField({
      name: "image",
      title: "Immagine social / Open Graph",
      type: "imageWithAlt",
    }),
    defineField({
      name: "noIndex",
      title: "No index",
      type: "boolean",
      initialValue: false,
      description: "Se attivo, il sito chiedera ai motori di non indicizzare.",
    }),
  ],
});
