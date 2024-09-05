import { type MusicService } from "~/server/api/routers/music/services/musicService";

export const appleMusicService: MusicService = {
  getPlaylist: (playlistId: string) => {
    return Promise.resolve(undefined);
  },
};
