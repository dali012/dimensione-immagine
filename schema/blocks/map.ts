import { defineType, defineField } from "sanity";

export const mapType = defineType({
  name: "map",
  title: "Map",
  type: "object",
  fields: [
    defineField({ name: "lat", title: "Latitude", type: "number" }),
    defineField({ name: "lng", title: "Longitude", type: "number" }),
  ],
});
