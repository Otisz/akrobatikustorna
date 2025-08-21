import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import type { Pagination, Post, SharedData } from "@/types";

export default function PostPage(props: SharedData<{ post: Post }>) {
  console.log(props);
  return (
    <AppLayout>
      <Head title={props.post.title.hu}></Head>
      <main className="container max-w-[80ch] space-y-8 px-4 pt-8 pb-20">
        <article>
          <header className="flex flex-col">
            <h1 className="mt-6 font-bold text-4xl tracking-tight sm:text-5xl">{props.post.title.hu}</h1>
            <time dateTime={props.post.published_at} className="order-first flex items-center">
              <span className="h-4 w-0.5 rounded-full bg-gray-600" />
              <span className="ml-3 text-base text-gray-600">
                {new Date(props.post.published_at).toLocaleDateString("hu")}
              </span>
            </time>
          </header>
          <div className="prose mt-8 prose-img:rounded-xl prose-a:text-primary prose-img:shadow-sm marker:text-primary">
            <p>{props.post.description.hu}</p>

            <img
              loading="eager"
              decoding="sync"
              src={props.post.media[0].original_url as string}
              alt={props.post.title.hu}
              className="not-prose w-full rounded-xl bg-gray-100 object-cover object-center"
            />

            {/** biome-ignore lint/security/noDangerouslySetInnerHtml: The content comes from trusted users */}
            <div dangerouslySetInnerHTML={{ __html: props.post.content.hu }} />
          </div>
        </article>
      </main>
    </AppLayout>
  );
}
