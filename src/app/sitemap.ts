import { client } from "@/lib/sanity.client";
import { News, Trainer } from "@/types/sanity";
import { MetadataRoute } from "next";
import { groq } from "next-sanity";

export const revalidate = 86_400;

const newsQuery = groq`
  *[_type == "news"]{slug,publishedAt,_createdAt} | order(publishedAt desc, _createdAt desc)
`;

const trainersQuery = groq`
  *[_type == "trainers"]{slug,_createdAt}
`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [newsResult, trainerResult] = await Promise.allSettled([
    client.fetch<Pick<News, "slug" | "_createdAt">[]>(newsQuery),
    client.fetch<Pick<Trainer, "slug" | "_createdAt">[]>(trainersQuery),
  ]);

  const payload = [
    {
      url: "https://akrobatikustorna.hu",
      lastModified: new Date(),
    },
    {
      url: "https://akrobatikustorna.hu/ajanlott-oldalak",
      lastModified: new Date(),
    },
    {
      url: "https://akrobatikustorna.hu/dokumentumok",
      lastModified: new Date(),
    },
    {
      url: "https://akrobatikustorna.hu/edzeseink",
      lastModified: new Date(),
    },
    {
      url: "https://akrobatikustorna.hu/edzok",
      lastModified: new Date(),
    },
    {
      url: "https://akrobatikustorna.hu/galeria",
      lastModified: new Date(),
    },
    {
      url: "https://akrobatikustorna.hu/hirek",
      lastModified: new Date(),
    },
    {
      url: "https://akrobatikustorna.hu/kapcsolat",
      lastModified: new Date(),
    },
    {
      url: "https://akrobatikustorna.hu/szakosztalyok",
      lastModified: new Date(),
    },
  ];

  if (newsResult.status === "fulfilled") {
    newsResult.value.forEach((news) => {
      payload.push({
        url: `https://akrobatikustorna.hu/hirek/${news.slug.current}`,
        lastModified: new Date(news._createdAt),
      });
    });
  }

  if (trainerResult.status === "fulfilled") {
    trainerResult.value.forEach((trainer) => {
      payload.push({
        url: `https://akrobatikustorna.hu/edzok/${trainer.slug.current}`,
        lastModified: new Date(trainer._createdAt),
      });
    });
  }

  return payload;
}
