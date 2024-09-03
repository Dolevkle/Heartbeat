// src/services/musicServiceFactory.ts
import { MusicService } from "./musicService";
import { SpotifyService } from "./spotifyService";
import { AppleMusicService } from "~/server/api/routers/music/services/appleMusicService";

export type MusicServiceType = "spotify" | "appleMusic";

export class MusicServiceFactory {
  static create(serviceType: MusicServiceType): MusicService {
    switch (serviceType) {
      case "spotify":
        return new SpotifyService();
      case "appleMusic":
        return new AppleMusicService();
      default:
        throw new Error(`Music service ${serviceType} not supported.`);
    }
  }
}
