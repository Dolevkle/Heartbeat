import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import axios from "axios";
import { env } from "~/env";
const OPEN_API_URL = "https://api.openai.com/v1/chat/completions";

export const openAiRouter = createTRPCRouter({
  analyzePersonality: publicProcedure
    .input(z.object({ genre: z.string(), songs: z.string().array() }))
    .query(async ({ input }) => {
      const { genre, songs } = input;
      const data = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "you need to analyze users. if user give you a music genre and 3 songs your return scores about him in the following format: Openness: low/medium/high, Conscientiousness:  low/ medium/high, extraversion:  low/ medium/high, agreeableness:  low/ medium/high,neuroticism:  low/ medium/high. return without additional info",
          },
          {
            role: "user",
            content: `genre: ${genre} songs: ${songs.join(", ")}`,
          },
        ],
        temperature: 0.7,
      };
      const response = await axios.post(OPEN_API_URL, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.NEXT_PUBLIC_OPEN_API_KEY}`, // Replace with your OpenAI API key
        },
      });
      return response.data.choices[0].message.content as string;
    }),
});
