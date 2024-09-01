import { z } from "zod";

export type Personality = {
  Openness: string;
  Neuroticism: string;
  Extraversion: string;
  Conscientiousness: string;
  Agreeableness: string;
};

export const userSchema = z.object({
  age: z.coerce
    .number()
    .min(1, { message: "Invalid age below" })
    .max(120, "Invalid age, above limit"),
  sexualPreference: z
    .string()
    .min(1, { message: "sexual preference cannot be empty" }),
  gender: z.string().min(1, { message: "gender cannot be empty" }),
  playlist: z.string().min(1, { message: "playlist cannot be empty" }),
  city: z.string().min(1, { message: "city cannot be empty" }),
});
