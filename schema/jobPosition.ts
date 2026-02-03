import { defineField, defineType } from "sanity";

export const jobPositionType = defineType({
  name: "jobPosition",
  title: "Posizioni Lavorative",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titolo",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "active",
      title: "Attiva",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
