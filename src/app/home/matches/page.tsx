"use client";
import Matches from "../../_components/matches";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";

export default function Page() {
  // TODO this needs to be server component if it will be everytime we enter the page it'll execute request
  const session = useSession();
  const { data: matches } = api.user.getMatches.useQuery(
    session?.data?.user.id ?? "",
    {
      enabled: session?.data?.user.id !== undefined,
    },
  );
  return (
    <div className="h-full w-fit">
      <Matches matches={matches} />
    </div>
  );
}
