import Hero from "@/components/Hero";
import NewsList from "@/components/NewsList";
import { client } from "@/lib/sanity.client";
import { News } from "@/types/sanity";
import { groq } from "next-sanity";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const query = groq`
  *[_type == "news"] | order(publishedAt desc, _createdAt desc)[0..2]
`;

export default async function Page() {
  const newsList = await client.fetch<News[]>(query);

  return (
    <main className="lg:relative">
      <Hero />
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Aktuális híreink</h2>
          </div>
          <NewsList news={newsList} />
          <div className="mx-auto mt-16 max-w-2xl text-center ">
            <Link href="/hirek" className="text-xl text-gray-900 hover:text-orange-primary">
              Korábbi hírek <FaArrowRight className="inline-block" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
