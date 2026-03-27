import { defineField, defineType } from "sanity";

const routeOptions = [
  { title: "Home (/)", value: "/" },
  { title: "Chi Siamo (/chi-siamo)", value: "/chi-siamo" },
  { title: "Cosa trovi da noi (/trovi-da-noi)", value: "/trovi-da-noi" },
  { title: "Negozi & Sedi (/sedi)", value: "/sedi" },
  { title: "Lavora con noi (/lavora-con-noi)", value: "/lavora-con-noi" },
  {
    title: "Distribuzione Ingrosso (/distribuzione-in-grosso)",
    value: "/distribuzione-in-grosso",
  },
  { title: "Contatti (/contatti)", value: "/contatti" },
];

export const navigationItemType = defineType({
  name: "navigationItem",
  title: "Voce navigazione",
  type: "object",
  fields: [
    defineField({
      name: "route",
      title: "Percorso",
      type: "string",
      options: {
        list: routeOptions,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "label",
      title: "Etichetta",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(60),
    }),
    defineField({
      name: "visible",
      title: "Visibile",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "route",
    },
  },
});
