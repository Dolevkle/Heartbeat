import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        age: z.number().min(1),
        sexualPreference: z.string().min(1),
        gender: z.string().min(1),
        personality: z.object({
          Openness: z.string(),
          Neuroticism: z.string(),
          Extraversion: z.string(),
          Conscientiousness: z.string(),
          Agreeableness: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;
      // TODO maybe I need to populate matches here
      return ctx.db.user.update({
        where: { id },
        data: rest,
      });
    }),
});
