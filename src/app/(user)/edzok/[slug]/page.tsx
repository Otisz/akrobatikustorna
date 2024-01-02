import { client } from "@/lib/sanity.client";
import { urlFor } from "@/lib/sanity.image";
import { Trainer } from "@/types/sanity";
import type { Metadata } from "next";
import { groq } from "next-sanity";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import PortableText from "react-portable-text";

type Props = {
  params: {
    slug: string;
  };
};

export const revalidate = 900;

export async function generateStaticParams() {
  const query = groq`*[_type == "trainers"]{slug}`;

  const slugs = await client.fetch<Pick<Trainer, "slug">[]>(query);

  return slugs.map((slug) => ({
    slug: slug.slug.current,
  }));
}

const getData = async (slug: string) => {
  const news = await client.fetch<Trainer | null>(groq`*[_type == "trainers" && slug.current == $slug][0]`, { slug });

  if (!news) {
    notFound();
  }

  return news;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const trainer = await getData(props.params.slug);

  return {
    title: `${trainer.name} - Edzők`,
    openGraph: {
      type: "profile",
      title: `${trainer.name} - Edzők - Budai Akrobatikus Sport Egyesület`,
      images: urlFor(trainer.mainImage).url(),
    },
    twitter: {
      title: `${trainer.name} - Edzők - Budai Akrobatikus Sport Egyesület`,
      images: urlFor(trainer.mainImage).url(),
    },
  };
}

export default async function Page(props: Props) {
  const trainer = await getData(props.params.slug);

  return (
    <div className="mx-auto max-w-4xl p-6 lg:px-8">
      <article>
        <header className="flex flex-col">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{trainer.name}</h1>
        </header>
        <div className="prose mt-8 marker:text-orange-primary prose-a:text-orange-primary prose-img:rounded-xl prose-img:shadow">
          <div
            style={
              {
                "--trainer-color": trainer.color.hex,
              } as CSSProperties
            }
            className="flex-[0_0_100%] overflow-hidden bg-[var(--trainer-color)] shadow-lg sm:flex-[0_0_calc(50%_-_16px)] sm:rounded-md md:flex-[0_0_calc(33%_-_16px)]"
          >
            <div className="px-4 py-5 text-center sm:px-6">
              <Image
                src={urlFor(trainer.mainImage).url()}
                alt=""
                width={342}
                height={456}
                className="mx-auto max-h-[50svh] w-auto sm:rounded-md"
              />
            </div>
          </div>

          <PortableText
            content={trainer.body ?? []}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
          />
        </div>
      </article>
    </div>
  );
}
