import VideoModal from "@/components/VideoModal";
import VIDEOS from "@/data/videos";
import { PlayIcon } from "@heroicons/react/20/solid";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Galéria - Budai Akrobatikus Sport Egyesület",
  description: "Galéria - Budai Akrobatikus Sport Egyesület",
};

export default () => (
  <>
    <main>
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pb-20 pt-8 sm:px-6">
        <h1 className="text-5xl">Galéria</h1>
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto mt-12 grid max-w-lg gap-5 md:max-w-none md:grid-cols-2 lg:grid-cols-3">
            {VIDEOS.map((video) => (
              <Link
                href={{ pathname: "/galeria", query: { v: video.v } }}
                key={video.v}
                className="group flex flex-col overflow-hidden rounded-lg shadow-lg"
              >
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 z-[5] grid items-center justify-center bg-black bg-opacity-0 transition-all duration-500 group-hover:scale-110 group-hover:bg-opacity-50">
                    <PlayIcon className="h-16 w-16 fill-transparent transition-all duration-500 group-hover:fill-white" />
                  </div>
                  <Image
                    width={480}
                    height={360}
                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={`/images/youtube_thumbnails/${video.v}.png`}
                    alt={video.name!.toString()}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between bg-white p-6">
                  <div className="flex-1">
                    <span className="mt-2 block">
                      <p className="text-xl font-semibold text-gray-900 group-hover:text-orange-primary">
                        {video.name}
                      </p>
                      {video.description}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>

    <VideoModal />
  </>
);
