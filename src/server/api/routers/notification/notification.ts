import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import redis from "~/server/redis";

export const notificationRouter = createTRPCRouter({
  getNotifications: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const { userId } = input;

      // Fetch notifications from Redis

      const notifications = await redis.lrange(
        `notifications:${userId}`,
        0,
        -1,
      );

      // Optionally clear the notifications after fetching them
      // await redis.del(`notifications:${userId}`);

      return { notifications };
    }),
});
