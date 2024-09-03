// src/services/spotifyService.ts

import { MusicService } from "~/server/api/routers/music/services/musicService";
import { spotifyApi } from "~/app/api/auth/[...nextauth]/SpotifyProfile";

export class SpotifyService extends MusicService {
  async getPlaylist(playlistId: string): Promise<any> {
    const playlists = await spotifyApi.playlists.getUsersPlaylists(playlistId);
    return playlists.items;
  }
}
