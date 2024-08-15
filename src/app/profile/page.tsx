"use client";
import PersonalityChart from "~/app/_components/profile/PersonalityChart";
import PersonalityRadarChart from "~/app/_components/profile/PersonalityRadarChart";
import { useSession } from "next-auth/react";
import TraitCarousel, {CarouselHandle} from "~/app/_components/profile/TraitCarousel";
import ChosenPlaylistDisplay from "../_components/profile/ChosenPlaylist/ChosenPlaylistDisplay";
import UserDetailsDisplay from "../_components/profile/UserDetails/UserDetailsDisplay";
import { ScrollArea } from "../_components/shadcn/scroll-area";
import { useRef } from "react";

export default function Page() {
  const session = useSession();
  const carouselRef = useRef<CarouselHandle>(null);
  return (
    <ScrollArea className="rounded-md">
      <div className="grid grid-cols-4 p-6">
        <div className="flex h-fit justify-start ">
          <UserDetailsDisplay />
        </div>
        <div className="row-start-2 mt-5 flex h-fit  justify-start">
          <ChosenPlaylistDisplay />
        </div>
        <div className=" col-span-2  col-start-3 row-span-2 w-full ">
          {session?.data?.user.personality && (
            <PersonalityRadarChart
              personality={session.data.user.personality}
              carouselRef={carouselRef}
            />
          )}
        </div>
        <div className="col-span-2 col-start-3 flex w-full  justify-center ">
          <TraitCarousel ref={carouselRef}/>
        </div>
      </div>
    </ScrollArea>
  );
}
