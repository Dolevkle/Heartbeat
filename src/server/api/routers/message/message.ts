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
  getLatestMessage: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.message.findMany({
        take: 1,
        where: { chatId: input.chatId },
        orderBy: { createdAt: "desc" },
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

      await pusherServer.trigger(
        message.chatId,
        `new-message-chat-${input.chatId}`,
        message,
      );

      return message;
    }),
});
