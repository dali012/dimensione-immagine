import { defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Titolo hero",
      type: "string",
      validation: (Rule) => Rule.required().min(4).max(120),
    }),
    defineField({
      name: "heroAccent",
      title: "Titolo hero evidenziato",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(120),
    }),
    defineField({
      name: "heroDescription",
      title: "Descrizione hero",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().min(10).max(400),
    }),
    defineField({
      name: "heroCta",
      title: "CTA hero",
      type: "link",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroSlides",
      title: "Slide hero",
      type: "array",
      of: [{ type: "heroSlide" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "stats",
      title: "Statistiche",
      type: "array",
      of: [{ type: "statItem" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "styleSectionLabel",
      title: "Etichetta sezione stile",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(60),
    }),
    defineField({
      name: "styleSectionTitle",
      title: "Titolo sezione stile",
      type: "string",
      validation: (Rule) => Rule.required().min(4).max(140),
    }),
    defineField({
      name: "styleSectionDescription",
      title: "Descrizione sezione stile",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().min(20).max(420),
    }),
    defineField({
      name: "styleTags",
      title: "Tag stile",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "spotlightCards",
      title: "Card spotlight",
      type: "array",
      of: [{ type: "spotlightCard" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "bottomBannerDescription",
      title: "Descrizione box finale",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().min(10).max(400),
    }),
    defineField({
      name: "bottomCta",
      title: "CTA box finale",
      type: "link",
      validation: (Rule) => Rule.required(),
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
        title: "Homepage",
        subtitle: "Hero, statistiche, spotlight e SEO",
      };
    },
  },
});
