import type { Media as MediaType, Trainer } from "@/types/payload";
import config from "@payload-config";
import { type JSXConvertersFunction, RichText } from "@payloadcms/richtext-lexical/react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import { cache, type CSSProperties, unstable_ViewTransition as ViewTransition } from "react";

export const revalidate = 86_400;

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const trainers = await payload.find({
    collection: "trainers",
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  });

  return trainers.docs.map(({ slug }) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Home(props: Props) {
  const params = await props.params;
  const { slug = "" } = params;
  const trainer = await queryTrainerBySlug({ slug });

  return (
    <ViewTransition>
      <main className="container max-w-[80ch] space-y-8 px-4 pt-8 pb-20">
        <article>
          <header className="flex flex-col">
            <ViewTransition name={`${trainer.slug}-name`}>
              <h1 className="mt-6 font-bold text-4xl tracking-tight sm:text-5xl">{trainer.name}</h1>
            </ViewTransition>
          </header>
          <div className="prose mt-8 prose-img:rounded-xl prose-a:text-primary prose-img:shadow-sm marker:text-primary">
            <ViewTransition name={`${trainer.slug}-position`}>
              <p>{trainer.position}</p>
            </ViewTransition>

            <ViewTransition name={`${trainer.slug}-image`}>
              <Image
                loading="eager"
                decoding="sync"
                src={(trainer.picture as MediaType).url as string}
                alt={(trainer.picture as MediaType).alt as string}
                width={(trainer.picture as MediaType).width as number}
                height={(trainer.picture as MediaType).height as number}
                style={
                  {
                    "--focal": `${(trainer.picture as MediaType).focalX}% ${(trainer.picture as MediaType).focalY}%`,
                  } as CSSProperties
                }
                className="not-prose w-full rounded-xl bg-gray-100 object-cover object-(--focal)"
              />
            </ViewTransition>

            <RichText data={trainer.content} converters={jsxConverters} />
          </div>
        </article>
      </main>
    </ViewTransition>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug = "" } = await props.params;
  const trainer = await queryTrainerBySlug({ slug });

  return {
    title: trainer.name,
    description: trainer.position,
    openGraph: {
      type: "profile",
      title: `${trainer.name} - Budai Akrobatikus Sport Egyesület`,
      description: trainer.position,
      images: (trainer.picture as MediaType).url as string,
    },
    twitter: {
      title: `${trainer.name} - Budai Akrobatikus Sport Egyesület`,
      description: trainer.position,
      images: (trainer.picture as MediaType).url as string,
    },
  };
}

const queryTrainerBySlug = cache(async ({ slug }: { slug: string }): Promise<Trainer> => {
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "trainers",
    limit: 1,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
      ],
    },
  });

  const data = result.docs?.[0] as null | Trainer;

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
        src={picture.url as string}
        alt={picture.alt as string}
        width={picture.width as number}
        height={picture.height as number}
      />
    );
  },
});
