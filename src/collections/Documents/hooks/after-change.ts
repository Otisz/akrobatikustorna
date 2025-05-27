import type { Document } from "@/types/payload";
import { revalidatePath } from "next/cache";
import type { CollectionAfterChangeHook } from "payload";

const afterChange: CollectionAfterChangeHook<Document> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath("/dokumentumok");
  }

  return doc;
};

export default afterChange;
