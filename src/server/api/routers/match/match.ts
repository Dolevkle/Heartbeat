import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { calculateAndSaveMatches } from "~/server/api/routers/user/service";

export type ConsentStatus = "Yes" | "No" | "Pending";

export type ParticipantDict = Record<string, ConsentStatus>;

export const matchRouter = createTRPCRouter({
  /**
   * Retrieves a list of matches for a given user.
   *
   * @remarks
   * This function is used to fetch a list of matches from the database for a specific user.
   * It is a protected procedure, meaning it requires authentication to be called.
   * The matches are calculated and saved in the database using the `calculateAndSaveMatches` function.
   *
   * @param input - The ID of the user for whom to retrieve matches.
   * @returns A promise that resolves to an array of {@link Match} objects, sorted by similarity in descending order.
   *
   * @throws Will throw an error if the user is not authenticated.
   *
   * @example
   * ```typescript
   * const userId = "user1";
   * const matches = await trpc.procedure.userRouter.getMatches.query(userId);
   * console.log(matches);
   * ```
   */
  getMatches: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({ where: { id: input } });
      if (user) {
        await calculateAndSaveMatches(user);
        // Fetch all matches
        const allMatches = await db.match.findMany({
          // Prisma does not support querying JSON dictionary keys directly
          orderBy: {
            similarity: "desc",
          },
        });

        // Filter matches where the participants field contains the user ID
        const existingMatches = allMatches.filter(
          (match) =>
            match.userStatuses &&
            Object.prototype.hasOwnProperty.call(match.userStatuses, input),
        );

        return existingMatches;
      }

      return [];
    }),

  /**
   * Deletes a user's matches from the database.
   *
   * @remarks
   * This function is used to delete all matches where a specific user is a participant.
   * It is a protected procedure, meaning it requires authentication to be called.
   *
   * @param input - The ID of the user for whom to delete matches.
   *
   * @returns A promise that resolves to a success message.
   *
   * @throws Will throw an error if the user is not authenticated.
   */
  deleteMany: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // Step 1: Fetch all matches
      const allMatches = await ctx.db.match.findMany();

      // Step 2: Filter matches to find those where the user ID is a key in the participants dictionary
      const matchesToDelete = allMatches.filter((match) => {
        const participants = match.userStatuses as ParticipantDict;
        return participants.hasOwnProperty(input);
      });

      // Step 3: Delete filtered matches
      if (matchesToDelete.length > 0) {
        await ctx.db.match.deleteMany({
          where: {
            id: {
              in: matchesToDelete.map((match) => match.id),
            },
          },
        });
      }

      return { success: true };
    }),
});
