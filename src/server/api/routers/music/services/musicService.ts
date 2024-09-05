export type MusicService = {
  getPlaylist: (playlistId: string) => Promise<unknown>;
};
