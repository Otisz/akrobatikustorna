import Carousel from "@/components/Carousel";
import NewsList from "@/components/NewsList";
import Supporters from "@/components/Supporters";
import { client } from "@/lib/sanity.client";
import { News } from "@/types/sanity";
import { groq } from "next-sanity";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export const revalidate = 900;

const query = groq`
  *[_type == "news"]{_id,title,mainImage,summary,slug,_createdAt} | order(publishedAt desc, _createdAt desc)[0..5]
`;

export default async function Page() {
  const newsResult =
    await client.fetch<Pick<News, "_id" | "title" | "mainImage" | "summary" | "slug" | "_createdAt">[]>(query);

  return (
    <main className="lg:relative">
      <div className="relative">
        <div className="mx-auto w-full max-w-7xl py-6 text-center lg:py-32 lg:text-left">
          <div className="px-4 sm:px-8 lg:w-1/2 xl:pr-16">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              <span className="block xl:inline">
                <span className="text-orange-primary">B</span>udai <span className="text-orange-primary">A</span>
                krobatikus
              </span>{" "}
              <span className="block xl:inline">
                <span className="text-orange-primary">S</span>port <span className="text-orange-primary">E</span>
                gyesület
              </span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
              BASE = Gázművek MTE sportakrobatika szakosztály folytatása: 1970-től a 90-es évek végéig az „akrobatikus
              torna” akkori nevén sportakrobatika szakosztály vezetője, vezető edzője Kuti Lajos, segítő Füzér István és
              Zátrok Béla edzők voltak. Sajnos Kuti Lajos És Füzér István halálával a szakosztály is elveszett,
              megszűnt. Viszont felneveltek egy generációt, akik egy életre megszerették a tornának ezt a különleges
              változatát, az akrobatikát. Nem csak Óbudán, de egész Budán nem volt már ez a sportág. Így 2005 év végén
              úttörőként hozta vissza Szücsi Ildikó (aki ma a BASE vezető- szakedzője), keltette életre a régi
              sporttársak támogatásával ezt a nagyszerű sportágat és megszületett a Budai Akrobatikus Sport Egyesület a
              BASE!
            </p>
            <div className="mt-10 flex justify-center gap-6 lg:justify-start">
              <div className="rounded-md shadow">
                <Link
                  href="https://forms.gle/6uXVWQha918p3Nf96"
                  target="_blank"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-orange-primary px-8 py-3 text-base font-medium text-gray-900 transition hover:bg-orange-accent hover:text-white md:px-10 md:py-4 md:text-lg"
                >
                  Jelentkezés
                </Link>
              </div>
              <div className="rounded-md shadow">
                <Link
                  href="#"
                  className="hidden w-full items-center justify-center rounded-md border border-orange-primary px-8 py-3 text-base font-medium text-black transition hover:bg-orange-primary hover:text-white md:px-10 md:py-4 md:text-lg"
                >
                  Adományozás
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="relative h-64 w-full overflow-y-hidden sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2">
          <Carousel />
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Aktuális híreink</h2>
          </div>
          <NewsList news={newsResult} />
          <div className="mx-auto mt-16 max-w-2xl text-center">
            <Link href="/hirek" className="text-xl text-gray-900 hover:text-orange-primary">
              Korábbi hírek <FaArrowRight className="inline-block" />
            </Link>
          </div>
        </div>
        <Supporters />
      </div>
    </main>
  );
}
