import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  MusicServiceResolver,
  MusicServiceType,
} from "~/server/api/routers/music/services/musicServiceResolver";

const resolver = new MusicServiceResolver();

export const musicRouter = createTRPCRouter({
  userPlaylists: protectedProcedure
    .input(
      z.object({
        playlistId: z.string(),
        serviceType: z.custom<MusicServiceType>(),
      }),
    )
    .query(async ({ input }) => {
      const { serviceType, playlistId } = input;
      const service = resolver.getService(serviceType);
      return await service.getPlaylist(playlistId);
    }),
});
