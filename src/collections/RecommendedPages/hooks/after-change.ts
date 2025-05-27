import type { RecommendedPage } from "@/types/payload";
import { revalidatePath } from "next/cache";
import type { CollectionAfterChangeHook } from "payload";

const afterChange: CollectionAfterChangeHook<RecommendedPage> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath("/ajanlott-oldalak");
  }

  return doc;
};

export default afterChange;
