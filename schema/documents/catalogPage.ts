import { defineField, defineType } from "sanity";

export const catalogPageType = defineType({
  name: "catalogPage",
  title: "Trovi da noi",
  type: "document",
  fields: [
    defineField({
      name: "headerLabel",
      title: "Etichetta header",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headerTitle",
      title: "Titolo header",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headerSubtitle",
      title: "Sottotitolo header",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().min(10).max(300),
    }),
    defineField({
      name: "searchPlaceholder",
      title: "Placeholder ricerca",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(120),
    }),
    defineField({
      name: "emptyStateText",
      title: "Testo stato vuoto",
      type: "string",
      validation: (Rule) => Rule.required().min(5).max(220),
    }),
    defineField({
      name: "filterDescriptions",
      title: "Descrizioni per filtro",
      type: "array",
      of: [{ type: "filterDescriptionGroup" }],
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
        title: "Trovi da noi",
        subtitle: "Header, descrizioni filtri e SEO catalogo",
      };
    },
  },
});
