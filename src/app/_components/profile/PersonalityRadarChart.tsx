"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { type Personality } from "~/app/signup/types";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@components/chart";
import { traitMapping } from "~/app/consts";
import { type RefObject } from "react";
import { type CarouselHandle } from "./TraitCarousel";

interface Props {
  personality: Personality;
  carouselRef: RefObject<CarouselHandle>;
}
interface graphEvent {
  activeLabel?: string;
  value?: string;
}
const chartConfig = {
  value: {
    label: "value",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const PersonalityRadarChart = ({ personality, carouselRef }: Props) => {
  const data = Object.entries(personality).map(([key, value]) => ({
    trait: key,
    value: traitMapping[value as "low" | "high" | "medium"],
  }));

  const setTraitCarouselItem = (e: graphEvent) => {
    e?.activeLabel && carouselRef.current?.setItem(e["activeLabel"]);
    e?.value && carouselRef.current?.setItem(e["value"]);
  };

  

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <RadarChart data={data} onClick={setTraitCarouselItem}>
        <ChartTooltip
          labelClassName="text-white"
          cursor={false}
          content={<ChartTooltipContent />}
        />
        <PolarAngleAxis
          dataKey="trait"
          onClick={setTraitCarouselItem}
          cursor="pointer"
        />
        <PolarGrid cursor="pointer" />
        <Radar
          dataKey="value"
          fill="hsl(var(--primary)"
          fillOpacity={0.3}
          cursor="pointer"
          dot={{
            r: 4,
            fillOpacity: 1,
          }}
        />
      </RadarChart>
    </ChartContainer>
  );
};

export default PersonalityRadarChart;
