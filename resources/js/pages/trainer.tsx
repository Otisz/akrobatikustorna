import { Head, Link } from "@inertiajs/react";
import type { CSSProperties } from "react";
import AppLayout from "@/layouts/app-layout";
import type { SharedData, Trainer } from "@/types";

export default function RecommendedPages(props: SharedData<{ trainer: Trainer }>) {
  return (
    <AppLayout>
      <Head title={props.trainer.name}></Head>
      <main className="container max-w-[80ch] space-y-8 px-4 pt-8 pb-20">
        <article>
          <header className="flex flex-col">
            <h1 className="mt-6 font-bold text-4xl tracking-tight sm:text-5xl">{props.trainer.name}</h1>
          </header>
          <div className="prose mt-8 prose-img:rounded-xl prose-a:text-primary prose-img:shadow-sm marker:text-primary">
            <p>{props.trainer.role}</p>

            <img
              loading="eager"
              decoding="sync"
              src={props.trainer.image_url}
              alt={props.trainer.name}
              style={
                {
                  "--custom-color": props.trainer.color,
                } as CSSProperties
              }
              className="not-prose w-full rounded-xl bg-gray-100 object-cover border-5 border-(--custom-color)"
            />

            {/** biome-ignore lint/security/noDangerouslySetInnerHtml: The content comes form trusted users */}
            {props.trainer.content ? <div dangerouslySetInnerHTML={{ __html: props.trainer.content }} /> : null}
          </div>
        </article>
      </main>
    </AppLayout>
  );
}
