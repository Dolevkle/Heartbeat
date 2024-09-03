import { MusicService } from "~/server/api/routers/music/services/musicService";

export class AppleMusicService extends MusicService {
  getPlaylist(playlistId: string): Promise<any> {
    return Promise.resolve(undefined);
  }
}
