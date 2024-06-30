import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { type Personality } from "~/app/signup/types";

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
    <ResponsiveContainer width="100%" height="100%">
      <BarChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="measure"
          fill="#e11d48"
          activeBar={<Rectangle fill="white" stroke="#e11d48" />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PersonalityChart;
