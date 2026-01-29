import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schema";
import { codeInput } from "@sanity/code-input";

export default defineConfig({
  name: "default",
  title: "Company Website",

  projectId: "zqo9eojr",
  dataset: "production",

  plugins: [structureTool(), visionTool(), codeInput()],

  schema: {
    types: schemaTypes,
  },
});
