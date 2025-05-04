import { unstable_ViewTransition as ViewTransition } from "react";
import PostCardSkeleton from "@/features/posts/post-card-skeleton";
import PostsWrapper from "@/features/posts/posts-wrapper";

export default function Loading() {
  return (
    <ViewTransition>
      <main className="container space-y-8 px-4 pt-8 pb-20">
        <h1 className="text-5xl">Hírek</h1>
        <PostsWrapper>
          {[...Array(12)].map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </PostsWrapper>
      </main>
    </ViewTransition>
  );
}
