import { defineType, defineField } from "sanity";

export const callToActionType = defineType({
  name: "callToAction",
  title: "Call To Action",
  type: "object",
  fields: [
    defineField({ name: "text", title: "Text", type: "string" }),
    defineField({ name: "url", title: "URL", type: "url" }),
  ],
});
