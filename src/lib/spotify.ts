import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { env } from "~/env";

const scopes = [
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "streaming",
  "user-read-private",
  "user-library-read",
  "user-top-read",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-follow-read",
];

const params = {
  scope: scopes.join(","),
};

const queryParamsString = new URLSearchParams(params);

const AUTH_URL = `https://accounts.spotify.com/authorize?${queryParamsString.toString()}`;

export const spotifyApi = SpotifyApi.withClientCredentials(
  env.SPOTIFY_CLIENT_ID,
  env.SPOTIFY_CLIENT_SECRET,
  scopes,
);

export { AUTH_URL };
