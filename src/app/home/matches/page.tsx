"use client";
import Matches from "../../_components/matches";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
export default function Page() {
  const session = useSession();
  const { data: matches } = api.user.getMatches.useQuery(
    session.data?.user.id ?? "",
  );
  console.log(matches);
  return (
    <div className="h-full w-fit">
      <Matches matches={matches} />
    </div>
  );
}
