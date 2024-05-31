import { z } from "zod";

export type Personality = {
  Openness: string;
  Neuroticism: string;
  Extraversion: string;
  Conscientiousness: string;
  Agreeableness: string;
};

export interface CreateUserPayload extends z.infer<typeof userSchema> {
  id: string;
  personality: Personality;
}

export const userSchema = z.object({
  age: z.coerce
    .number()
    .min(1, { message: "Invalid age below" })
    .max(120, "Invalid age, above limit"), // Validates the string as an email
  sexualPreference: z
    .string()
    .min(1, { message: "sexual preference cannot be empty" }), // Ensures the first name is not empty
  gender: z.string().min(1, { message: "gender cannot be empty" }), // Ensures the last name is not empty
  playlist: z.string(),
});
