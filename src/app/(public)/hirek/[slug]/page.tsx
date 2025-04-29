import config from "@payload-config";
import { type JSXConvertersFunction, RichText } from "@payloadcms/richtext-lexical/react";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import React, { cache } from "react";
import { unstable_ViewTransition as ViewTransition } from "react";
import type { Media as MediaType, Post as PostType } from "@/types/payload";

export const revalidate = 86_400;

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

  return (
    <ViewTransition>
      <main>
        <div className="mx-auto max-w-4xl p-6 lg:px-8">
          <article>
            <header className="flex flex-col">
              <ViewTransition name={`${post.slug}-title`}>
                <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">{post.title}</h1>
              </ViewTransition>
              <time dateTime={post.publishedAt!} className="order-first flex items-center">
                <span className="h-4 w-0.5 rounded-full bg-gray-600" />
                <span className="ml-3 text-base text-gray-600">
                  {new Date(post.publishedAt!).toLocaleDateString("hu")}
                </span>
              </time>
            </header>
            <div className="prose marker:text-primary prose-a:text-primary prose-img:rounded-xl prose-img:shadow-sm mt-8">
              <ViewTransition name={`${post.slug}-excerpt`}>
                <p>{post.excerpt}</p>
              </ViewTransition>

              <ViewTransition name={`${post.slug}-image`}>
                <Image
                  loading="eager"
                  decoding="sync"
                  src={(post.picture as MediaType).url!}
                  alt={(post.picture as MediaType).alt}
                  width={(post.picture as MediaType).width!}
                  height={(post.picture as MediaType).height!}
                  className="not-prose w-full rounded-xl bg-gray-100 object-cover object-center"
                />
              </ViewTransition>

              <RichText data={post.content} converters={jsxConverters} />
            </div>
          </article>
        </div>
      </main>
    </ViewTransition>
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
      images: (post.picture as MediaType).url!,
    },
    twitter: {
      title: `${post.title} - Budai Akrobatikus Sport Egyesület`,
      description: `${post.excerpt}`,
      images: (post.picture as MediaType).url!,
    },
  };
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }): Promise<PostType> => {
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

  const data = result.docs?.[0] as null | PostType;

  if (data === null) {
    return notFound();
  }

  return data;
});

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: ({ node }) => {
    const picture = node?.value as null | MediaType;
    if (!picture) return null;

    return (
      <Image
        loading="lazy"
        decoding="sync"
        src={picture.url!}
        alt={picture.alt}
        width={picture.width!}
        height={picture.height!}
      />
    );
  },
});
