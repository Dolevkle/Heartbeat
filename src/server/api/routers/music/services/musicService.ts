export abstract class MusicService {
  abstract getPlaylist(playlistId: string): Promise<any>;
}
