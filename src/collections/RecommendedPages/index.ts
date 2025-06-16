import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";
import afterChange from "@/collections/RecommendedPages/hooks/after-change";
import afterDelete from "@/collections/RecommendedPages/hooks/after-delete";
import type { CollectionConfig } from "payload";

export const RecommendedPages: CollectionConfig = {
  slug: "recommended-pages",
  labels: {
    singular: "Ajánlott oldal",
    plural: "Ajánlott oldalak",
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
      name: "href",
      label: "Link",
      type: "text",
      required: true,
    },
  ],
  hooks: {
    afterChange: [afterChange],
    afterDelete: [afterDelete],
  },
};
