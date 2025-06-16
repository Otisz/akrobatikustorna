import Link from "@/components/ui/link";
import type { Media as MediaType } from "@/types/payload";
import config from "@payload-config";
import type { Metadata } from "next";
import Image from "next/image";
import { getPayload } from "payload";
import { cache, type CSSProperties, unstable_ViewTransition as ViewTransition } from "react";

export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Edzők",
  description: "Edzők - Budai Akrobatikus Sport Egyesület",
};

export default async function Page() {
  const result = await queryTrainers();

  let imageCount = 0;

  return (
    <ViewTransition>
      <main className="container space-y-8 px-4 pt-8 pb-20">
        <h1 className="text-5xl">Edzők</h1>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {result.docs.map((trainer) => (
            <Link
              key={trainer.id}
              href={`/edzok/${trainer.slug}`}
              className="group relative aspect-9/16 w-full overflow-hidden rounded-md border border-border bg-red-500/20 shadow"
            >
              <ViewTransition name={`${trainer.slug}-image`}>
                <Image
                  loading={imageCount++ < 6 ? "eager" : "lazy"}
                  decoding="sync"
                  src={(trainer.picture as MediaType).url as string}
                  alt={(trainer.picture as MediaType).alt as string}
                  width={(trainer.picture as MediaType)?.sizes?.thumbnail?.width || 490}
                  height={(trainer.picture as MediaType)?.sizes?.thumbnail?.height || 872}
                  style={
                    {
                      "--focal": `${(trainer.picture as MediaType).focalX}% ${(trainer.picture as MediaType).focalY}%`,
                    } as CSSProperties
                  }
                  className="h-full w-full object-cover object-(--focal) transition-transform duration-300 group-hover:scale-105"
                  quality={65}
                />
              </ViewTransition>
              <div className="absolute right-0 bottom-0 left-0 flex h-1/2 flex-col bg-gradient-to-t from-66% from-black/80 to-transparent lg:h-1/3">
                <div className="h-1/4 shrink-0 lg:h-1/3" />
                <div className="flex grow flex-col items-center justify-center gap-6 p-4 text-background">
                  <ViewTransition name={`${trainer.slug}-name`}>
                    <h2 className="font-semibold text-lg transition-colors duration-300 group-hover:text-primary lg:text-2xl">
                      {trainer.name}
                    </h2>
                  </ViewTransition>
                  <ViewTransition name={`${trainer.slug}-position`}>
                    <span>{trainer.position}</span>
                  </ViewTransition>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </ViewTransition>
  );
}

const queryTrainers = cache(async () => {
  const payload = await getPayload({ config });

  return await payload.find({
    collection: "trainers",
    limit: 999,
  });
});
