import type { RecommendedPage } from "@/types/payload";
import { revalidatePath } from "next/cache";
import type { CollectionAfterDeleteHook } from "payload";

const afterDelete: CollectionAfterDeleteHook<RecommendedPage> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath("/ajanlott-oldalak");
  }

  return doc;
};

export default afterDelete;
