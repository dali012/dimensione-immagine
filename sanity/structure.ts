import type { StructureBuilder } from "sanity/structure";

export const singletonTypes = new Set([
  "siteSettings",
  "homePage",
  "aboutPage",
  "locationsPage",
  "contactPage",
  "catalogPage",
]);

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title("Contenuti")
    .items([
      S.listItem()
        .title("Impostazioni sito")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("Homepage")
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("Chi siamo")
        .id("aboutPage")
        .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
      S.listItem()
        .title("Negozi & Sedi")
        .id("locationsPage")
        .child(
          S.document().schemaType("locationsPage").documentId("locationsPage"),
        ),
      S.listItem()
        .title("Contatti")
        .id("contactPage")
        .child(S.document().schemaType("contactPage").documentId("contactPage")),
      S.listItem()
        .title("Trovi da noi")
        .id("catalogPage")
        .child(S.document().schemaType("catalogPage").documentId("catalogPage")),
      S.divider(),
      S.documentTypeListItem("storeLocation").title("Negozi"),
      S.documentTypeListItem("catalogItem").title("Catalogo"),
      S.documentTypeListItem("jobPosition").title("Posizioni aperte"),
    ]);
