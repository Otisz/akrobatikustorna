import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import PostCard from "@/featuers/posts/post-card";
import PostsWrapper from "@/featuers/posts/posts-wrapper";
import AppLayout from "@/layouts/app-layout";
import { cn } from "@/lib/utils";
import type { Pagination, Post, SharedData } from "@/types";

export default function Page(props: SharedData<{ posts: Pagination<Omit<Post, "content">> }>) {
  let imageCount = 0;

  return (
    <AppLayout>
      <Head title="Hírek"></Head>
      <main className="container space-y-8 px-4 pt-8 pb-20">
        <h1 className="text-5xl">Hírek</h1>
        <div className="flex flex-wrap justify-center gap-4">
          <PostsWrapper>
            {props.posts.data.map((post) => (
              <PostCard key={post.slug} post={post} loading={imageCount++ < 9 ? "eager" : "lazy"} />
            ))}
          </PostsWrapper>
        </div>
        <div className={cn("flex", [props.posts.prev_page_url ? "justify-between" : "justify-end"])}>
          {props.posts.prev_page_url ? (
            <div className="space-x-4">
              <Button asChild variant="outline">
                <Link href={props.posts.path}>« Legújabbak</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={props.posts.prev_page_url}>« Újabbak</Link>
              </Button>
            </div>
          ) : null}
          <div>
            {props.posts.next_page_url ? (
              <Button asChild variant="outline">
                <Link href={props.posts.next_page_url}>Régebbiek »</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
