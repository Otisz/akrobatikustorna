import { RichText } from "@payloadcms/richtext-lexical/react";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import React, { cache } from "react";

import { Media } from "@/types/payload";
import config from "@payload-config";

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const posts = await payload.find({
    collection: "posts",
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  });

  return posts.docs.map(({ slug }) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Home(props: Props) {
  const params = await props.params;
  const { slug = "" } = params;
  const post = await queryPostBySlug({ slug });

  if (!post) notFound();

  return (
    <main>
      <div className="mx-auto max-w-4xl p-6 lg:px-8">
        <article>
          <header className="flex flex-col">
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">{post.title}</h1>
            <time
              dateTime={post.publishedAt!}
              className="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500"
            >
              <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
              <span className="ml-3">{new Date(post.publishedAt!).toLocaleDateString("hu")}</span>
            </time>
          </header>
          <div className="prose mt-8 marker:text-primary prose-a:text-primary prose-img:rounded-xl prose-img:shadow">
            <p>{post.excerpt}</p>

            <Image
              src={(post.picture as Media).url!}
              alt={(post.picture as Media).alt}
              width={(post.picture as Media).width!}
              height={(post.picture as Media).height!}
              className="not-prose w-full rounded-xl bg-gray-100 object-cover object-center"
            />

            <RichText data={post.content} />
          </div>
        </article>
      </div>
    </main>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug = "" } = await props.params;
  const post = await queryPostBySlug({ slug });

  return {
    title: `${post.title}`,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: `${post.title} - Budai Akrobatikus Sport Egyesület`,
      description: `${post.excerpt}`,
      images: (post.picture as Media).url!,
    },
    twitter: {
      title: `${post.title} - Budai Akrobatikus Sport Egyesület`,
      description: `${post.excerpt}`,
      images: (post.picture as Media).url!,
    },
  };
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode();

  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "posts",
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          publishedAt: {
            not_equals: null,
          },
        },
      ],
    },
  });

  return result.docs?.[0] || null;
});
