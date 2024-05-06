import { client } from "@/lib/sanity.client";
import { urlFor } from "@/lib/sanity.image";
import { Trainer } from "@/types/sanity";
import type { Metadata } from "next";
import { groq } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

export const revalidate = 1;

export const metadata: Metadata = {
  title: "Edzőink",
  description: "Edzőink - Budai Akrobatikus Sport Egyesület",
};

const query = groq`
  *[_type == "trainers"]{name,slug,role,mainImage,color,orderRank} | order(orderRank)
`;

export default async function Page() {
  const trainers = await client.fetch<Pick<Trainer, "name" | "slug" | "role" | "mainImage" | "color">[]>(query);

  return (
    <main>
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pb-20 pt-8 sm:px-6">
        <h1 className="mb-16 text-5xl">Edzőink</h1>
        <div className="flex flex-wrap justify-center gap-4">
          {trainers.map((trainer) => (
            <Link
              style={
                {
                  "--trainer-color": trainer.color?.hex ?? "white",
                } as CSSProperties
              }
              key={trainer.name}
              href={`/edzok/${trainer.slug.current}`}
              className="flex-[0_0_100%] overflow-hidden bg-[var(--trainer-color)] shadow-lg sm:flex-[0_0_calc(50%_-_16px)] sm:rounded-md md:flex-[0_0_calc(33%_-_16px)]"
            >
              <div className="px-4 py-5 text-center sm:px-6">
                <h3 className="text-xl font-medium leading-6 text-gray-900">{trainer.name}</h3>
                <p className="my-1 max-w-2xl text-sm italic">{trainer.role}</p>
                <Image
                  className="mx-auto sm:rounded-md"
                  width={342}
                  height={456}
                  src={urlFor(trainer.mainImage).url()}
                  alt={trainer.name}
                  loading="lazy"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
