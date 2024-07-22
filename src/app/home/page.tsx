"use client";
import PersonalityChart from "~/app/_components/home/PersonalityChart";
import { useSession } from "next-auth/react";
import TraitCarousel from "~/app/_components/home/TraitCarousel";
import ChosenPlaylistDisplay from "../_components/home/ChosenPlaylist/ChosenPlaylistDisplay";
import UserDetailsDisplay from "../_components/home/UserDetails/UserDetailsDisplay";
import { ScrollArea } from "../_components/shadcn/scroll-area";

export default function Page() {
  const session = useSession();
  return (
    <ScrollArea className="rounded-md">
      <div className="flex h-full w-fit flex-wrap items-center overflow-auto p-6">
        <div className="flex h-fit w-[30%] justify-center">
          <UserDetailsDisplay />
        </div>
        <div className="flex h-fit w-[70%] justify-center">
          <TraitCarousel />
        </div>
        <div className="mt-5 flex h-fit w-[30%] justify-center">
          <ChosenPlaylistDisplay />
        </div>
        <div className="flex h-96 w-[70%]">
          {session?.data?.user.personality && (
            <PersonalityChart personality={session?.data?.user.personality} />
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
