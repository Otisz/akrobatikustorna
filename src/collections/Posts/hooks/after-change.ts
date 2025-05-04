import { revalidatePath, revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook } from "payload";
import type { Post } from "@/types/payload";

export const afterChange: CollectionAfterChangeHook<Post> = ({ doc, previousDoc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    if (doc._status === "published") {
      const path = `/hirek/${doc.slug}`;

      payload.logger.info(`Revalidating post at path: ${path}`);

      revalidatePath("/");
      revalidatePath("/hirek");
      revalidatePath(path);
      revalidateTag("posts-sitemap");
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === "published" && doc._status !== "published") {
      const oldPath = `/hirek/${previousDoc.slug}`;

      payload.logger.info(`Revalidating old post at path: ${oldPath}`);

      revalidatePath("/");
      revalidatePath("/hirek");
      revalidatePath(oldPath);
      revalidateTag("posts-sitemap");
    }
  }

  return doc;
};

export default afterChange;
