"use client";
import PersonalityChart from "~/app/_components/PersonalityChart";
import { useSession } from "next-auth/react";
export default function Page() {
  const session = useSession();
  return (
    <div className="h-full w-fit">
      <div className="h-96 w-[725px]">
        {session?.data?.user.personality && (
          <PersonalityChart personality={session?.data?.user.personality} />
        )}
      </div>
    </div>
  );
}
