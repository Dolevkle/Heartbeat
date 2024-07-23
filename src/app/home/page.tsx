"use client";
import PersonalityChart from "~/app/_components/home/PersonalityChart";
import PersonalityRadarChart from "~/app/_components/home/PersonalityRadarChart"
import { useSession } from "next-auth/react";
import TraitCarousel from "~/app/_components/home/TraitCarousel";
import ChosenPlaylistDisplay from "../_components/home/ChosenPlaylist/ChosenPlaylistDisplay";
import UserDetailsDisplay from "../_components/home/UserDetails/UserDetailsDisplay";
import { ScrollArea } from "../_components/shadcn/scroll-area";

export default function Page() {
  const session = useSession();
  return (
    <ScrollArea className="rounded-md">
      <div className="flex h-full w-full flex-wrap items-center overflow-auto p-6">
        <div className="flex h-fit w-full justify-start ">
          <UserDetailsDisplay />
        </div>
        <div className="mt-5 flex h-fit w-[30%] justify-start">
          <ChosenPlaylistDisplay />
        </div>
        <div className="flex h-96 w-[35%] justify-start items-center" >
          {session?.data?.user.personality && (
           <PersonalityRadarChart personality={session.data.user.personality} />
          )}
          
        </div>
        <div className="flex h-96 w-[35%] align-middle ">
        <TraitCarousel />
        </div>
      </div>
    </ScrollArea>
  );
}
