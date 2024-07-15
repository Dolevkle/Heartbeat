"use client";
import PersonalityChart from "~/app/_components/home/PersonalityChart";
import { useSession } from "next-auth/react";
import TraitCarousel from "~/app/_components/home/TraitCarousel";
import ChosenPlaylistDisplay from "../_components/home/ChosenPlaylistDisplay";

export default function Page() {
  const session = useSession();
  return (
    <div className="m-2 flex h-full w-fit flex-wrap items-center">
      <div className="flex h-96 w-[60%]">
        {session?.data?.user.personality && (
          <PersonalityChart personality={session?.data?.user.personality} />
        )}
      </div>
      <div className="flex h-fit w-[40%] justify-center">
        <ChosenPlaylistDisplay />
      </div>
      <div className="mt-1 flex h-fit w-[60%] justify-center">
        <TraitCarousel />
      </div>
    </div>
  );
}
