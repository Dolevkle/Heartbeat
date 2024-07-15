import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { BsPencilSquare } from "react-icons/bs"; // Example icon from react-icons
import { Button } from "@components/button";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";

const ChosenPlaylistDisplay: React.FC = () => {
  const session = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetches the user's playlists from the Spotify API.
  const { data: playlist } = api.spotify.playlistInfo.useQuery(
    { id: session.data?.user?.playlist ?? "" },
    { enabled: !!session.data },
  );

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative max-w-sm overflow-hidden rounded p-4 text-white shadow-lg">
      <Image
        src={playlist?.images[0]?.url ?? ""}
        width={300}
        height={300}
        alt={""}
      />
      <Button
        className="relative left-1/2 flex h-12 w-12 -translate-x-1/2 transform rounded-full border-none text-white"
        onClick={handleOpenModal}
      >
        <BsPencilSquare className="text-2xl" />
      </Button>
      <div className="mt-3 flex items-center justify-center text-xl font-bold">
        {playlist?.name}
      </div>
    </div>
  );
};

export default ChosenPlaylistDisplay;
