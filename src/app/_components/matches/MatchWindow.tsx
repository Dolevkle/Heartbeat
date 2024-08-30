"use client";
import React, { useState } from "react";
import Image from "next/image";
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
import type { User, Image as PrismaImage } from "@prisma/client";
import type { ConsentStatus } from "~/server/api/routers/match/match";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { analyzeBestSharedQuality } from "./utils";
import type { Personality } from "~/server/api/routers/user/service";

const PROGRESS_PERCENTAGE = 100;

interface MatchWindowProps {
  currentPotentialMatch: User;
  userPersonality: Personality;
  handleMatchStatusChange: (newStatus: ConsentStatus) => void;
  currentPotentialMatchImages: PrismaImage[];
  isLoading: boolean;
}

const MatchWindow = ({
  currentPotentialMatch,
  userPersonality,
  handleMatchStatusChange,
  currentPotentialMatchImages,
  isLoading,
}: MatchWindowProps) => {
  const [progress, setProgress] = useState<number>(1);

  const handleNext = (): void => {
    setProgress((prev) => prev + 1);
  };

  const handlePrevious = (): void => {
    setProgress((prev) => prev - 1);
  };
  // Create a motion value to track the x position
  const x = useMotionValue(0);

  // Create a rotation value that maps the x position to a degree of rotation
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);

  const analaizedPersonalityDescription = analyzeBestSharedQuality(
    currentPotentialMatch.personality as Personality,
    userPersonality,
  );

  return (
    <motion.div
      className="h-8/12 relative m-24 flex w-8/12"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(event, info) => {
        if (info.offset.x > 100) {
          handleMatchStatusChange("Yes");
        } else if (info.offset.x < -100) {
          handleMatchStatusChange("No");
        }
        // Reset the position and rotation after the swipe
        x.set(0);
      }}
      animate={{
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
    >
      <div className="flex h-full w-full rounded-md border-4 border-primary">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="w-6/12" defaultSize={52} minSize={40}>
            <Carousel
              opts={{
                align: "start",
              }}
              orientation="vertical"
              handlePrevious={handlePrevious}
              handleNext={handleNext}
            >
              <CarouselContent className="h-[73vh]">
                {currentPotentialMatchImages?.map((picture, index) => (
                  <CarouselItem key={index}>
                    <AspectRatio>
                      <Image
                        src={picture?.url ?? ""}
                        alt={`Photo of ${currentPotentialMatch?.name}`}
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
                <div className="text-4xl">{`${currentPotentialMatch?.name}, ${currentPotentialMatch?.age}`}</div>
                <div className="flex items-end text-2xl">
                  <MapPin className="h-8 w-8" />
                  {currentPotentialMatch?.city}
                </div>
                <div className="text-md mt-1">
                  {`You are both `}
                  <span className="rounded bg-white bg-clip-text px-2 py-2 text-lg font-extrabold text-transparent shadow-md">
                    {analaizedPersonalityDescription}
                  </span>
                </div>
              </div>
            </AspectRatio>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <Progress
        value={
          (progress / currentPotentialMatchImages?.length) * PROGRESS_PERCENTAGE
        }
        max={PROGRESS_PERCENTAGE}
        orientation="vertical"
        className="absolute -left-8 h-[25%] w-2"
      />
      <div className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 transform gap-8">
        <Button
          disabled={isLoading}
          className="h-16 w-16 rounded-full border border-primary bg-white text-red-700 hover:bg-red-100"
          onClick={() => {
            handleMatchStatusChange("No");
          }}
        >
          <XIcon />
        </Button>
        <Button
          disabled={isLoading}
          className="h-16 w-16 rounded-full border border-primary bg-white text-green-700 hover:bg-green-100"
          onClick={() => {
            handleMatchStatusChange("Yes");
          }}
        >
          <CheckIcon />
        </Button>
      </div>
    </motion.div>
  );
};

export default MatchWindow;
