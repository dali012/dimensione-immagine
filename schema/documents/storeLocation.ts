import { defineField, defineType } from "sanity";

export const storeLocationType = defineType({
  name: "storeLocation",
  title: "Negozio / sede",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nome negozio",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(120),
    }),
    defineField({
      name: "ownershipType",
      title: "Tipologia",
      type: "string",
      options: {
        list: [
          { title: "Sede diretta", value: "direct" },
          { title: "Franchising", value: "franchise" },
        ],
        layout: "radio",
      },
      initialValue: "direct",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "region",
      title: "Regione",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: "city",
      title: "Citta",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: "mapUrl",
      title: "Link Google Maps",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "address",
      title: "Indirizzo",
      type: "string",
      validation: (Rule) => Rule.required().min(4).max(200),
    }),
    defineField({
      name: "primaryImage",
      title: "Immagine principale",
      type: "imageWithAlt",
      description:
        "Questa immagine viene mostrata per prima sul sito nelle schede negozio.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "galleryImages",
      title: "Galleria immagini",
      type: "array",
      description:
        "Immagini aggiuntive sfogliabili nel dettaglio del negozio.",
      of: [{ type: "imageWithAlt" }],
      options: {
        layout: "grid",
      },
    }),
    defineField({
      name: "phone",
      title: "Telefono",
      type: "string",
    }),
    defineField({
      name: "hours",
      title: "Orari",
      type: "array",
      of: [{ type: "businessHours" }],
    }),
    defineField({
      name: "latitude",
      title: "Latitudine",
      type: "number",
      validation: (Rule) => Rule.required().min(-90).max(90),
    }),
    defineField({
      name: "longitude",
      title: "Longitudine",
      type: "number",
      validation: (Rule) => Rule.required().min(-180).max(180),
    }),
    defineField({
      name: "markerOffsetX",
      title: "Offset pin X",
      type: "number",
      description:
        "Valore opzionale in pixel per spostare il pin sulla mappa.",
    }),
    defineField({
      name: "markerOffsetY",
      title: "Offset pin Y",
      type: "number",
      description:
        "Valore opzionale in pixel per spostare il pin sulla mappa.",
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
      title: "name",
      subtitle: "city",
      media: "primaryImage.image",
      legacyMedia: "image.image",
      ownershipType: "ownershipType",
    },
    prepare(selection) {
      const subtitleParts = [selection.subtitle];
      if (selection.ownershipType === "franchise") {
        subtitleParts.push("Franchising");
      } else if (selection.ownershipType === "direct") {
        subtitleParts.push("Sede diretta");
      }

      return {
        title: selection.title,
        subtitle: subtitleParts.filter(Boolean).join(" - "),
        media: selection.media || selection.legacyMedia,
      };
    },
  },
});
