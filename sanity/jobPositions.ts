import { client } from "./client";

export async function getActiveJobPositions(): Promise<string[]> {
  const query = `*[_type == "jobPosition" && active == true]{
    _id,
    title
  }`;

  const items = await client.fetch(query);
  return (items || [])
    .map((it: any) => (it?.title || "").trim())
    .filter((t: string) => t.length > 0);
}
