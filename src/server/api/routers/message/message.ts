import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { pusherServer } from "~/server/pusher";

export const messageRouter = createTRPCRouter({
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
        isImage: z.boolean()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.db.message.create({
        data: {
          content: input.message,
          isImage: input.isImage,
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

      await pusherServer.trigger(
        message.chatId,
        `new-message-chat-${input.chatId}`,
        message,
      );

      return message;
    }),
});
