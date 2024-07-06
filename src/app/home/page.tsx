"use client";
import PersonalityChart from "~/app/_components/home/PersonalityChart";
import { useSession } from "next-auth/react";
import TraitCarousel from "~/app/_components/home/TraitCarousel";
export default function Page() {
  const session = useSession();
  return (
    <div className="h-full w-fit">
      <div className="h-96 w-[725px]">
        {session?.data?.user.personality && (
          <PersonalityChart personality={session?.data?.user.personality} />
        )}
        <div className="ml-24 w-fit">
          <TraitCarousel />
        </div>
      </div>
    </div>
  );
}
