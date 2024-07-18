import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const matchRouter = createTRPCRouter({
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
  deleteMany: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.match.deleteMany({
        where: {
          users: {
            has: input,
          },
        },
      });
      return { success: true };
    }),
});
