"use client";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";
import { type Personality } from "~/app/signup/types";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@components/chart";

interface Props {
  personality: Personality;
}

const LOW_VALUE = 1;
const MEDIUM_VALUE = 3;
const HIGH_VALUE = 5;
const MAX_VALUE = 6

const traitMapping = {
  low: LOW_VALUE,
  medium: MEDIUM_VALUE,
  high: HIGH_VALUE,
};

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
  console.log(data)
  return (
    <ChartContainer config={chartConfig} className="h-full w-full h-full">
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
