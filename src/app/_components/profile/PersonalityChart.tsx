import { BarChart, Bar, CartesianGrid, XAxis } from "recharts";
import { type Personality } from "~/app/signup/types";
import { type ChartConfig, ChartContainer } from "@components/chart";

interface Props {
  personality: Personality;
}

const LOW_VALUE = 1;
const MEDIUM_VALUE = 5;
const HIGH_VALUE = 9;

const traitMapping = {
  low: LOW_VALUE,
  medium: MEDIUM_VALUE,
  high: HIGH_VALUE,
};

const chartConfig = {
  name: {
    label: "name",
    color: "#e11d48",
  },
} satisfies ChartConfig;
// TODO this is personality chart widget.
//  We can do multiple widgets in user page.
//  Another idea I had for widget is trait carousel,
//  We can display each trait and explain what it means in a carousel widget.
const PersonalityChart = ({ personality }: Props) => {
  const data = Object.entries(personality).map(([key, value]) => ({
    name: key,
    measure: traitMapping[value as "low" | "high" | "medium"],
  }));
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <Bar dataKey="measure" fill="var(--color-name)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};

export default PersonalityChart;
