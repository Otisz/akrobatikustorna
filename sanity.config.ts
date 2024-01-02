import { schemaTypes } from "./schemas";
import Logo from "@/components/sanity/Logo";
import StudioNavbar from "@/components/sanity/StudioNavbar";
import { colorInput } from "@sanity/color-input";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  name: "default",
  title: "BASE Studio",

  basePath: "/studio",

  projectId,
  dataset,

  plugins: [deskTool(), visionTool(), colorInput()],

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
