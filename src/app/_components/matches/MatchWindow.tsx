"use client";
import React, { useState } from "react";
import Image from "next/image";
import exampleImage from "public/assets/profilePic.png";
import { AspectRatio } from "../shadcn/aspect-ratio";
import { CheckIcon, MapPin } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "../shadcn/carousel";
import { Button } from "../shadcn/button";
import { XIcon } from "lucide-react";
import { Progress } from "../shadcn/progress";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../shadcn/resizable";

const currentMatch = {
  artist: "Ornella Binni",
  age: 23,
  city: "Holon",
  pictures: [exampleImage, exampleImage, exampleImage],
};

const MatchWindow: React.FC = () => {
  const [progress, setProgress] = useState<number>(1);

  const handleNext = () => {
    setProgress((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setProgress((prev) => prev - 1);
  };

  return (
    <div className="h-8/12 relative m-24 flex w-8/12">
      <div className="flex h-full w-full rounded-md border-4 border-primary">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            className="h-full w-6/12"
            defaultSize={52}
            minSize={40}
          >
            <Carousel
              opts={{
                align: "start",
              }}
              orientation="vertical"
              handlePrevious={handlePrevious}
              handleNext={handleNext}
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
          </ResizablePanel>
          <ResizableHandle className="w-0.5 bg-black text-white" withHandle />
          <ResizablePanel
            className="w-6/12 bg-primary pl-4"
            defaultSize={50}
            minSize={40}
          >
            <AspectRatio>
              <div className="flex h-full w-full flex-col justify-center gap-1 object-cover font-bold">
                <div className="text-4xl">{`${currentMatch.artist}, ${currentMatch.age}`}</div>
                <div className="flex items-end text-2xl">
                  <MapPin className="h-8 w-8" />
                  {currentMatch.city}
                </div>
              </div>
            </AspectRatio>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <Progress
        value={(progress / currentMatch.pictures.length) * 100}
        max={100}
        orientation="vertical"
        className="absolute -left-8 h-[25%] w-2"
      />
      <div className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 transform gap-8">
        <Button
          className="h-16 w-16 rounded-full border border-primary bg-white text-red-700 hover:bg-red-400"
          onClick={() => {
            console.log("pass");
          }}
        >
          <XIcon />
        </Button>
        <Button
          className="h-16 w-16 rounded-full border border-primary bg-white text-green-700 hover:bg-green-400"
          onClick={() => {
            console.log("match");
          }}
        >
          <CheckIcon />
        </Button>
      </div>
    </div>
  );
};

export default MatchWindow;
