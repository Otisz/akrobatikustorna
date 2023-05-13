import NewsAndResultList from "@/components/NewsAndResultList";
import { client } from "@/lib/sanity.client";
import { Result } from "@/types/sanity";
import type { Metadata } from "next";
import { groq } from "next-sanity";

export const revalidate = 60;

const query = groq`
  *[_type == "results"]{title,mainImage,summary,slug,publishedAt,_createdAt} | order(publishedAt desc, _createdAt desc)
`;

export const metadata: Metadata = {
  title: "Eredmények",
  description: "Eredmények - Budai Akrobatikus Sport Egyesület",
};
export default async function Page() {
  const newsList = await client.fetch<
    Pick<Result, "title" | "mainImage" | "summary" | "slug" | "publishedAt" | "_createdAt">[]
  >(query);

  return (
    <main>
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pb-20 pt-8 sm:px-6">
        <h1 className="mb-16 text-5xl">Eredmények</h1>
        <div className="flex flex-wrap justify-center gap-4">
          <NewsAndResultList news={newsList} prefix="eredmenyek" />
        </div>
      </div>
    </main>
  );
}
