import { z } from "zod";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { env } from "~/env";
import { spotifyApi } from "~/lib/spotify";
import { getServerAuthSession } from "~/server/auth";

export const spotifyRouter = createTRPCRouter({
  userPlaylists: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const playlists = await spotifyApi.playlists.getUsersPlaylists(input.id);
      console.log(playlists.items);
      return {
        playlists: playlists.items,
      };
    }),

  // update: protectedProcedure
  //   .input(
  //     z.object({
  //       id: z.string(),
  //       age: z.number().min(1),
  //       sexualPreference: z.string().min(1),
  //       gender: z.string().min(1),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const { id, gender, sexualPreference, age } = input;
  //     return ctx.db.user.update({
  //       where: { id },
  //       data: {
  //         gender,
  //         sexualPreference,
  //         age,
  //       },
  //     });
  //   }),
});
