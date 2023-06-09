"use client";

import CarouselImage1 from "@/../public/images/carousel/2.jpg";
import CarouselImage2 from "@/../public/images/carousel/3.jpg";
import CarouselImage3 from "@/../public/images/carousel/4.jpg";
import CarouselImage4 from "@/../public/images/carousel/5.jpg";
import CarouselImage5 from "@/../public/images/carousel/6.jpg";
import CarouselImage6 from "@/../public/images/carousel/7.jpg";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

const CAROUSEL_IMAGES: StaticImageData[] = [
  CarouselImage1,
  CarouselImage2,
  CarouselImage3,
  CarouselImage4,
  CarouselImage5,
  CarouselImage6,
];

export default function Hero() {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      // @ts-ignore
      speed: 5,
    },
    [Autoplay({ delay: 5000 })],
  );

  return (
    <div className="relative">
      <div className="mx-auto w-full max-w-7xl pb-6 pt-6 text-center lg:py-48 lg:text-left">
        <div className="px-4 sm:px-8 lg:w-1/2 xl:pr-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
            <span className="block xl:inline">
              <span className="text-orange-primary">B</span>udai <span className="text-orange-primary">A</span>
              krobatikus
            </span>{" "}
            <span className="block xl:inline">
              <span className="text-orange-primary">S</span>port <span className="text-orange-primary">E</span>gyesület
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
            Gázművek MTE: Gázműveken belül az akkori akrobatikus torna szakosztály vezetője, vezető edzője Kuti Lajos,
            segítő Füzér István és Zátrok Béla edzők voltak. Sajnos Kuti Lajos És Füzér István halálával a szakosztály
            is elveszett, megszűnt. Viszont felneveltek egy generációt, akik egy életre megszerették, életformának
            tekintik a tornának ezt a különleges változatát, az akrobatikát.
          </p>
          <div className="mt-10 flex justify-center gap-6 lg:justify-start">
            <div className="rounded-md shadow">
              <Link
                href="https://forms.gle/gFjANWnUzEeeQAyn7"
                target="_blank"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-orange-primary px-8 py-3 text-base font-medium text-white hover:bg-orange-accent md:px-10 md:py-4 md:text-lg"
              >
                Jelentkezés
              </Link>
            </div>
            <div className="rounded-md shadow">
              <Link
                href=""
                className="flex w-full items-center justify-center rounded-md border border-orange-primary px-8 py-3 text-base font-medium text-black hover:bg-orange-primary hover:text-white md:px-10 md:py-4 md:text-lg"
              >
                Adományozás
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="relative h-64 w-full overflow-y-hidden sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2">
        <div className="h-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {CAROUSEL_IMAGES.map((image, index) => (
              <div className="h-full min-w-0 flex-[0_0_100%]" key={index}>
                <Image priority={index === 0} className="h-full w-full cursor-grab object-contain" src={image} alt="" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
