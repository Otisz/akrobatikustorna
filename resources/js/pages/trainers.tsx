import { Head, Link } from "@inertiajs/react";
import type { CSSProperties } from "react";
import AppLayout from "@/layouts/app-layout";
import type { SharedData, Trainer } from "@/types";

export default function Page(props: SharedData<{ trainers: Trainer[] }>) {
  let imageCount = 0;

  return (
    <AppLayout>
      <Head title="Edzők"></Head>
      <main className="container space-y-8 px-4 pt-8 pb-20">
        <h1 className="text-5xl">Edzők</h1>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {props.trainers.map((trainer) => (
            <Link
              key={trainer.id}
              href={`/edzok/${trainer.slug}`}
              style={
                {
                  "--custom-color": trainer.color,
                } as CSSProperties
              }
              className="group relative aspect-9/16 w-full overflow-hidden rounded-md border-4 border-(--custom-color) bg-(--custom-color) shadow"
            >
              <img
                loading={imageCount++ < 8 ? "eager" : "lazy"}
                decoding="sync"
                src={trainer.image_url}
                alt={trainer.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute right-0 bottom-0 left-0 flex h-1/2 flex-col bg-gradient-to-t from-66% from-black/80 to-transparent lg:h-1/3">
                <div className="h-1/4 shrink-0 lg:h-1/3" />
                <div className="flex grow flex-col items-center justify-center gap-6 p-4 text-background">
                  <h2 className="font-semibold text-lg transition-colors duration-300 group-hover:text-primary lg:text-2xl">
                    {trainer.name}
                  </h2>
                  <span>{trainer.role}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </AppLayout>
  );
}
