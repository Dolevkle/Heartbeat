import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const imageRouter = createTRPCRouter({
  findMany: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.image.findMany({
        where: {
          userId: input,
        },
      });
    }),
  groupImagesByIds: protectedProcedure
    .input(z.string().array())
    .query(async ({ ctx, input }) => {
      const images = await ctx.db.image.findMany({
        where: {
          userId: { in: input },
        },
      });

      // Group images by userId in a single function
      const groupedImages = images.reduce<Record<string, typeof images>>(
        (acc, image) => {
          const { userId } = image;

          if (!acc[userId]) {
            acc[userId] = []; // Initialize the array if it doesn't exist
          }

          acc[userId].push(image); // Add the image to the corresponding userId group

          return acc;
        },
        {} as Record<string, typeof images>,
      );

      return groupedImages;
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
        playlist: z.string(),
        city: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;
      return ctx.db.user.update({
        where: { id },
        data: rest,
      });
    }),

  deleteOne: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.image.deleteMany({
        where: {
          url: input,
        },
      });
      return { success: true };
    }),
});
