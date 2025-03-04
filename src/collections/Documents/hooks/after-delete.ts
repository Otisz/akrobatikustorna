import { revalidatePath } from "next/cache";
import type { CollectionAfterDeleteHook } from "payload";

import type { Document } from "@/types/payload";

const afterDelete: CollectionAfterDeleteHook<Document> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath("/dokumentumok");
  }

  return doc;
};

export default afterDelete;
