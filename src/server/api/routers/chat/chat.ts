import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const chatRouter = createTRPCRouter({
  getChats: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.chat.findMany({
        where: { users: { has: input.userId } },
      });
    }),
  createChat: protectedProcedure
    .input(
      z.object({
        users: z.string().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.chat.create({
        data: {
          users: input.users,
        },
      });
    }),
  findChatById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.chat.findUnique({ where: { id: input.id } });
    }),
});
