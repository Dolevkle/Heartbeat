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
    <div className="relative max-w-sm overflow-hidden rounded p-4 text-white shadow-lg">
      <Image
        src={playlist?.images[0]?.url ?? ""}
        width={300}
        height={300}
        alt={"could not fetch the picture..."}
      />
      <PlaylistSelectDialog />
      <div className="mt-3 flex items-center justify-center text-xl font-bold">
        {playlist?.name}
      </div>
    </div>
  );
};

export default ChosenPlaylistDisplay;
