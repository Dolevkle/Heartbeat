// src/services/musicServiceDispatcher.ts
import { type MusicService } from "./musicService";
import { type MusicServiceType } from "~/server/api/routers/music/music";

export class MusicServiceResolver {
  private services: Map<MusicServiceType, MusicService>;

  constructor(services: { type: MusicServiceType; service: MusicService }[]) {
    this.services = new Map<MusicServiceType, MusicService>(
      services.map(({ type, service }) => [type, service]),
    );
  }

  public getService(serviceType: MusicServiceType): MusicService {
    const service = this.services.get(serviceType);
    if (!service)
      throw new Error(`Music service ${serviceType} not supported.`);
    return service;
  }
}
