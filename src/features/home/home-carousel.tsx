"use client";

import CarouselImage2 from "@/assets/images/carousel/00903ad0-2987-4bd1-9227-4ca1995936a6.jpg";
import CarouselImage1 from "@/assets/images/carousel/1c0164f0-13f6-41f9-879f-f84df228dc59.jpg";
import CarouselImage3 from "@/assets/images/carousel/5ebc0a45-5383-41ea-9eb2-6aafd85984c2.jpg";
import CarouselImage4 from "@/assets/images/carousel/78b7c771-5c48-4664-8e37-58755945ea27.jpg";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image, { type StaticImageData } from "next/image";

const CAROUSEL_IMAGES: StaticImageData[] = [CarouselImage1, CarouselImage2, CarouselImage3, CarouselImage4];

export default function HeroCarousel() {
  return (
    <Carousel
      className="h-full w-full"
      opts={{ loop: true }}
      plugins={[Autoplay({ delay: 5000, stopOnMouseEnter: true })]}
    >
      <CarouselContent className="h-full">
        {CAROUSEL_IMAGES.map((image, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: No unique key for static images
          <CarouselItem key={index} className="h-full">
            <Image src={image} alt="" priority={index === 0} className="h-full w-full object-cover object-center" />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
