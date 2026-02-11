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
    defineField({
      name: "tasks",
      title: "Task per Candidatura",
      description:
        "Elenco ordinabile dei task/competenze che il candidato deve autovalutare.",
      type: "array",
      of: [
        defineField({
          name: "task",
          title: "Task",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Nome Task",
              type: "string",
              validation: (Rule) => Rule.required().min(2).max(120),
            }),
            defineField({
              name: "required",
              title: "Obbligatorio",
              type: "boolean",
              initialValue: true,
              description:
                "Se attivo, il candidato non puo lasciare 'Nessuna conoscenza' su questo task.",
            }),
            defineField({
              name: "order",
              title: "Ordine",
              type: "number",
              description:
                "Ordine manuale opzionale (i valori piu piccoli appaiono prima).",
            }),
          ],
          preview: {
            select: {
              title: "label",
              required: "required",
              order: "order",
            },
            prepare(selection) {
              const suffix = selection.required ? "Obbligatorio" : "Opzionale";
              const orderPrefix =
                typeof selection.order === "number"
                  ? `${selection.order}. `
                  : "";
              return {
                title: `${orderPrefix}${selection.title || "Task senza titolo"}`,
                subtitle: suffix,
              };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
});
