import MatchWindowClient from "~/app/_components/matches/MatchWindowClient";
import { getPotentialMatchesIds } from "~/app/_components/matches/utils";
import type { Personality } from "~/server/api/routers/user/service";
import { getServerAuthSession } from "~/server/auth";
import { api as serverApi } from "~/trpc/server";
import { redirect } from "next/navigation";



export default async function Page() {
  const session = await getServerAuthSession();
  if (!session?.user?.personality) redirect("/signup");
  const user = session?.user;
  const userId = user?.id ?? "";
  const userPersonality = user?.personality as Personality;
  const potentialMatches = await serverApi.match.getMatches(userId);
  const ids: string[] = getPotentialMatchesIds(potentialMatches, userId);
  const users = ids.length > 0 ? await serverApi.user.findUsersByIds(ids) : [];

  return (
    <MatchWindowClient
      userId={userId}
      userPersonality={userPersonality}
      initialPotentialMatches={potentialMatches}
      initialUsers={users}
    />
  );
}
