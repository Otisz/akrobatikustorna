import path from "node:path";
import { fileURLToPath } from "node:url";
import { Documents } from "@/collections/Documents";
import { Media } from "@/collections/Media";
import { Posts } from "@/collections/Posts";
import { RecommendedPages } from "@/collections/RecommendedPages";
import { Users } from "@/collections/Users";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { en } from "@payloadcms/translations/languages/en";
import { hu } from "@payloadcms/translations/languages/hu";
import { buildConfig } from "payload";
import sharp from "sharp";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  routes: {
    admin: "/studio",
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Posts, Documents, RecommendedPages],
  i18n: {
    supportedLanguages: { en, hu },
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "src/types/payload.d.ts"),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "",
      authToken: process.env.TURSO_API_KEY || undefined,
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.R2_BUCKET || "",
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
        },
        region: "auto",
        endpoint: process.env.R2_ENDPOINT || "",
      },
    }),
  ],
  upload: {
    limits: {
      fileSize: 5_000_000, // 5MB, written in bytes
    },
  },
});
