import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "@/components/ui/link";
import VIDEOS from "@/data/videos";
import { PlayIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Galéria",
  description: "Galéria - Budai Akrobatikus Sport Egyesület",
};

export default function Page() {
  return (
    <main className="container space-y-8 px-4 pt-8 pb-20">
      <h1 className="text-5xl">Galéria</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {VIDEOS.map((video) => (
          <Link key={video.v} href={`/galeria/${video.v}`} className="group">
            <Card className="overflow-hidden pt-0">
              <CardContent className="relative px-0">
                <div className="absolute inset-0 z-[5] grid scale-105 items-center justify-center bg-none transition-all group-hover:bg-black/50">
                  <PlayIcon className="h-16 w-16 fill-transparent stroke-transparent transition-colors group-hover:fill-white group-hover:stroke-white" />
                </div>
                <Image
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
          </Link>
        ))}
      </div>
    </main>
  );
}
