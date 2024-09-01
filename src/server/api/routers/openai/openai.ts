import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";

export const openAiRouter = createTRPCRouter({
  analyzePersonality: protectedProcedure
    .input(z.object({ songs: z.string().array() }))
    .mutation(async ({ input }) => {
      const { object: personality } = await generateObject({
        model: openai("gpt-4-turbo"),
        system:
          "you need to analyze users. if user give you a list of songs your return scores about him in the following format: Openness: low/medium/high, Conscientiousness:  low/ medium/high, extraversion:  low/ medium/high, agreeableness:  low/ medium/high,neuroticism:  low/ medium/high. return without additional info",
        prompt: input.songs.join(", "),
        schema: z.object({
          Openness: z.string(),
          Neuroticism: z.string(),
          Extraversion: z.string(),
          Conscientiousness: z.string(),
          Agreeableness: z.string(),
        }),
      });
      return personality;
    }),
});
