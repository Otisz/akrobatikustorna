import type VIDEOS from "@/data/videos";

type Props = {
  video: (typeof VIDEOS)[number];
};

export default function YoutubeEmbed(props: Props) {
  return (
    <iframe
      width="560"
      height="315"
      className="aspect-video h-full w-full"
      src={`https://www.youtube.com/embed/${props.video.v}`}
      title={props.video.name.toString()}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  );
}
