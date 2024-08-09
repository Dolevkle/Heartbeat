"use client";
import React from "react";
import Image from "next/image";
import exampleImage from "public/assets/profilePic.png";
import { Separator } from "../shadcn/separator";
import { AspectRatio } from "../shadcn/aspect-ratio";
import { CheckIcon, MapPin } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../shadcn/carousel";
import { Button } from "../shadcn/button";
import { XIcon } from "lucide-react";

const currentMatch = {
  artist: "Ornella Binni",
  age: 23,
  city: "Holon",
  pictures: [exampleImage, exampleImage, exampleImage],
};

const MatchWindow: React.FC = () => {
  return (
    <div className="h-8/12 relative m-24 mr-2 flex w-8/12">
      <div className="flex h-full w-full rounded-md border-4 border-primary">
        <Carousel
          opts={{
            align: "start",
          }}
          orientation="vertical"
          className="w-6/12"
        >
          <CarouselContent className="h-[73vh]">
            {currentMatch.pictures.map((picture, index) => (
              <CarouselItem key={index}>
                <AspectRatio>
                  <Image
                    src={picture}
                    alt={`Photo by ${currentMatch.artist}`}
                    objectFit="cover"
                    fill
                  />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <Separator
          orientation="vertical"
          className="w-0.25 ml-0.5 mr-0.5 bg-secondary"
        />
        <div className="w-6/12 bg-primary pl-4">
          <AspectRatio>
            <div className="flex h-full w-full flex-col justify-center gap-1 object-cover font-bold">
              <div className="text-4xl">{`${currentMatch.artist}, ${currentMatch.age}`}</div>
              <div className="flex items-end text-2xl">
                <MapPin className="h-8 w-8" />
                {currentMatch.city}
              </div>
            </div>
          </AspectRatio>
        </div>
      </div>
      <div className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 transform gap-8">
        <Button
          className="h-16 w-16 rounded-full border border-primary bg-white text-red-700 hover:bg-red-400"
          onClick={() => console.log("pass")}
        >
          <XIcon />
        </Button>
        <Button
          className="h-16 w-16 rounded-full border border-primary bg-white text-green-700 hover:bg-green-400"
          onClick={() => console.log("match")}
        >
          <CheckIcon />
        </Button>
      </div>
    </div>
  );
};

export default MatchWindow;
