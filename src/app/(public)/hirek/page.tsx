import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Image from "next/image";
import { getPayload } from "payload";

import { Button } from "@/components/ui/button";
import Link from "@/components/ui/link";
import { cn } from "@/lib/utils";
import { Media } from "@/types/payload";
import config from "@payload-config";

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

  return (
    <main>
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pb-20 pt-8 sm:px-6">
        <h1 className="text-5xl">Hírek</h1>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.docs.map((post) => (
              <article key={post.slug} className="relative flex flex-col items-start">
                <div className="relative w-full">
                  <Image
                    src={(post.picture as Media).url!}
                    alt={(post.picture as Media).alt}
                    width={384}
                    height={256}
                    className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover object-center sm:aspect-[2/1] lg:aspect-[3/2]"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div className="max-w-xl">
                  <div className="mt-8 flex items-center gap-x-4 text-xs">
                    <time dateTime={post.publishedAt!} className="text-gray-500">
                      {new Date(post.publishedAt!).toLocaleDateString("hu")}
                    </time>
                  </div>
                  <div className="group align-top">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-primary">
                      <Link href={`/hirek/${post.slug}`}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{post.excerpt}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
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
    limit: 12,
    page,
  });
};
