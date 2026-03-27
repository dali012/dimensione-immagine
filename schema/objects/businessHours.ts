import { defineField, defineType } from "sanity";

export const businessHoursType = defineType({
  name: "businessHours",
  title: "Riga orari",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Giorni / fascia",
      type: "string",
      description: "Esempio: Lun-Sab, Dom, Festivi.",
      validation: (Rule) => Rule.required().min(1).max(80),
    }),
    defineField({
      name: "value",
      title: "Orari / descrizione",
      type: "string",
      description: "Esempio: 9:00-20:00 oppure Consulta Google Maps.",
      validation: (Rule) => Rule.required().min(1).max(120),
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "value",
    },
  },
});
