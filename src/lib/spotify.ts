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

const authURL = new URL("https://accounts.spotify.com/authorize");
authURL.searchParams.append("scope", scopes.join(" "));

export const spotifyApi = SpotifyApi.withClientCredentials(
  env.SPOTIFY_CLIENT_ID,
  env.SPOTIFY_CLIENT_SECRET,
  scopes,
);
export { authURL };
