import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  groups: [
    { name: "content", title: "Content" },
    { name: "meta", title: "Metadata" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().min(5).max(150),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      description:
        "Short summary used as meta description when SEO description is not provided.",
      validation: (Rule) => Rule.max(320),
      group: "content",
    }),

    defineField({
      name: "heroImage",
      title: "Hero / Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (Rule) => Rule.required().max(250),
        }),
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
        }),
        defineField({
          name: "credit",
          title: "Credit",
          type: "string",
        }),
      ],
      group: "content",
    }),

    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      group: "meta",
    }),

    defineField({
      name: "updatedAt",
      title: "Updated at",
      type: "datetime",
      group: "meta",
    }),

    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (Rule) => Rule.required(),
      group: "meta",
    }),

    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      description:
        "Primary category and other categories (useful for taxonomy & breadcrumbs).",
      group: "meta",
    }),

    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "meta",
    }),

    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          fields: [
            { name: "caption", type: "string" },
            { name: "alt", type: "string" },
          ],
        },
        { type: "code" },
      ],
      validation: (Rule) => Rule.required(),
      group: "content",
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      description:
        "SEO metadata. If a field is blank we fall back to title/excerpt/heroImage.",
      group: "meta",
      fields: [
        defineField({
          name: "seoTitle",
          title: "SEO Title",
          type: "string",
          description: "Prefer 50–70 chars. Will be used for <title>.",
          validation: (Rule) => Rule.max(70),
        }),
        defineField({
          name: "seoDescription",
          title: "SEO Description",
          type: "text",
          description:
            "Prefer 120–160 chars. Will be used for meta description.",
          validation: (Rule) => Rule.max(320),
        }),
        defineField({
          name: "canonicalUrl",
          title: "Canonical URL",
          type: "url",
          description:
            "If empty, the frontend should build canonical from site URL + slug.",
        }),
        defineField({
          name: "noIndex",
          title: "No index",
          type: "boolean",
          description: "Check to prevent indexing (robots noindex).",
          initialValue: false,
        }),
        defineField({
          name: "openGraphImage",
          title: "Open Graph image",
          type: "image",
          description:
            "Optional custom image for Facebook/OG. If empty we use heroImage.",
          options: { hotspot: true },
          fields: [{ name: "alt", title: "Alt text", type: "string" }],
        }),
        defineField({
          name: "twitterImage",
          title: "Twitter Card image",
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", title: "Alt text", type: "string" }],
        }),
      ],
    }),

    defineField({
      name: "schemaType",
      title: "Schema type",
      type: "string",
      options: {
        list: [
          { title: "BlogPosting (recommended)", value: "BlogPosting" },
          { title: "Article", value: "Article" },
          { title: "NewsArticle", value: "NewsArticle" },
        ],
        layout: "radio",
      },
      initialValue: "BlogPosting",
      group: "meta",
    }),

    defineField({
      name: "draft",
      title: "Draft",
      type: "boolean",
      description: "Mark as draft to prevent publishing.",
      initialValue: false,
      group: "meta",
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "publishedAt",
      author: "author.name",
      media: "heroImage",
    },
    prepare({ title, subtitle, author, media }: any) {
      return {
        title,
        subtitle: subtitle
          ? `${new Date(subtitle).toLocaleDateString()} • ${author ?? ""}`
          : "Draft",
        media,
      };
    },
  },
});
