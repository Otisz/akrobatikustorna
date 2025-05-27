import Link from "@/components/ui/link";
import type { Media as MediaType, Post as PostType } from "@/types/payload";
import Image from "next/image";
import { type ComponentProps, unstable_ViewTransition as ViewTransition } from "react";

type Props = Readonly<{
  post: PostType;
  loading: ComponentProps<typeof Image>["loading"];
}>;

export default function PostCard(props: Props) {
  return (
    <Link href={`/hirek/${props.post.slug}`}>
      <article className="group flex flex-col gap-2" data-flox="asd">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
          <ViewTransition name={`${props.post.slug}-image`}>
            <Image
              data-trans-name={`${props.post.slug}-image`}
              loading={props.loading}
              decoding="sync"
              src={
                (props.post.picture as MediaType)?.sizes?.thumbnail?.url ||
                ((props.post.picture as MediaType).url as string)
              }
              alt={(props.post.picture as MediaType).alt as string}
              width={(props.post.picture as MediaType)?.sizes?.thumbnail?.width || 389}
              height={(props.post.picture as MediaType)?.sizes?.thumbnail?.height || 219}
              style={
                {
                  "--focal": `${(props.post.picture as MediaType).focalX}% ${(props.post.picture as MediaType).focalY}%`,
                } as React.CSSProperties
              }
              className="h-full w-full object-cover object-(--focal) transition-transform duration-300 group-hover:scale-105"
              quality={65}
            />
          </ViewTransition>
          <time
            dateTime={props.post.publishedAt as string}
            className="absolute top-2 right-2 rounded-lg bg-primary p-0.5 text-sm"
          >
            {new Date(props.post.publishedAt as string).toLocaleDateString("hu")}
          </time>
        </div>
        <ViewTransition name={`${props.post.slug}-title`}>
          <h2 className="font-semibold text-lg leading-6 transition-colors duration-300 group-hover:text-primary">
            {props.post.title}
          </h2>
        </ViewTransition>
        <ViewTransition name={`${props.post.slug}-excerpt`}>
          <p className="text-gray-600 text-sm leading-6">{props.post.excerpt}</p>
        </ViewTransition>
      </article>
    </Link>
  );
}
