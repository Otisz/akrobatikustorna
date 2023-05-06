import type { Image, PortableTextTextBlock, Slug } from "sanity";

type SanityBase = {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
};

interface News extends SanityBase {
  title: string;
  slug: Slug;
  mainImage: Image;
  publishedAt?: string;
  summary: string;
  body: PortableTextTextBlock[];
}
