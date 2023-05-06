import { client } from "@/lib/sanity.client";
import { urlFor } from "@/lib/sanity.image";
import { News } from "@/types/sanity";
import { groq } from "next-sanity";
import Image from "next/image";
import { notFound } from "next/navigation";
import PortableText from "react-portable-text";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const query = groq`*[_type == "news"]{slug}`;

  const slugs = await client.fetch<Pick<News, "slug">[]>(query);

  return slugs.map((slug) => ({
    slug: slug.slug.current,
  }));
}

const getData = async (slug: string) => {
  return await client.fetch<News | null>(groq`*[_type == "news" && slug.current == $slug][0]`, { slug });
};

export async function generateMetadata(props: Props) {
  const news = await getData(props.params.slug);

  return {
    title: `${news?.title} - Hírek`,
    description: news?.summary,
  };
}

export default async function Page(props: Props) {
  const news = await getData(props.params.slug);

  if (!news) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl p-6 lg:px-8">
      <article>
        <header className="flex flex-col">
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">{news.title}</h1>
          <time
            dateTime={news.publishedAt || news._createdAt}
            className="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500"
          >
            <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
            <span className="ml-3">{new Date(news.publishedAt || news._createdAt).toLocaleDateString("hu")}</span>
          </time>
        </header>
        <div className="prose mt-8">
          <Image
            src={urlFor(news.mainImage).url()}
            alt=""
            width={384}
            height={256}
            className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover object-center shadow sm:aspect-[2/1] lg:aspect-[3/2]"
          />

          <PortableText content={news.body} />
        </div>
      </article>
    </div>
  );
}
