import { defineField, defineType } from "sanity";

export const jobPositionType = defineType({
  name: "jobPosition",
  title: "Posizioni aperte (Lavora con noi)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Posizione aperta",
      description:
        "Questo testo appare nel menu 'Posizione aperta' della pagina Lavora con noi.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "active",
      title: "Attiva",
      type: "boolean",
      initialValue: true,
      description: "Mostra o nasconde questa posizione nel form candidatura.",
    }),
    defineField({
      name: "tasks",
      title: "Competenze per la posizione",
      description:
        "Queste voci compaiono nello step 'Competenze per [posizione]' e vengono autovalutate dal candidato.",
      type: "array",
      of: [
        defineField({
          name: "task",
          title: "Competenza",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Nome competenza",
              description:
                "Esempio: Vendita assistita, Gestione cassa, Visual merchandising.",
              type: "string",
              validation: (Rule) => Rule.required().min(2).max(120),
            }),
            defineField({
              name: "required",
              title: "Obbligatoria per il candidato",
              type: "boolean",
              initialValue: true,
              description:
                "Se attiva, il candidato deve selezionare almeno 'Base' (non puo lasciare 'Nessuna conoscenza').",
            }),
            defineField({
              name: "order",
              title: "Ordine visualizzazione",
              type: "number",
              description:
                "Ordine manuale opzionale: i valori piu piccoli compaiono prima.",
            }),
          ],
          preview: {
            select: {
              title: "label",
              required: "required",
              order: "order",
            },
            prepare(selection) {
              const suffix = selection.required ? "Obbligatoria" : "Opzionale";
              const orderPrefix =
                typeof selection.order === "number"
                  ? `${selection.order}. `
                  : "";
              return {
                title: `${orderPrefix}${selection.title || "Competenza senza titolo"}`,
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
