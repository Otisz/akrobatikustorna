import type { Media } from "@/types/payload";
import config from "@payload-config";
import type { Metadata } from "next";
import { getPayload } from "payload";
import { cache } from "react";

export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Dokumentumok",
  description: "Dokumentumok - Budai Akrobatikus Sport Egyesület",
};

export default async function Page() {
  const result = await queryDocuments();

  return (
    <main className="container space-y-8 px-4 pt-8 pb-20">
      <h1 className="text-5xl">Dokumentumok</h1>
      <div className="flex flex-col gap-4">
        {result.docs.map((document) => (
          <a
            key={document.id}
            href={(document.document as Media).url as string}
            className="rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-foreground text-xl shadow hover:bg-background/25"
            target="_blank"
            download
            aria-label={`${document.title} dokumentum letöltése`}
            rel="noreferrer"
          >
            {document.title}
          </a>
        ))}
      </div>
    </main>
  );
}

const queryDocuments = cache(async () => {
  const payload = await getPayload({ config });

  return await payload.find({
    collection: "documents",
    limit: 999,
    sort: "title",
  });
});
