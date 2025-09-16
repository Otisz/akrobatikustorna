import { Link } from "@inertiajs/react";
import type { ComponentProps } from "react";
import type { Post } from "@/types";

type Props = Readonly<{
  post: Omit<Post, "content">;
  loading: ComponentProps<"img">["loading"];
}>;

export default function PostCard(props: Props) {
  return (
    <Link href={`/hirek/${props.post.slug}`}>
      <article className="group flex flex-col gap-2" data-flox="asd">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
          <img
            loading={props.loading}
            decoding="sync"
            src={props.post.media[0].original_url as string}
            alt={props.post.title.hu}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <time
            dateTime={props.post.published_at}
            className="absolute top-2 right-2 rounded-lg bg-primary p-0.5 text-sm"
          >
            {new Date(props.post.published_at).toLocaleDateString("hu")}
          </time>
        </div>
        <h2 className="font-semibold text-lg leading-6 transition-colors duration-300 group-hover:text-primary">
          {props.post.title.hu}
        </h2>
        {"description" in props.post ? (
          <p className="text-gray-600 text-sm leading-6">{props.post.description.hu}</p>
        ) : null}
      </article>
    </Link>
  );
}
