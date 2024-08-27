"use client";
import PersonalityChart from "~/app/_components/profile/PersonalityChart";
import PersonalityRadarChart from "~/app/_components/profile/PersonalityRadarChart"
import { useSession } from "next-auth/react";
import TraitCarousel, { CarouselHandle } from "~/app/_components/profile/TraitCarousel";
import ChosenPlaylistDisplay from "../_components/profile/ChosenPlaylist/ChosenPlaylistDisplay";
import UserDetailsDisplay from "../_components/profile/UserDetails/UserDetailsDisplay";
import { ScrollArea } from "../_components/shadcn/scroll-area";
import { useRef } from "react";
import ProfilePictureDisplay from "../_components/home/ProfilePicture/ProfilePictureDisplay";

export default function Page() {
  const session = useSession();
  const carouselRef = useRef<CarouselHandle>(null);
  return (
    // <ScrollArea className="rounded-md">
    <div className="grid max-h-screen grid-cols-4 p-6">
      <div className="col-span-2 h-fit justify-start ">
        <UserDetailsDisplay />
      </div>
      {/*<div className="flex h-fit justify-start ">*/}
      {/*  <ProfilePictureDisplay />*/}
      {/*</div>*/}
      <div className="col-span-2 row-start-2 mt-5 flex h-fit  justify-self-center	">
        <ChosenPlaylistDisplay />
      </div>
      <div className="col-span-2  h-full">
        {session?.data?.user.personality && (
          <PersonalityRadarChart
            personality={session.data.user.personality}
            carouselRef={carouselRef}
          />
        )}
      </div>
      <div className="col-span-2 col-start-3 flex h-fit  w-full items-center justify-center">
        <TraitCarousel ref={carouselRef} />
      </div>
    </div>
    // </ScrollArea>
  );
}
