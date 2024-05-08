"use client";

import CarouselImage1 from "@/../public/images/carousel/1.jpg";
import CarouselImage2 from "@/../public/images/carousel/2.jpg";
import CarouselImage3 from "@/../public/images/carousel/3.jpg";
import CarouselImage4 from "@/../public/images/carousel/4.jpg";
import CarouselImage5 from "@/../public/images/carousel/5.jpg";
import CarouselImage6 from "@/../public/images/carousel/6.jpg";
import CarouselImage7 from "@/../public/images/carousel/7.jpg";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image, { StaticImageData } from "next/image";

const CAROUSEL_IMAGES: StaticImageData[] = [
  CarouselImage1,
  CarouselImage2,
  CarouselImage3,
  CarouselImage4,
  CarouselImage5,
  CarouselImage6,
  CarouselImage7,
];

export default function Carousel() {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      // @ts-ignore
      speed: 5,
    },
    [Autoplay({ delay: 5000 })],
  );

  return (
    <div className="h-full overflow-hidden" ref={emblaRef}>
      <div className="flex h-full">
        {CAROUSEL_IMAGES.map((image, index) => (
          <div className="h-full min-w-0 flex-[0_0_100%]" key={index}>
            <Image priority={index === 0} className="h-full w-full cursor-grab object-contain" src={image} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
}
