import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import axios from "axios";
import { env } from "~/env";
import { spotifyApi } from "~/lib/spotify";
const OPEN_API_URL = "https://api.openai.com/v1/chat/completions";

export const openAiRouter = createTRPCRouter({
  analyzePersonality: protectedProcedure
    .input(z.object({ songs: z.string().array() }))
    .mutation(async ({ input }) => {
      const data = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "you need to analyze users. if user give you a list of songs your return scores about him in the following format: Openness: low/medium/high, Conscientiousness:  low/ medium/high, extraversion:  low/ medium/high, agreeableness:  low/ medium/high,neuroticism:  low/ medium/high. return without additional info",
          },
          {
            role: "user",
            content: `songs: ${input.songs.join(", ")}`,
          },
        ],
        temperature: 0.7,
      };
      const response = await axios.post(OPEN_API_URL, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.OPEN_API_KEY}`, // Replace with your OpenAI API key
        },
      });
      return response.data.choices[0].message.content as string;
    }),
});
