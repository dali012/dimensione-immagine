import { client } from "./client";
import type { BlogPost as BlogPostType } from "../types";

function blocksToPlainText(blocks: any[] = []) {
  return blocks
    .map((blk) => {
      if (!blk) return "";
      if (blk._type === "block" && Array.isArray(blk.children)) {
        return blk.children.map((c: any) => c.text).join("");
      }
      return "";
    })
    .join("\n\n");
}

export async function getAllPosts(): Promise<BlogPostType[]> {
  const query = `*[_type == "post" && !(_id in path('drafts.**'))] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    content,
    "imageUrl": heroImage.asset->url,
    publishedAt,
    updatedAt,
    "author": author->name,
    "categories": categories[]->title,
    tags
  }`;

  const items = await client.fetch(query);

  return (items || []).map((it: any) => ({
    id: it._id,
    slug: it.slug,
    title: it.title,
    excerpt: it.excerpt || "",
    content: it.content || [],
    imageUrl: it.imageUrl || "",
    date: it.publishedAt || it.updatedAt || "",
    author: it.author || "",
    category:
      (it.categories && it.categories[0]) || (it.tags && it.tags[0]) || "",
    tags: it.tags || [],
    // helper used by the blog list search
    _plainText: blocksToPlainText(it.content),
  }));
}

export async function getPostBySlug(
  slug: string,
): Promise<BlogPostType | null> {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    content,
    "imageUrl": heroImage.asset->url,
    publishedAt,
    updatedAt,
    "author": author->name,
    "categories": categories[]->title,
    tags
  }`;

  const it = await client.fetch(query, { slug });
  if (!it) return null;

  return {
    id: it._id,
    slug: it.slug,
    title: it.title,
    excerpt: it.excerpt || "",
    content: it.content || [],
    imageUrl: it.imageUrl || "",
    date: it.publishedAt || it.updatedAt || "",
    author: it.author || "",
    category:
      (it.categories && it.categories[0]) || (it.tags && it.tags[0]) || "",
    tags: it.tags || [],
  };
}

export default { getAllPosts, getPostBySlug };
