import { FixedToolbarFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload";
import { authenticated } from "@/access/authenticated";
import { authenticatedOrPublished } from "@/access/authenticatedOrPublished";
import afterChange from "@/collections/Posts/hooks/after-change";
import afterDelete from "@/collections/Posts/hooks/after-delete";
import { slugField } from "@/fields/slug";

export const Posts: CollectionConfig<"posts"> = {
  slug: "posts",
  labels: {
    singular: "Bejegyzés",
    plural: "Bejegyzések",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    slug: true,
    title: true,
    excerpt: true,
    picture: true,
  },
  admin: {
    defaultColumns: ["title", "slug", "updatedAt"],
    useAsTitle: "title",
  },
  defaultSort: "-publishedAt",
  fields: [
    {
      name: "title",
      label: "Cím",
      type: "text",
      maxLength: 128,
      localized: true,
      required: true,
    },
    {
      name: "picture",
      label: "Kép",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "excerpt",
      label: "Kivonat",
      type: "text",
      maxLength: 150,
      required: true,
      localized: true,
    },
    {
      name: "content",
      label: "Tartalom",
      type: "richText",
      required: true,
      localized: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature()],
      }),
    },
    {
      name: "publishedAt",
      label: "Közzétéve",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
        position: "sidebar",
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === "published" && !value) {
              return new Date();
            }
            return value;
          },
        ],
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [afterChange],
    afterDelete: [afterDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
};
