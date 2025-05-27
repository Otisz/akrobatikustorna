import { Skeleton } from "@/components/ui/skeleton";

export default async function Home() {
  return (
    <main className="container space-y-8 px-4 pt-8 pb-20">
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
    </main>
  );
}
