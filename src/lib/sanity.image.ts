import { client } from "@/lib/sanity.client";
import type { SanityImageSource } from "@sanity/asset-utils";
import imageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";

const builder = imageUrlBuilder(client);

export const urlFor = (source: SanityImageSource | Image) => builder.image(source);
