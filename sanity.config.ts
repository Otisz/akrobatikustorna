import { schemaTypes } from "./schemas";
import Logo from "@/components/sanity/Logo";
import StudioNavbar from "@/components/sanity/StudioNavbar";
import { colorInput } from "@sanity/color-input";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  name: "default",
  title: "BASE Studio",

  basePath: "/studio",

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S, context) => {
        return S.list()
          .title("Kategóriák")
          .items([
            S.listItem()
              .title("Hírek")
              .schemaType("news")
              .id("news")
              .child(S.documentList().title("Hírek").filter('_type == "news"')),
            orderableDocumentListDeskItem({
              id: "trainers",
              type: "trainers",
              title: "Edzők",
              S,
              context,
            }),
          ]);
      },
    }),
    visionTool(),
    colorInput(),
  ],

  studio: {
    components: {
      logo: Logo,
      navbar: StudioNavbar,
    },
  },

  schema: {
    types: schemaTypes,
  },
});
