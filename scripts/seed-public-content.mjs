import { createClient } from "@sanity/client";
import { randomUUID } from "node:crypto";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  aboutPageFallback,
  catalogItemsFallback,
  catalogPageFallback,
  contactPageFallback,
  homePageFallback,
  locationsPageFallback,
  siteSettingsFallback,
  storeLocationsFallback,
} from "../sanity/publicContentFallbacks.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");
const envFilePath = path.join(projectRoot, ".env");

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;

  if (typeof process.loadEnvFile === "function") {
    process.loadEnvFile(filePath);
    return;
  }

  const lines = readFileSync(filePath, "utf8").split(/\r?\n/u);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex < 1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    if (!key || process.env[key]) continue;

    let value = trimmed.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

loadEnvFile(envFilePath);

const projectId = process.env.SANITY_PROJECT_ID || "zqo9eojr";
const dataset = process.env.SANITY_DATASET || "production";
const token = process.env.SANITY_AUTH_TOKEN;

if (!token) {
  console.error("Missing SANITY_AUTH_TOKEN.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  token,
});

const contentTypeByExtension = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
};

const imageCache = new Map();
const fileCache = new Map();

const getContentType = (source) => {
  const extension = path.extname(source).toLowerCase();
  return contentTypeByExtension[extension] || "application/octet-stream";
};

const buildLocalPath = (source) =>
  path.join(publicDir, source.replace(/^\/+/, "").replace(/\//g, path.sep));

async function uploadAsset(kind, source) {
  const cache = kind === "image" ? imageCache : fileCache;
  if (!source) return null;
  if (cache.has(source)) return cache.get(source);

  let uploaded;
  if (/^https?:\/\//i.test(source)) {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`Failed to download remote asset: ${source}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    uploaded = await client.assets.upload(kind, buffer, {
      filename: path.basename(new URL(source).pathname) || `${kind}-${Date.now()}`,
      contentType: response.headers.get("content-type") || getContentType(source),
    });
  } else {
    const filePath = buildLocalPath(source);
    if (!existsSync(filePath)) {
      console.warn(`Skipping missing local ${kind} asset: ${filePath}`);
      return null;
    }

    uploaded = await client.assets.upload(kind, createReadStream(filePath), {
      filename: path.basename(filePath),
      contentType: getContentType(source),
    });
  }

  cache.set(source, uploaded);
  return uploaded;
}

async function buildImageField(image) {
  if (!image?.src) return undefined;
  const asset = await uploadAsset("image", image.src);
  if (!asset) return undefined;
  return {
    _type: "imageWithAlt",
    alt: image.alt,
    caption: image.caption || "",
    image: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
    },
  };
}

async function buildVideoField(video) {
  if (!video?.src) return undefined;
  const asset = await uploadAsset("file", video.src);
  if (!asset) return undefined;
  return {
    _type: "videoWithPoster",
    video: {
      _type: "file",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
    },
    poster: await buildImageField(video.poster),
    mobilePoster: await buildImageField(video.mobilePoster),
  };
}

const withKey = (value, type) => ({
  _key: randomUUID(),
  _type: type,
  ...value,
});

async function buildSeoFields(seo) {
  return {
    _type: "seoFields",
    title: seo.title || "",
    description: seo.description || "",
    noIndex: Boolean(seo.noIndex),
    image: await buildImageField(seo.image),
  };
}

async function buildSingletonDocuments() {
  return [
    {
      _id: "siteSettings",
      _type: "siteSettings",
      ...siteSettingsFallback,
      logo: await buildImageField(siteSettingsFallback.logo),
      navigationItems: siteSettingsFallback.navigationItems.map((item) =>
        withKey(item, "navigationItem"),
      ),
      officeHours: siteSettingsFallback.officeHours.map((item) =>
        withKey(item, "businessHours"),
      ),
      socialLinks: siteSettingsFallback.socialLinks.map((item) =>
        withKey(item, "socialLink"),
      ),
      defaultSeo: await buildSeoFields(siteSettingsFallback.defaultSeo),
    },
    {
      _id: "homePage",
      _type: "homePage",
      ...homePageFallback,
      heroCta: { _type: "link", ...homePageFallback.heroCta },
      heroSlides: await Promise.all(
        homePageFallback.heroSlides.map(async (item) => ({
          _key: randomUUID(),
          _type: "heroSlide",
          mediaType: item.mediaType,
          image: await buildImageField(item.image),
          video: await buildVideoField(item.video),
        })),
      ),
      stats: homePageFallback.stats.map((item) => withKey(item, "statItem")),
      spotlightCards: await Promise.all(
        homePageFallback.spotlightCards.map(async (item) => ({
          _key: randomUUID(),
          _type: "spotlightCard",
          eyebrow: item.eyebrow || "",
          title: item.title,
          description: item.description,
          mood: item.mood,
          image: await buildImageField(item.image),
          cta: item.cta ? { _type: "link", ...item.cta } : undefined,
        })),
      ),
      bottomCta: { _type: "link", ...homePageFallback.bottomCta },
      seo: await buildSeoFields(homePageFallback.seo),
    },
    {
      _id: "aboutPage",
      _type: "aboutPage",
      ...aboutPageFallback,
      stats: aboutPageFallback.stats.map((item) => withKey(item, "statItem")),
      values: aboutPageFallback.values.map((item) => withKey(item, "aboutValue")),
      seo: await buildSeoFields(aboutPageFallback.seo),
    },
    {
      _id: "locationsPage",
      _type: "locationsPage",
      ...locationsPageFallback,
      seo: await buildSeoFields(locationsPageFallback.seo),
    },
    {
      _id: "contactPage",
      _type: "contactPage",
      ...contactPageFallback,
      heroImage: await buildImageField(contactPageFallback.heroImage),
      seo: await buildSeoFields(contactPageFallback.seo),
    },
    {
      _id: "catalogPage",
      _type: "catalogPage",
      ...catalogPageFallback,
      filterDescriptions: catalogPageFallback.filterDescriptions.map((item) =>
        withKey(item, "filterDescriptionGroup"),
      ),
      seo: await buildSeoFields(catalogPageFallback.seo),
    },
  ];
}

async function buildStoreDocuments() {
  return Promise.all(
    storeLocationsFallback.map(async (item) => ({
      _id: `storeLocation-${item.id}`,
      _type: "storeLocation",
      name: item.name,
      ownershipType: item.ownershipType,
      region: item.region,
      city: item.city,
      mapUrl: item.mapUrl,
      address: item.address,
      image: await buildImageField(item.image),
      phone: item.phone || "",
      hours: item.hours.map((hour) => withKey(hour, "businessHours")),
      latitude: item.latitude,
      longitude: item.longitude,
      markerOffsetX: item.markerOffsetX || 0,
      markerOffsetY: item.markerOffsetY || 0,
      displayOrder: item.displayOrder,
      active: item.active,
    })),
  );
}

async function buildCatalogDocuments() {
  return Promise.all(
    catalogItemsFallback.map(async (item) => ({
      _id: `catalogItem-${item.id}`,
      _type: "catalogItem",
      category: item.category,
      title: item.title,
      caption: item.caption || "",
      image: await buildImageField(item.image),
      displayOrder: item.displayOrder,
      active: item.active,
    })),
  );
}

async function main() {
  console.log(`Seeding Sanity content into ${projectId}/${dataset}...`);

  const singletonDocuments = await buildSingletonDocuments();
  const storeDocuments = await buildStoreDocuments();
  const catalogDocuments = await buildCatalogDocuments();

  const documents = [
    ...singletonDocuments,
    ...storeDocuments,
    ...catalogDocuments,
  ];

  for (const document of documents) {
    await client.createOrReplace(document);
    console.log(`Upserted ${document._id}`);
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

