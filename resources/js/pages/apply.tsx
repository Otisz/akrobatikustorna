import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

export default function Page() {
  return (
    <AppLayout>
      <Head title="Jelentkezés"></Head>
      <main className="container space-y-8 px-4 pt-8 pb-20">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLScuoLL1rYrgj1ohglnjoGDWRKFCPaCMdUhJ3zs96EXm4tytWw/viewform?embedded=true"
          className="min-h-500 w-full"
          title="Jelentkezés űrlap"
          onLoad={(e) => {
            try {
              e.currentTarget.style.height = `${e.currentTarget.contentWindow?.document.body.scrollHeight}px`;
            } catch (_e) {
              // ignore
            }
          }}
        >
          Betöltés…
        </iframe>
      </main>
    </AppLayout>
  );
}
