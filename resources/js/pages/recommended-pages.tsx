import { Head } from "@inertiajs/react";
import { ExternalLinkIcon } from "lucide-react";
import AppLayout from "@/layouts/app-layout";
import type { RecommendedPage, SharedData } from "@/types";

export default function RecommendedPages(props: SharedData<{ recommendedPages: RecommendedPage[] }>) {
  return (
    <AppLayout>
      <Head title="Ajánlott oldalak"></Head>
      <main className="container space-y-8 px-4 pt-8 pb-20">
        <h1 className="text-5xl">Ajánlott oldalak</h1>
        <div className="flex flex-col gap-4">
          {props.recommendedPages.map((recommendation) => (
            <a
              key={recommendation.id}
              href={recommendation.url}
              className="inline-flex items-center gap-2 rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-foreground text-xl shadow hover:bg-background/25"
              target="_blank"
              rel="noreferrer"
            >
              <span>{recommendation.name}</span>
              <ExternalLinkIcon className="stroke-primary" />
            </a>
          ))}
        </div>
      </main>
    </AppLayout>
  );
}
