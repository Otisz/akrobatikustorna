import type { CollectionConfig } from "payload";
import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    group: "Feltöltések",
  },
  fields: [
    {
      name: "alt",
      label: "Leírás",
      type: "text",
    },
  ],
  upload: {
    imageSizes: [
      {
        name: "thumbnail",
        width: 318,
        height: 219,
      },
    ],
  },
};
