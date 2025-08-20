import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import type { Document, SharedData } from "@/types";

export default function Documents(props: SharedData<{ documents: Document[] }>) {
  return (
    <AppLayout>
      <Head title="Dokumentumok"></Head>
      <main className="container space-y-8 px-4 pt-8 pb-20">
        <h1 className="text-5xl">Dokumentumok</h1>
        <div className="flex flex-col gap-4">
          {props.documents.map((document) => (
            <a
              key={document.id}
              href={document.file_url}
              className="rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-foreground text-xl shadow hover:bg-background/25"
              target="_blank"
              download={document.file_name}
              aria-label={`${document.title} dokumentum letöltése`}
              rel="noreferrer"
            >
              {document.title}
            </a>
          ))}
        </div>
      </main>
    </AppLayout>
  );
}
