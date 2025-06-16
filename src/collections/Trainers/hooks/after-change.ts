import type { Trainer } from "@/types/payload";
import { revalidatePath } from "next/cache";
import type { CollectionAfterChangeHook } from "payload";

const afterChange: CollectionAfterChangeHook<Trainer> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath("/edzok");
    revalidatePath(`/edzok/${doc.slug}`);
  }

  return doc;
};

export default afterChange;
