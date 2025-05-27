import PostCard from "@/features/posts/post-card";
import type { Post as PostType } from "@/types/payload";
import config from "@payload-config";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import { cache } from "react";

export default async function Posts() {
  const posts = await queryPosts();

  return (
    <>
      {posts.docs.map((post) => (
        <PostCard key={post.slug} post={post as PostType} loading="lazy" />
      ))}
    </>
  );
}

const queryPosts = cache(async () => {
  const { isEnabled: draft } = await draftMode();

  const payload = await getPayload({ config });

  return await payload.find({
    collection: "posts",
    draft,
    overrideAccess: draft,
    select: {
      title: true,
      slug: true,
      picture: true,
      excerpt: true,
      publishedAt: true,
    },
    where: {
      publishedAt: {
        not_equals: null,
      },
    },
    limit: 6,
  });
});
