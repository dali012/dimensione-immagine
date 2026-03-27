import { defineField, defineType } from "sanity";

export const contactPageType = defineType({
  name: "contactPage",
  title: "Contatti",
  type: "document",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Titolo hero",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(120),
    }),
    defineField({
      name: "heroAccent",
      title: "Titolo hero evidenziato",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Sottotitolo hero mobile",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(10).max(220),
    }),
    defineField({
      name: "heroImage",
      title: "Immagine hero",
      type: "imageWithAlt",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroCtaLabel",
      title: "Etichetta CTA hero",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: "formLabel",
      title: "Etichetta form",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "formTitle",
      title: "Titolo form",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(120),
    }),
    defineField({
      name: "formDescription",
      title: "Descrizione form",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: "locationBlockTitle",
      title: "Titolo blocco indirizzo",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "locationLinkLabel",
      title: "Etichetta link mappa",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phoneBlockTitle",
      title: "Titolo blocco telefono",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phoneLinkLabel",
      title: "Etichetta link WhatsApp",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "emailBlockTitle",
      title: "Titolo blocco email",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "hoursBlockTitle",
      title: "Titolo blocco orari",
      type: "string",
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
        title: "Contatti",
        subtitle: "Hero, testi form e etichette blocchi contatto",
      };
    },
  },
});
