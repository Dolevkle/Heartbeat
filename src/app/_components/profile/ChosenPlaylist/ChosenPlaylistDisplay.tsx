import React from "react";
import Image from "next/image";
import { api } from "~/trpc/react";
import PlaylistSelectDialog from "./PlaylistSelectDialog";
import type { User } from "@prisma/client";

interface ChosenPlaylistDisplayProps {
  user: User;
}
const ChosenPlaylistDisplay: React.FC<ChosenPlaylistDisplayProps> = ({user}: ChosenPlaylistDisplayProps) => {
  
  const { data: playlist } = api.spotify.playlistInfo.useQuery(
    { id: user?.playlist ?? "" },
    { enabled: !!user },
  );

  return (
    <div className="flex w-full flex-col  items-center overflow-hidden rounded p-4 text-white shadow-lg">
      <div className="relative">
        <Image
          src={
            playlist?.images
              ? playlist?.images[0]?.url
              : "/assets/defaultPlaylist.png"
          }
          width={300}
          height={300}
          alt={"could not fetch the picture..."}
        />
        {playlist && <PlaylistSelectDialog />}
      </div>
      <div className="mt-3 flex items-center justify-center text-xl font-bold">
        {playlist?.name}
      </div>
    </div>
  );
};

export default ChosenPlaylistDisplay;
