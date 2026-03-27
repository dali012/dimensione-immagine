import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Impostazioni sito",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Nome sito",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: "siteUrl",
      title: "URL sito",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "imageWithAlt",
    }),
    defineField({
      name: "navigationItems",
      title: "Menu principale",
      type: "array",
      of: [{ type: "navigationItem" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "primaryPhone",
      title: "Telefono principale",
      type: "string",
    }),
    defineField({
      name: "primaryWhatsapp",
      title: "Numero WhatsApp",
      type: "string",
    }),
    defineField({
      name: "primaryEmail",
      title: "Email principale",
      type: "string",
      validation: (Rule) =>
        Rule.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
          name: "email",
          invert: false,
        }),
    }),
    defineField({
      name: "primaryMapUrl",
      title: "URL Google Maps",
      type: "url",
    }),
    defineField({
      name: "primaryAddressLine1",
      title: "Indirizzo",
      type: "string",
    }),
    defineField({
      name: "primaryPostalCode",
      title: "CAP",
      type: "string",
    }),
    defineField({
      name: "primaryCity",
      title: "Citta",
      type: "string",
    }),
    defineField({
      name: "primaryRegionCode",
      title: "Sigla provincia / regione",
      type: "string",
    }),
    defineField({
      name: "primaryCountryCode",
      title: "Paese",
      type: "string",
      initialValue: "IT",
    }),
    defineField({
      name: "officeHours",
      title: "Orari principali",
      type: "array",
      of: [{ type: "businessHours" }],
    }),
    defineField({
      name: "areaServed",
      title: "Area servita",
      type: "string",
    }),
    defineField({
      name: "priceRange",
      title: "Fascia prezzo schema.org",
      type: "string",
      description: "Esempio: EUR, EUR EUR oppure EUR EUR EUR.",
    }),
    defineField({
      name: "socialLinks",
      title: "Social",
      type: "array",
      of: [{ type: "socialLink" }],
    }),
    defineField({
      name: "legalCompanyName",
      title: "Ragione sociale",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "vatNumber",
      title: "Partita IVA",
      type: "string",
    }),
    defineField({
      name: "codiceUnivoco",
      title: "Codice univoco",
      type: "string",
    }),
    defineField({
      name: "footerNewsletterTitle",
      title: "Titolo newsletter footer",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(160),
    }),
    defineField({
      name: "footerNewsletterDescription",
      title: "Descrizione newsletter footer",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(10).max(320),
    }),
    defineField({
      name: "footerNewsletterDisclaimer",
      title: "Disclaimer newsletter footer",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(10).max(320),
    }),
    defineField({
      name: "defaultSeo",
      title: "SEO globale",
      type: "seoFields",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Impostazioni sito",
        subtitle: "Brand, contatti, footer, SEO e navigazione",
      };
    },
  },
});
