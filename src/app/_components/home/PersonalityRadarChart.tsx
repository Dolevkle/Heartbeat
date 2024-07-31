"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { type Personality } from "~/app/signup/types";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@components/chart";
import { traitMapping } from "~/app/consts";

interface Props {
  personality: Personality;
}

const chartConfig = {
  value: {
    label: "value",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const PersonalityRadarChart = ({ personality }: Props) => {
  const data = Object.entries(personality).map(([key, value]) => ({
    trait: key,
    value: traitMapping[value as "low" | "high" | "medium"],
  }));

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <RadarChart data={data}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <PolarAngleAxis dataKey="trait" />
        <PolarGrid />
        <Radar
          dataKey="value"
          fill="hsl(var(--primary)"
          fillOpacity={0.3}
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
