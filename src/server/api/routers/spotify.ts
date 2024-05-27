import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { spotifyApi } from "~/lib/spotify";

export const spotifyRouter = createTRPCRouter({
  userPlaylists: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const playlists = await spotifyApi.playlists.getUsersPlaylists(input.id);
      return playlists.items;
    }),
  tracks: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const tracks = await spotifyApi.playlists.getPlaylistItems(input.id);
      return tracks.items;
    }),
});
