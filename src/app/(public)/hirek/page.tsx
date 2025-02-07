import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getPayload } from "payload";

import { Button } from "@/components/ui/button";
import Link from "@/components/ui/link";
import PostCard from "@/features/posts/post-card";
import PostsWrapper from "@/features/posts/posts-wrapper";
import { cn } from "@/lib/utils";
import type { Post as PostType } from "@/types/payload";
import config from "@payload-config";

export const revalidate = 86_400;

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata: Metadata = {
  title: "Hírek",
  description: "Hírek - Budai Akrobatikus Sport Egyesület",
};

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const { page = 1 } = searchParams;

  const posts = await queryPosts({ page: +page });

  let imageCount = 0;

  return (
    <main>
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pt-8 pb-20 sm:px-6">
        <h1 className="text-5xl">Hírek</h1>
        <div className="flex flex-wrap justify-center gap-4">
          <PostsWrapper>
            {posts.docs.map((post) => (
              <PostCard key={post.slug} post={post as PostType} loading={imageCount++ < 9 ? "eager" : "lazy"} />
            ))}
          </PostsWrapper>
        </div>
        <div className={cn("flex", [posts.hasPrevPage ? "justify-between" : "justify-end"])}>
          {posts.hasPrevPage ? (
            <div className="space-x-4">
              <Button asChild variant="outline">
                <Link href={{ pathname: "/hirek", query: { page: undefined } }}>« Legújabbak</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={{ pathname: "/hirek", query: { page: +page - 1 } }}>« Újabbak</Link>
              </Button>
            </div>
          ) : null}
          <div>
            {posts.hasNextPage ? (
              <Button asChild variant="outline">
                <Link href={{ pathname: "/hirek", query: { page: +page + 1 } }}>Régebbiek »</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}

const queryPosts = async ({ page }: { page: number }) => {
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
    limit: 18,
    page,
  });
};
