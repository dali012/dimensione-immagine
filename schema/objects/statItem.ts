import { defineField, defineType } from "sanity";

export const statItemType = defineType({
  name: "statItem",
  title: "Statistica",
  type: "object",
  fields: [
    defineField({
      name: "value",
      title: "Valore",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(40),
    }),
    defineField({
      name: "label",
      title: "Etichetta",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(80),
    }),
  ],
  preview: {
    select: {
      title: "value",
      subtitle: "label",
    },
  },
});
