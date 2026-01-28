import { defineType, defineField } from "sanity";

export const timelineType = defineType({
  name: "timeline",
  title: "Timeline",
  type: "object",
  fields: [
    defineField({
      name: "events",
      title: "Events",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "date", title: "Date", type: "string" },
            { name: "title", title: "Title", type: "string" },
          ],
        },
      ],
    }),
  ],
});
