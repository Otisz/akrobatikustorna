import { Link } from "@inertiajs/react";
import Autoplay from "embla-carousel-autoplay";
import { LuArrowRight } from "react-icons/lu";
import CarouselImage1 from "@/assets/images/carousel/1c0164f0-13f6-41f9-879f-f84df228dc59.jpg";
import CarouselImage3 from "@/assets/images/carousel/5ebc0a45-5383-41ea-9eb2-6aafd85984c2.jpg";
import CarouselImage4 from "@/assets/images/carousel/78b7c771-5c48-4664-8e37-58755945ea27.jpg";
import CarouselImage2 from "@/assets/images/carousel/00903ad0-2987-4bd1-9227-4ca1995936a6.jpg";
import { buttonVariants } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Links from "@/data/links";
import sponsors from "@/data/sponsors";
import PostCard from "@/featuers/posts/post-card";
import PostsWrapper from "@/featuers/posts/posts-wrapper";
import AppLayout from "@/layouts/app-layout";
import type { Post, SharedData } from "@/types";

const CAROUSEL_IMAGES = [CarouselImage1, CarouselImage2, CarouselImage3, CarouselImage4] as const;

export default function Home(props: SharedData<{ posts: Post[] }>) {
  return (
    <AppLayout>
      <main>
        <section className="container my-16">
          <h1 className="text-balance text-center font-bold text-6xl tracking-tighter">
            <span className="text-primary">B</span>udai <span className="text-primary">A</span>
            krobatikus <span className="text-primary">S</span>port <span className="text-primary">E</span>
            gyesület
          </h1>
        </section>
        <section className="container ">
          <Carousel
            className="h-full w-full"
            opts={{ loop: true }}
            plugins={[Autoplay({ delay: 5000, stopOnMouseEnter: true })]}
          >
            <CarouselContent className="h-full">
              {CAROUSEL_IMAGES.map((image, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: No unique key for static images
                <CarouselItem key={index} className="h-full h-[33vh] md:h-[50vh]">
                  <img src={image} alt="" className="h-full w-full object-cover object-center" />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
        <section className="container mt-16">
          <div className="prose prose-lg mx-auto max-w-[80ch]">
            <h2 className="text-center font-bold text-3xl tracking-tighter sm:text-4xl md:text-5xl">Történetünk</h2>
            <p>
              BASE = Gázművek MTE sportakrobatika szakosztály folytatása: 1970-től a 90-es évek végéig az „akrobatikus
              torna" akkori nevén sportakrobatika szakosztály vezetője, vezető edzője Kuti Lajos, segítő Füzér István és
              Zátrok Béla edzők voltak. Sajnos Kuti Lajos És Füzér István halálával a szakosztály is elveszett,
              megszűnt. Viszont felneveltek egy generációt, akik egy életre megszerették a tornának ezt a különleges
              változatát, az akrobatikát.
            </p>
            <p>
              Nem csak Óbudán, de egész Budán nem volt már ez a sportág. Így 2005 év végén úttörőként hozta vissza
              Szücsi Ildikó (aki ma a BASE vezető- szakedzője), keltette életre a régi sporttársak támogatásával ezt a
              nagyszerű sportágat és megszületett a Budai Akrobatikus Sport Egyesület a BASE!
            </p>
          </div>
        </section>
        <section className="container mt-16 flex justify-center">
          <Link href={Links.apply} className={buttonVariants({ className: "px-16 py-6 font-medium text-xl" })}>
            Jelentkezés
          </Link>
        </section>
        <section className="container mt-16">
          <div className="prose prose-lg mx-auto max-w-[80ch]">
            <h2 className="text-center font-bold text-3xl tracking-tighter sm:text-4xl md:text-5xl">Sportakrobatika</h2>
            <p>
              Az akrobatikus torna egy látványos, dinamikus és művészi sportág, amely erőt, rugalmasságot, egyensúlyt és
              koordinációt igényel. A sportolók párokban vagy csoportokban dolgoznak együtt, hogy lenyűgöző emeléseket,
              dobásokat és egyéb akrobatikus elemeket hajtsanak végre.
            </p>
            <p>
              A BASE egyesületben szakképzett edzők irányításával, biztonságos környezetben sajátíthatják el a gyerekek
              és fiatalok ennek a különleges sportágnak az alapjait és fejleszthetik képességeiket akár versenyszintig.
            </p>
          </div>
        </section>
        <section className="container mt-16">
          <div className="prose prose-lg mx-auto max-w-none">
            <h2 className="text-center font-bold text-3xl tracking-tighter sm:text-4xl md:text-5xl">
              Aktuális híreink
            </h2>
            <PostsWrapper className="not-prose">
              {props.posts.map((post) => (
                <PostCard key={post.slug} post={post} loading="lazy" />
              ))}
            </PostsWrapper>

            <Link href="/hirek" className="not-prose mt-8 block text-center text-gray-900 text-xl hover:text-primary">
              Korábbi hírek <LuArrowRight className="inline-block" />
            </Link>
          </div>
        </section>
        <section className="container my-16">
          <h2 className="text-center font-bold text-3xl tracking-tighter sm:text-4xl md:text-5xl">Támogatóink</h2>
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-2 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-4 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {sponsors.map((sponsor) => (
              <a
                href={sponsor.href}
                key={sponsor.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex flex-col items-center space-y-2 text-center"
              >
                <img
                  className="col-span-2 mx-auto h-32 w-fit rounded object-contain lg:col-span-1"
                  src={sponsor.image}
                  alt={sponsor.name}
                  title={sponsor.name}
                  width={158}
                  height={48}
                />
                <span className="group-hover:text-primary group-hover:underline">{sponsor.name}</span>
              </a>
            ))}
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
