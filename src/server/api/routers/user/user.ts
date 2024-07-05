import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { calculateAndSaveMatches } from "~/server/api/routers/user/service";

export const userRouter = createTRPCRouter({
  /**
   * Updates a user's information in the database.
   *
   * @remarks
   * This function is used to update a user's information in the database.
   * It is a protected procedure, meaning it requires authentication to be called.
   *
   * @param input - An object containing the user's ID and updated information.
   * @param input.id - The ID of the user to update.
   * @param input.age - The updated age of the user.
   * @param input.sexualPreference - The updated sexual preference of the user.
   * @param input.gender - The updated gender of the user.
   * @param input.personality - An object containing the updated personality traits of the user.
   *
   * @returns A promise that resolves to the updated {@link User} object.
   *
   * @throws Will throw an error if the user is not authenticated.
   *
   */
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
      return ctx.db.user.update({
        where: { id },
        data: rest,
      });
    }),
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
        return db.match.findMany({
          where: {
            users: {
              has: input,
            },
          },
          orderBy: {
            similarity: "desc",
          },
        });
      }
    }),
  /**
   * Retrieves a list of users based on their IDs.
   *
   * @remarks
   * This function is used to fetch a list of users from the database based on their IDs.
   * It is a protected procedure, meaning it requires authentication to be called.
   *
   * @param input - An array of user IDs.
   * @returns A promise that resolves to an array of {@link User} objects.
   *
   * @throws Will throw an error if the user is not authenticated.
   *
   * @example
   * ```typescript
   * const userIds = ["user1", "user2", "user3"];
   * const users = await trpc.procedure.userRouter.getMatchUsers.query(userIds);
   * console.log(users);
   * ```
   */
  findUsersByIds: protectedProcedure
    .input(z.string().array())
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findMany({
        where: {
          id: { in: input },
        },
      });
    }),
});
