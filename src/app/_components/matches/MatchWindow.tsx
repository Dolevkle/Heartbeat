"use client";
import React from "react";
import { ScrollArea, ScrollBar } from "../shadcn/scroll-area";
import Image from "next/image";
import exampleImage from "public/assets/profilePic.png";
import { Separator } from "../shadcn/separator";
import { AspectRatio } from "../shadcn/aspect-ratio";
import { MapPin } from "lucide-react";

const matchData = [
  {
    artist: "Ornella Binni",
    age: 23,
    city: "Holon",
    art: exampleImage,
  },
  {
    artist: "Tom Byrom",
    age: 20,
    city: "Tel-Aviv",
    art: exampleImage,
  },
  {
    artist: "Vladimir Malyavko",
    age: 25,
    city: "Eilat",
    art: exampleImage,
  },
];

const MatchWindow: React.FC = () => {
  return (
    <div className="h-8/12 m-24 mr-2 flex w-8/12 rounded-md border-4 border-primary">
      <ScrollArea className="w-6/12">
        {matchData.map((data, index) => (
          <AspectRatio key={index}>
            <Image
              src={data.art}
              alt={`Photo by ${data.artist}`}
              className="object-cover"
              fill
            />
          </AspectRatio>
        ))}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      <Separator
        orientation="vertical"
        className="ml-0.5 mr-0.5 w-0.5 bg-secondary"
      />
      <ScrollArea className="w-6/12 bg-primary pl-4">
        {matchData.map((data, index) => (
          <AspectRatio key={index}>
            <div className="flex h-full w-full flex-col justify-center gap-1 object-cover font-bold">
              <div className="text-4xl">{`${data.artist}, ${data.age}`}</div>
              <div className="flex items-end text-2xl">
                <MapPin className="h-8 w-8" />
                {data.city}
              </div>
            </div>
          </AspectRatio>
        ))}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};

export default MatchWindow;
