import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "zqo9eojr",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});
