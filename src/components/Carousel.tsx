"use client";

import CarouselImage1 from "@/../public/images/carousel/0a6ad353-05d6-4744-97c6-c521b8dc9fa8.jpg";
import CarouselImage5 from "@/../public/images/carousel/00903ad0-2987-4bd1-9227-4ca1995936a6.jpg";
import CarouselImage2 from "@/../public/images/carousel/1c0164f0-13f6-41f9-879f-f84df228dc59.jpg";
import CarouselImage3 from "@/../public/images/carousel/5ebc0a45-5383-41ea-9eb2-6aafd85984c2.jpg";
import CarouselImage4 from "@/../public/images/carousel/78b7c771-5c48-4664-8e37-58755945ea27.jpg";
import CarouselImage6 from "@/../public/images/carousel/c4572904-b30f-4356-bb4d-1d9f8c57f7d8.jpg";
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
].sort(() => (Math.random() > 0.5 ? 1 : -1));

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
