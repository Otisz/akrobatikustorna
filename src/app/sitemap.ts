import { client } from "@/lib/sanity.client";
import { News } from "@/types/sanity";
import { MetadataRoute } from "next";
import { groq } from "next-sanity";

export const revalidate = 86_400;

const query = groq`
  *[_type == "news"]{slug,publishedAt,_createdAt} | order(publishedAt desc, _createdAt desc)
`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const newsResult = await client.fetch<Pick<News, "slug" | "publishedAt" | "_createdAt">[]>(query);

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

  newsResult.forEach((news) => {
    payload.push({
      url: `https://akrobatikustorna.hu/hirek/${news.slug.current}`,
      lastModified: new Date(news.publishedAt || news._createdAt),
    });
  });

  return payload;
}
