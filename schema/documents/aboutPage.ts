import { defineField, defineType } from "sanity";

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "Chi siamo",
  type: "document",
  fields: [
    defineField({
      name: "introEyebrow",
      title: "Etichetta introduzione",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(60),
    }),
    defineField({
      name: "introTitle",
      title: "Titolo introduzione",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: "introText",
      title: "Testo introduzione",
      type: "text",
      rows: 8,
      description: "Separare i paragrafi con una riga vuota.",
      validation: (Rule) => Rule.required().min(30),
    }),
    defineField({
      name: "missionEyebrow",
      title: "Etichetta mission",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(60),
    }),
    defineField({
      name: "missionTitle",
      title: "Titolo mission",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(100),
    }),
    defineField({
      name: "missionText",
      title: "Testo mission",
      type: "text",
      rows: 8,
      description: "Separare i paragrafi con una riga vuota.",
      validation: (Rule) => Rule.required().min(30),
    }),
    defineField({
      name: "stats",
      title: "Statistiche",
      type: "array",
      of: [{ type: "statItem" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "valuesTitle",
      title: "Titolo sezione valori",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "valuesSubtitle",
      title: "Sottotitolo sezione valori",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "values",
      title: "Valori",
      type: "array",
      of: [
        {
          type: "object",
          name: "aboutValue",
          title: "Valore",
          fields: [
            defineField({
              name: "title",
              title: "Titolo",
              type: "string",
              validation: (Rule) => Rule.required().min(2).max(120),
            }),
            defineField({
              name: "description",
              title: "Descrizione",
              type: "text",
              rows: 5,
              validation: (Rule) => Rule.required().min(10).max(400),
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "description",
            },
            prepare(selection) {
              return {
                title: selection.title,
                subtitle:
                  typeof selection.subtitle === "string"
                    ? selection.subtitle.slice(0, 80)
                    : "",
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
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
        title: "Chi siamo",
        subtitle: "Storia, mission, statistiche e valori",
      };
    },
  },
});
