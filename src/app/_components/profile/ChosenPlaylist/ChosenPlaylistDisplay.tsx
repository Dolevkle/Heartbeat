import React from "react";
import Image from "next/image";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import PlaylistSelectDialog from "./PlaylistSelectDialog";

const ChosenPlaylistDisplay: React.FC = () => {
  const session = useSession();

  const { data: playlist } = api.spotify.playlistInfo.useQuery(
    { id: session.data?.user?.playlist ?? "" },
    { enabled: !!session.data },
  );

  return (
    <div className="flex w-full flex-col  items-center overflow-hidden rounded p-4 text-white shadow-lg">
      <div className="relative">
        <Image
          src={playlist?.images[0]?.url ?? ""}
          width={200}
          height={100}
          alt={"could not fetch the picture..."}
        />
        <PlaylistSelectDialog />
      </div>
      <div className="mt-3 flex items-center justify-center text-xl font-bold">
        {playlist?.name}
      </div>
    </div>
  );
};

export default ChosenPlaylistDisplay;
