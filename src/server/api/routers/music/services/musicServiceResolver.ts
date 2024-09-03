// src/services/musicServiceDispatcher.ts
import { type MusicService } from "./musicService";
import { SpotifyService } from "./spotifyService";
import { AppleMusicService } from "./appleMusicService";

export type MusicServiceType = "spotify" | "appleMusic";

export class MusicServiceResolver {
  private services: Map<MusicServiceType, MusicService>;

  constructor() {
    this.services = new Map<MusicServiceType, MusicService>();
    this.services.set("spotify", new SpotifyService());
    this.services.set("appleMusic", new AppleMusicService());
  }

  public getService(serviceType: MusicServiceType): MusicService {
    const service = this.services.get(serviceType);
    if (!service)
      throw new Error(`Music service ${serviceType} not supported.`);
    return service;
  }
}
