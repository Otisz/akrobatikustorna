"use client";

import CarouselImage5 from "@/../public/images/carousel/00903ad0-2987-4bd1-9227-4ca1995936a6.jpg";
import CarouselImage2 from "@/../public/images/carousel/1c0164f0-13f6-41f9-879f-f84df228dc59.jpg";
import CarouselImage3 from "@/../public/images/carousel/5ebc0a45-5383-41ea-9eb2-6aafd85984c2.jpg";
import CarouselImage4 from "@/../public/images/carousel/78b7c771-5c48-4664-8e37-58755945ea27.jpg";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image, { StaticImageData } from "next/image";

const CAROUSEL_IMAGES: StaticImageData[] = [
  CarouselImage3,
  CarouselImage2,
  CarouselImage4,
  CarouselImage5,
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
