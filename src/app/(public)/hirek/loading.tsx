import PostCardSkeleton from "@/features/posts/post-card-skeleton";
import PostsWrapper from "@/features/posts/posts-wrapper";
import { unstable_ViewTransition as ViewTransition } from "react";

export default function Loading() {
  return (
    <ViewTransition>
      <main className="container space-y-8 px-4 pt-8 pb-20">
        <h1 className="text-5xl">Hírek</h1>
        <PostsWrapper>
          {[...Array(12)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: No other key is available
            <PostCardSkeleton key={i} />
          ))}
        </PostsWrapper>
      </main>
    </ViewTransition>
  );
}
