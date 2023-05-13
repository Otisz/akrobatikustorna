import { client } from "@/lib/sanity.client";
import { urlFor } from "@/lib/sanity.image";
import { Result } from "@/types/sanity";
import { groq } from "next-sanity";
import Image from "next/image";
import { notFound } from "next/navigation";
import PortableText from "react-portable-text";

type Props = {
  params: {
    slug: string;
  };
};

export const revalidate = 60;

export async function generateStaticParams() {
  const query = groq`*[_type == "results"]{slug}`;

  const slugs = await client.fetch<Pick<Result, "slug">[]>(query);

  return slugs.map((slug) => ({
    slug: slug.slug.current,
  }));
}

const getData = async (slug: string) => {
  return await client.fetch<Result | null>(groq`*[_type == "results" && slug.current == $slug][0]`, { slug });
};

export async function generateMetadata(props: Props) {
  const news = await getData(props.params.slug);

  return {
    title: `${news?.title} - Eredményeink`,
    description: news?.summary,
  };
}

export default async function Page(props: Props) {
  const result = await getData(props.params.slug);

  if (!result) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl p-6 lg:px-8">
      <article>
        <header className="flex flex-col">
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">{result.title}</h1>
          <time
            dateTime={result.publishedAt || result._createdAt}
            className="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500"
          >
            <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
            <span className="ml-3">{new Date(result.publishedAt || result._createdAt).toLocaleDateString("hu")}</span>
          </time>
        </header>
        <div className="prose mt-8 prose-a:text-orange-primary">
          <p>{result.summary}</p>

          <Image
            src={urlFor(result.mainImage).url()}
            alt=""
            width={384}
            height={256}
            className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover object-center shadow sm:aspect-[2/1] lg:aspect-[3/2]"
          />

          <PortableText content={result.body} />
        </div>
      </article>
    </div>
  );
}
