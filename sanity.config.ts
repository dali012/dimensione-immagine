import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schema";
import { codeInput } from "@sanity/code-input";

export default defineConfig({
  name: "default",
  title: "Company Website",

  projectId: "ecqi0wpl",
  dataset: "production",

  plugins: [structureTool(), visionTool(), codeInput()],

  schema: {
    types: schemaTypes,
  },
});
