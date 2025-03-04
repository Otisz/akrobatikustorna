import { revalidatePath, revalidateTag } from "next/cache";
import type { CollectionAfterDeleteHook } from "payload";

import type { Post } from "@/types/payload";

const afterDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/hirek/${doc?.slug}`;

    revalidatePath("/");
    revalidatePath("/hirek");
    revalidatePath(path);
    revalidateTag("posts-sitemap");
  }

  return doc;
};

export default afterDelete;
