"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    title: "COMEDY AT THE CLUB",
    subtitle: "WE'VE GOT JUST THE THING.",
    image1:
      "https://cdn.pixabay.com/photo/2017/03/07/21/41/comedian-2125294_1280.jpg",
    image2:
      "https://cdn.pixabay.com/photo/2017/03/07/21/41/comedian-2125295_1280.jpg",
    category1: "STAND-UP SHOWCASES",
    category2: "POP STAR DANCE PARTIES",
    buttonText: "Make plans now",
    buttonLink: "/events?category=comedy",
    bgColor: "bg-pink-300",
  },
  {
    title: "MUSIC FESTIVALS",
    subtitle: "EXPERIENCE THE RHYTHM.",
    image1:
      "https://cdn.pixabay.com/photo/2017/08/02/13/00/lotte-2571479_1280.jpg",
    image2:
      "https://cdn.pixabay.com/photo/2016/11/18/15/44/audience-1835431_1280.jpg",
    category1: "LIVE PERFORMANCES",
    category2: "OUTDOOR CONCERTS",
    buttonText: "Find festivals",
    buttonLink: "/events?category=music",
    bgColor: "bg-purple-300",
  },
  {
    title: "FOOD & DRINK",
    subtitle: "TASTE THE EXPERIENCE.",
    image1:
      "https://cdn.pixabay.com/photo/2016/12/26/17/28/spaghetti-1932466_1280.jpg",
    image2:
      "https://cdn.pixabay.com/photo/2023/12/11/09/36/whisky-8443155_1280.jpg",
    category1: "FOOD FESTIVALS",
    category2: "WINE TASTINGS",
    buttonText: "Discover events",
    buttonLink: "/events?category=food-and-drink",
    bgColor: "bg-orange-300",
  },
];

export function HeroSection() {
  return (
    <Carousel className="w-full" opts={{ loop: true }}>
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <div className={`${slide.bgColor} w-full py-12 lg:h-[500px]`}>
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h1 className="text-4xl md:text-6xl font-bold text-red-900 leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-3xl md:text-5xl font-bold text-red-800">
                        {slide.subtitle}
                      </p>
                    </div>
                    <Button
                      asChild
                      size="lg"
                      className="bg-red-900 hover:bg-red-800 text-white"
                    >
                      <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4 rotate-3">
                      <div className="relative aspect-[4/4] rounded-lg overflow-hidden">
                        <Image
                          src={slide.image1}
                          alt={slide.category1}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="bg-white/90 backdrop-blur-sm rounded-md p-2 text-center">
                        <p className="font-semibold text-red-900">
                          {slide.category1}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4 -rotate-3">
                      <div className="relative aspect-[4/4] rounded-lg overflow-hidden">
                        <Image
                          src={slide.image2}
                          alt={slide.category2}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="bg-white/90 backdrop-blur-sm rounded-md p-2 text-center">
                        <p className="font-semibold text-red-900">
                          {slide.category2}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="container mx-auto px-4">
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </div>
    </Carousel>
  );
}
