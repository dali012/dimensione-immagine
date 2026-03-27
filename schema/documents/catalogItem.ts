import { defineField, defineType } from "sanity";

export const catalogItemType = defineType({
  name: "catalogItem",
  title: "Elemento catalogo",
  type: "document",
  fields: [
    defineField({
      name: "category",
      title: "Categoria",
      type: "string",
      options: {
        list: [
          { title: "Donna", value: "Donna" },
          { title: "Uomo", value: "Uomo" },
          { title: "Accessori", value: "Accessori" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Titolo / alt immagine",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(140),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      validation: (Rule) => Rule.max(180),
    }),
    defineField({
      name: "image",
      title: "Immagine",
      type: "imageWithAlt",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "displayOrder",
      title: "Ordine visualizzazione",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "active",
      title: "Attivo",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "image.image",
    },
  },
});
