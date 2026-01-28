import { defineType, defineField } from "sanity";

export const chartType = defineType({
  name: "chart",
  title: "Chart",
  type: "object",
  fields: [
    defineField({
      name: "data",
      title: "Chart Data (JSON)",
      type: "text",
    }),
  ],
});
