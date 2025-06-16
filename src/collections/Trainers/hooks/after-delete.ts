import type { Trainer } from "@/types/payload";
import { revalidatePath } from "next/cache";
import type { CollectionAfterDeleteHook } from "payload";

const afterDelete: CollectionAfterDeleteHook<Trainer> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath("/edzok");
  }

  return doc;
};

export default afterDelete;
