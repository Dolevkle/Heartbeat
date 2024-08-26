import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const imageRouter = createTRPCRouter({
  /**
   * Updates a user's matches information in the database.
   *
   * @remarks
   * This function is used to delete a user's matches information in the database.
   * It is a protected procedure, meaning it requires authentication to be called.
   *
   * @param input - The ID of the user for whom to delete matches.
   *
   * @returns A promise that resolves to a success message.
   *
   * @throws Will throw an error if the user is not authenticated.
   *
   */
  findMany: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.image.findMany({
        where: {
            userId : input
        },
      });
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
            url : input,
        },
      });
      return { success: true };
    }),



    
});


