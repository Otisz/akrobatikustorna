import InterceptingModal from "@/components/intercepting-modal";
import VIDEOS from "@/data/videos";
import YoutubeEmbed from "@/features/galery/youtube-embed";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ video: string }>;
};

export default async function Page(props: Props) {
  const { video } = await props.params;

  const galery = VIDEOS.find((videoObj) => videoObj.v === video);

  if (!galery) {
    return notFound();
  }

  return (
    <InterceptingModal title={galery.name}>
      <YoutubeEmbed video={galery} />
    </InterceptingModal>
  );
}

export async function generateStaticParams() {
  return VIDEOS.map((video) => ({ video: video.v }));
}
