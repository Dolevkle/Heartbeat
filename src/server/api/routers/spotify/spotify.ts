import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { spotifyApi } from "~/app/api/auth/[...nextauth]/SpotifyProfile";

export const spotifyRouter = createTRPCRouter({
  /**
   * Retrieves a list of a user's playlists.
   *
   * @remarks
   * This procedure is protected and requires a valid access token.
   *
   * @param input - An object containing the user's ID.
   * @param input.id - The Spotify user ID.
   *
   * @returns A promise that resolves to an array of simplified playlist objects.
   *
   * @throws Will throw an error if the request fails or if the access token is invalid.
   *
   * @example
   * ```typescript
   * const userPlaylists = await trpc.spotifyRouter.userPlaylists.query({ id: 'user_id' });
   * console.log(userPlaylists);
   * ```
   */
  userPlaylists: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const playlists = await spotifyApi.playlists.getUsersPlaylists(input.id);
      return playlists.items;
    }),
  /**
   * Retrieves a list of tracks from a specific playlist.
   *
   * @remarks
   * This procedure is protected and requires a valid access token.
   *
   * @param input - An object containing the playlist's ID.
   * @param input.id - The Spotify playlist ID.
   *
   * @returns A promise that resolves to an array of playlist track objects.
   *
   * @throws Will throw an error if the request fails or if the access token is invalid.
   *
   * @example
   * ```typescript
   * const playlistTracks = await trpc.spotifyRouter.tracks.query({ id: 'playlist_id' });
   * console.log(playlistTracks);
   * ```
   */
  tracks: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const tracks = await spotifyApi.playlists.getPlaylistItems(input.id);
      return tracks.items;
    }),
  /**
   * Retrieves detailed information about a specific playlist.
   *
   * @remarks
   * This procedure is protected and requires a valid access token.
   *
   * @param input - An object containing the playlist's ID.
   * @param input.id - The Spotify playlist ID.
   *
   * @returns A promise that resolves to detailed information about the playlist.
   *
   * @throws Will throw an error if the request fails or if the access token is invalid.
   *
   * @example
   * ```typescript
   * const playlistInfo = await trpc.spotifyRouter.playlistInfo.query({ id: 'playlist_id' });
   * console.log(playlistInfo);
   * ```
   */
  playlistInfo: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const playlistInfo = await spotifyApi.playlists.getPlaylist(input.id);
      return playlistInfo;
    }),
});
