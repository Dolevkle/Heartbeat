import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user/user";
import { spotifyRouter } from "~/server/api/routers/spotify/spotify";
import { openAiRouter } from "~/server/api/routers/openai/openai";
import { messageRouter } from "~/server/api/routers/message/message";
import { chatRouter } from "~/server/api/routers/chat/chat";
import { matchRouter } from "./routers/match/match";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  chat: chatRouter,
  message: messageRouter,
  openAi: openAiRouter,
  spotify: spotifyRouter,
  user: userRouter,
  match: matchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
