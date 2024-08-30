"use client";
import PersonalityRadarChart from "~/app/_components/profile/PersonalityRadarChart";
import TraitCarousel, {
  type CarouselHandle,
} from "~/app/_components/profile/TraitCarousel";
import { useRef } from "react";
import { ScrollArea } from "@components/scroll-area";
import type { User } from "@prisma/client";
import type { Personality } from "~/app/signup/types";
import UserDetailsDisplay from "./UserDetails/UserDetailsDisplay";
import ChosenPlaylistDisplay from "./ChosenPlaylist/ChosenPlaylistDisplay";

interface ProfileClientProps {
  user: User;
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const carouselRef = useRef<CarouselHandle>(null);

  return (
    <ScrollArea className="rounded-md">
      <div className="grid max-h-screen grid-cols-4 gap-y-5 p-6">
        <div className="col-span-2 h-fit justify-start ">
          <UserDetailsDisplay />
        </div>
        <div className="col-span-2 row-start-2 w-full	justify-self-center">
          <ChosenPlaylistDisplay user={user} />
        </div>
        <div className="col-span-2  h-full">
          {user?.personality && (
            <PersonalityRadarChart
              personality={user?.personality as Personality}
              carouselRef={carouselRef}
            />
          )}
        </div>
        <div className="col-span-2 col-start-3 flex h-fit w-full  items-center justify-center">
          <TraitCarousel ref={carouselRef} />
        </div>
      </div>
    </ScrollArea>
  );
}
