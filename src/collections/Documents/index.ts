import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";
import afterChange from "@/collections/Documents/hooks/after-change";
import afterDelete from "@/collections/Documents/hooks/after-delete";
import type { CollectionConfig } from "payload";

export const Documents: CollectionConfig = {
  slug: "documents",
  labels: {
    singular: "Dokumentum",
    plural: "Dokumentumok",
  },
  admin: {
    useAsTitle: "title",
    group: "Tartalmak",
  },
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: "title",
      label: "Cím",
      type: "text",
      required: true,
    },
    {
      name: "document",
      label: "Fájl",
      type: "upload",
      relationTo: "media",
      required: true,
    },
  ],
  hooks: {
    afterChange: [afterChange],
    afterDelete: [afterDelete],
  },
};
