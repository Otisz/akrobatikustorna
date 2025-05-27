import VIDEOS from "@/data/videos";
import YoutubeEmbed from "@/features/galery/youtube-embed";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ video: string }>;
};

export default async function Page(props: Props) {
  const { video } = await props.params;

  const gallery = VIDEOS.find((videoObj) => videoObj.v === video);

  if (!gallery) {
    return notFound();
  }

  return (
    <main className="container space-y-8 px-4 pt-8 pb-20">
      <h1 className="text-5xl">{gallery.name}</h1>
      <YoutubeEmbed video={gallery} />
    </main>
  );
}

export async function generateStaticParams() {
  return VIDEOS.map((video) => ({ video: video.v }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { video } = await props.params;

  const gallery = VIDEOS.find((videoObj) => videoObj.v === video);

  if (!gallery) {
    return notFound();
  }

  return {
    title: gallery.name.toString(),
    openGraph: {
      type: "video.other",
      title: `${gallery.name.toString()} | Budai Akrobatikus Sport Egyesület`,
    },
    twitter: {
      title: `${gallery.name.toString()} | Budai Akrobatikus Sport Egyesület`,
    },
  };
}
