import { Head, router } from "@inertiajs/react";
import { PlayIcon } from "lucide-react";
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import VIDEOS from "@/data/videos";
import AppLayout from "@/layouts/app-layout";

export default function Schedule() {
  const params = new URLSearchParams(window.location.search);

  const openedVideo = useMemo(() => {
    if (params.get("v")) {
      return VIDEOS.find((v) => v.v === params.get("v"));
    }

    return null;
  }, [params.get]);

  return (
    <AppLayout>
      <Head title="Edzéseink"></Head>
      <main className="container space-y-8 px-4 pt-8 pb-20">
        <h1 className="text-5xl">Galéria</h1>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {VIDEOS.map((video) => (
            <Card
              key={video.v}
              className="overflow-hidden pt-0 group cursor-pointer"
              onClick={() => {
                params.set("v", video.v);
                router.visit(`/galeria?${params.toString()}`, { preserveScroll: true });
              }}
            >
              <CardContent className="relative px-0">
                <div className="absolute inset-0 z-[5] grid scale-105 items-center justify-center bg-none transition-all group-hover:bg-black/50">
                  <PlayIcon className="h-16 w-16 fill-transparent stroke-transparent transition-colors group-hover:fill-white group-hover:stroke-white" />
                </div>
                <img
                  src={video.thumbnail}
                  alt={video.name.toString()}
                  className="transition-all group-hover:scale-105"
                />
              </CardContent>
              <CardHeader>
                <CardTitle className="transition-colors group-hover:text-primary">{video.name}</CardTitle>
                {"description" in video ? <CardDescription> {video.description}</CardDescription> : null}
              </CardHeader>
            </Card>
          ))}
        </div>
        <Dialog
          open={params.has("v")}
          onOpenChange={(open) => {
            if (!open) {
              router.visit("/galeria", { preserveScroll: true });
            }
          }}
        >
          <DialogContent className="sm:max-w-7xl">
            <DialogHeader>
              <DialogTitle>{openedVideo?.name}</DialogTitle>
              <DialogDescription className="hidden">{openedVideo?.name}</DialogDescription>
            </DialogHeader>
            <iframe
              width="560"
              height="315"
              className="aspect-video h-full w-full"
              src={`https://www.youtube.com/embed/${openedVideo?.v}`}
              title={openedVideo?.name.toString()}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </DialogContent>
        </Dialog>
      </main>
    </AppLayout>
  );
}
