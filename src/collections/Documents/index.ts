import type { CollectionConfig } from "payload";
import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";
import afterChange from "@/collections/Documents/hooks/after-change";
import afterDelete from "@/collections/Documents/hooks/after-delete";

export const Documents: CollectionConfig = {
  slug: "documents",
  labels: {
    singular: "Dokumentum",
    plural: "Dokumentumok",
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
  ],
  hooks: {
    afterChange: [afterChange],
    afterDelete: [afterDelete],
  },
  upload: true,
};
