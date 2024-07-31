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
      <div className="grid grid-cols-4 p-6">
        <div className="flex h-fit justify-start ">
          <UserDetailsDisplay />
        </div>
        <div className="mt-5 flex h-fit row-start-2  justify-start">
          <ChosenPlaylistDisplay />
        </div>
        <div className=" w-full  row-span-2 col-span-2 col-start-3 " >
          {session?.data?.user.personality && (
           <PersonalityRadarChart personality={session.data.user.personality} />
          )}
          
        </div>
        <div className="flex col-start-3 w-full col-span-2  justify-center ">
        <TraitCarousel />
        </div>
      </div>
    </ScrollArea>
  );
}
