import { defineField, defineType } from "sanity";

export const filterDescriptionGroupType = defineType({
  name: "filterDescriptionGroup",
  title: "Descrizione filtro catalogo",
  type: "object",
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
      name: "items",
      title: "Voci descrittive",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "category",
    },
  },
});
