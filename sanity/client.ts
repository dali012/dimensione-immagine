import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "ecqi0wpl",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});
