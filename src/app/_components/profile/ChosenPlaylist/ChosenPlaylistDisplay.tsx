import React, { useEffect, useState } from "react";
import Image from "next/image";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import PlaylistSelectDialog from "./PlaylistSelectDialog";
import {Spinner} from "~/app/_components/Spinner";


const ChosenPlaylistDisplay: React.FC = () => {
  const session = useSession();
  const [isLoaded, setIsLoaded] = useState(false);


  const { data: playlist, isFetching } = api.spotify.playlistInfo.useQuery(
    { id: session.data?.user?.playlist ?? "" },
    { enabled: !!session.data },
  );
  useEffect(() => {
    if (!isFetching && playlist) {
      setIsLoaded(true);
    }
  }, [isFetching, playlist]);

  if (!isLoaded) {
    return (
      <Spinner className="my-20" size="large"/>
    );
  }

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
