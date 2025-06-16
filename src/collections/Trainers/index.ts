import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";
import afterChange from "@/collections/Trainers/hooks/after-change";
import afterDelete from "@/collections/Trainers/hooks/after-delete";
import { slugField } from "@/fields/slug";
import { FixedToolbarFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload";

export const Trainers: CollectionConfig = {
  slug: "trainers",
  labels: {
    singular: "Edző",
    plural: "Edzők",
  },
  admin: {
    defaultColumns: ["name", "position", "order"],
    useAsTitle: "name",
    group: "Tartalmak",
  },
  defaultSort: "order",
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: "name",
      label: "Név",
      type: "text",
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
      name: "position",
      label: "Pozíció",
      type: "text",
      required: true,
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
      name: "order",
      label: "Sorrend",
      type: "number",
      admin: {
        position: "sidebar",
      },
    },
    ...slugField("name"),
  ],
  hooks: {
    afterChange: [afterChange],
    afterDelete: [afterDelete],
  },
};
