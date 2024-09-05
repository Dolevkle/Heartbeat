import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { MusicServiceResolver } from "~/server/api/routers/music/services/musicServiceResolver";
import { spotifyService } from "~/server/api/routers/music/services/spotifyService";
import { appleMusicService } from "~/server/api/routers/music/services/appleMusicService";

const musicServices = [
  { type: "spotify" as const, service: appleMusicService },
  { type: "appleMusic" as const, service: spotifyService },
];
export type MusicServiceType = (typeof musicServices)[number]["type"];

const resolver = new MusicServiceResolver(musicServices);

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
      const musicService = resolver.getService(serviceType);
      return await musicService.getPlaylist(playlistId);
    }),
});
