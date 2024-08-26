import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
   * @param input.playlist - The updated playlist of the user.
   * @param input.city - The updated city of the user.
   *
   * @returns A promise that resolves to the updated {@link User} object.
   *
   * @throws Will throw an error if the user is not authenticated.
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
   * const users = await trpc.procedure.userRouter.findUsersByIds.query(userIds);
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

  /**
   * Retrieves a user based on the ID.
   *
   * @remarks
   * This function is used to fetch a user from the database based on the ID.
   * It is a protected procedure, meaning it requires authentication to be called.
   *
   * @param input - User ID.
   * @returns A promise that resolves to the {@link User}.
   *
   * @throws Will throw an error if the user is not authenticated.
   *
   * @example
   * ```typescript
   * const userId = "userID";
   * const user = await trpc.procedure.userRouter.findUserById.query(userId);
   * console.log(user);
   * ```
   */
  findUserById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: {
          id: input,
        },
      });
    }),
});
