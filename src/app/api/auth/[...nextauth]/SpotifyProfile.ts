import SpotifyProvider from "next-auth/providers/spotify";
import { env } from "~/env";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

if (!env.SPOTIFY_CLIENT_ID) throw new Error("Missing SPOTIFY_CLIENT_ID");

if (!env.SPOTIFY_CLIENT_SECRET)
  throw new Error("Missing SPOTIFY_CLIENT_SECRET");

const spotifyProfile = SpotifyProvider({
  clientId: env.SPOTIFY_CLIENT_ID,
  clientSecret: env.SPOTIFY_CLIENT_SECRET,
});

const authURL = new URL("https://accounts.spotify.com/authorize");

const scopes = [
  "user-read-private",
  "user-read-email",
  "user-read-recently-played",
  "user-library-read",
  "playlist-read-collaborative",
  "user-read-currently-playing",
  "playlist-read-private",
  "user-follow-read",
  "user-top-read",
  "user-modify-playback-state",
  "user-read-playback-state",
  "streaming",
];

authURL.searchParams.append("scope", scopes.join(" "));

spotifyProfile.authorization = authURL.toString();

export const spotifyApi = SpotifyApi.withClientCredentials(
  env.SPOTIFY_CLIENT_ID,
  env.SPOTIFY_CLIENT_SECRET,
  scopes,
);

export default spotifyProfile;

// export async function refreshAccessToken(token: JWT) {
//   try {
//     const refreshedTokens = await axios.post(
//       "https://accounts.spotify.com/authorize",
//       {
//         scope: scopes.join(" "),
//       },
//     );
//
//     if (!refreshedTokens) {
//       throw refreshedTokens;
//     }
//
//     return {
//       ...token,
//       access_token: refreshedTokens.access_token,
//       token_type: refreshedTokens.token_type,
//       expires_at: refreshedTokens.expires_at,
//       expires_in: (refreshedTokens.expires_at ?? 0) - Date.now() / 1000,
//       refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
//       scope: refreshedTokens.scope,
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       ...token,
//       error: "RefreshAccessTokenError",
//     };
//   }
// }
