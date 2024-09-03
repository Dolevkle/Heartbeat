import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  MusicServiceFactory,
  MusicServiceType,
} from "~/server/api/routers/music/services/musicServiceFactory";

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
      const service = MusicServiceFactory.create(serviceType);
      return await service.getPlaylist(playlistId);
    }),
});
