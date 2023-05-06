import { Studio } from "@/app/(admin)/studio/[[...index]]/Studio";

export { metadata } from "next-sanity/studio/metadata";

export default function StudioPage() {
  return <Studio />;
}
