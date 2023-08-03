import { urlFor } from "@/lib/sanity.image";
import { News } from "@/types/sanity";
import Image from "next/image";
import Link from "next/link";

export default function NewsList(props: {
  news: Pick<News, "title" | "mainImage" | "summary" | "slug" | "publishedAt" | "_createdAt">[];
}) {
  return (
    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {props.news.map((news) => (
        <article key={news.slug.current} className="relative flex flex-col items-start">
          <div className="relative w-full">
            <Image
              src={urlFor(news.mainImage).url()}
              alt=""
              width={384}
              height={256}
              className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover object-center sm:aspect-[2/1] lg:aspect-[3/2]"
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
          </div>
          <div className="max-w-xl">
            <div className="mt-8 flex items-center gap-x-4 text-xs">
              <time dateTime={news.publishedAt || news._createdAt} className="text-gray-500">
                {new Date(news.publishedAt || news._createdAt).toLocaleDateString("hu")}
              </time>
            </div>
            <div className="group align-top">
              <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-orange-primary">
                <Link href={`/hirek/${news.slug.current}`}>
                  <span className="absolute inset-0" />
                  {news.title}
                </Link>
              </h3>
              <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{news.summary}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
