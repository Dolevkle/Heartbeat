import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { pusher } from "~/lib/pusher";

export const messageRouter = createTRPCRouter({
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
  getMessages: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.message.findMany({
        where: { chatId: input.chatId },
      });
    }),
  createMessage: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        chatId: z.string(),
        message: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.db.message.create({
        data: {
          content: input.message,
          chat: {
            connect: {
              id: input.chatId,
            },
          },
          sender: {
            connect: {
              id: input.userId,
            },
          },
        },
      });

      await pusher.trigger(message.chatId, "new-message", message);

      return message;
    }),
});
