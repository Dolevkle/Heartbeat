// src/services/spotifyService.ts

import { spotifyApi } from "~/app/api/auth/[...nextauth]/SpotifyProfile";
import { type MusicService } from "~/server/api/routers/music/services/musicService";

export const spotifyService: MusicService = {
  getPlaylist: async (playlistId: string) => {
    const playlists = await spotifyApi.playlists.getUsersPlaylists(playlistId);
    return playlists.items;
  },
};
