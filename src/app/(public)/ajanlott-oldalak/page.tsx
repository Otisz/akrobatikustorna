import { ExternalLinkIcon } from "lucide-react";
import type { Metadata } from "next";
import { getPayload } from "payload";
import { cache } from "react";

import config from "@payload-config";

export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Ajánlott oldalak",
  description: "Ajánlott oldalak - Budai Akrobatikus Sport Egyesület",
};

export default async function Page() {
  const result = await queryRecommendedPages();

  return (
    <main>
      <div className="container space-y-8 px-4 pt-8 pb-20 sm:px-6">
        <h1 className="text-5xl">Ajánlott oldalak</h1>
        <div className="flex flex-col gap-4">
          {result.docs.map((recommendation, i) => (
            <a
              key={i}
              href={recommendation.href!}
              className="text-foreground hover:bg-background/25 inline-flex items-center gap-2 rounded border border-gray-400 bg-white px-4 py-2 text-xl font-semibold shadow"
              target="_blank"
            >
              <span>{recommendation.title}</span>
              <ExternalLinkIcon className="stroke-primary" />
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}

const queryRecommendedPages = cache(async () => {
  const payload = await getPayload({ config });

  return await payload.find({
    collection: "recommended-pages",
    limit: 999,
    sort: "title",
  });
});
