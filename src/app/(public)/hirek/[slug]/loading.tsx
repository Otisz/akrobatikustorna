import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

export default async function Home() {
  return (
    <main>
      <div className="mx-auto max-w-4xl p-6 lg:px-8">
        <article className="prose">
          <header className="flex flex-col">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="mt-6 h-12 w-full" />
          </header>
          <div className="mt-8">
            <Skeleton className="h-5 w-full" />

            <Skeleton className="aspect-video w-full rounded-xl" />

            <Skeleton className="mt-1.5 h-5 w-full" />
            <Skeleton className="mt-1.5 h-5 w-1/2" />
            <Skeleton className="mt-1.5 h-5 w-2/3" />
          </div>
        </article>
      </div>
    </main>
  );
}
