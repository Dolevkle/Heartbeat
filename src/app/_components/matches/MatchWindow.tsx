"use client";
import React, { useRef, useState } from "react";
import { ScrollArea, ScrollBar } from "../shadcn/scroll-area";
import Image from "next/image";
import exampleImage from "public/assets/loading-image.png";
import { Separator } from "../shadcn/separator";

const matchData = [
  {
    artist: "Ornella Binni",
    art: exampleImage,
  },
  {
    artist: "Tom Byrom",
    art: exampleImage,
  },
  {
    artist: "Vladimir Malyavko",
    art: exampleImage,
  },
];

const MatchWindow: React.FC = () => {
  return (
    <div className="m-24 mr-2 h-full w-8/12 flex-row rounded-md border border-primary">
      <div>
        <ScrollArea className="w-6/12 flex-col whitespace-nowrap align-middle">
          {matchData.map((data, index) => (
            <Image
              key={index}
              src={data.art}
              alt={`Photo by ${data.artist}`}
              className="w-full overflow-hidden rounded-md object-contain"
              width={300}
              height={400}
            />
          ))}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
      <Separator orientation="vertical" className="text-white-500 ml-1 mr-1" />
    </div>
  );
};

export default MatchWindow;
