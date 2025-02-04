import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main>
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pb-20 pt-8 sm:px-6">
        <h1 className="text-5xl">Hírek</h1>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {[...Array(12)].map((_, i) => (
            <article key={i} className="relative flex w-full flex-col items-start">
              <Skeleton className="aspect-16/9 w-full rounded-2xl sm:aspect-2/1 lg:aspect-3/2" />
              <div className="min-h-32 w-full">
                <Skeleton className="mt-8 h-4 w-full" />
                <div className="group align-top">
                  <Skeleton className="mt-3 h-6 w-full" />
                  <Skeleton className="mt-5 h-5 w-full" />
                  <Skeleton className="mt-1.5 h-5 w-1/2" />
                  <Skeleton className="mt-1.5 h-5 w-2/3" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
