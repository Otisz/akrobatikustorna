import Hero from "@/components/Hero";
import NewsAndResultList from "@/components/NewsAndResultList";
import Supporters from "@/components/Supporters";
import { client } from "@/lib/sanity.client";
import { News, Result } from "@/types/sanity";
import { groq } from "next-sanity";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export const revalidate = 60;

const query = groq`
{
  'news': *[_type == "news"]{title,mainImage,summary,slug,publishedAt,_createdAt} | order(publishedAt desc, _createdAt desc)[0..2],
  'results': *[_type == "results"]{title,mainImage,summary,slug,publishedAt,_createdAt} | order(publishedAt desc, _createdAt desc)[0..2]
}
`;

export default async function Page() {
  const sanityResult = await client.fetch<{
    news: Pick<News, "title" | "mainImage" | "summary" | "slug" | "publishedAt" | "_createdAt">[];
    results: Pick<Result, "title" | "mainImage" | "summary" | "slug" | "publishedAt" | "_createdAt">[];
  }>(query);

  return (
    <main className="lg:relative">
      <Hero />
      <div className="flex flex-col gap-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Aktuális híreink</h2>
          </div>
          <NewsAndResultList news={sanityResult.news} prefix="hirek" />
          <div className="mx-auto mt-16 max-w-2xl text-center ">
            <Link href="/hirek" className="text-xl text-gray-900 hover:text-orange-primary">
              Korábbi hírek <FaArrowRight className="inline-block" />
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Aktuális Eredményeink</h2>
          </div>
          <NewsAndResultList news={sanityResult.results} prefix="eredmenyek" />
          <div className="mx-auto mt-16 max-w-2xl text-center ">
            <Link href="/eredmenyek" className="text-xl text-gray-900 hover:text-orange-primary">
              Korábbi eredméyeink <FaArrowRight className="inline-block" />
            </Link>
          </div>
        </div>
        <Supporters />
      </div>
    </main>
  );
}
