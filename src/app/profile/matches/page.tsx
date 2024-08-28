import type { User } from "@prisma/client";
import MatchWindowClient from "~/app/_components/matches/MatchWindowClient";
import {
  analyzeBestQuality,
  getPotentialMatchesIds,
} from "~/app/_components/matches/utils";
import type { Personality } from "~/server/api/routers/user/service";
import { getServerAuthSession } from "~/server/auth";
import { api as serverApi } from "~/trpc/server";

export default async function Page() {
  const session = await getServerAuthSession();
  const user: User = session?.user;
  const userId = user.id ?? "";
  const userPersonality = user.personality as Personality;
  const analaizedPersonalityDescription = analyzeBestQuality(userPersonality);

  const potentialMatches = await serverApi.match.getMatches(userId);

  const ids: string[] = getPotentialMatchesIds(potentialMatches, userId);

  const users = ids.length > 0 ? await serverApi.user.findUsersByIds(ids) : [];

  return (
    <MatchWindowClient
      userId={userId}
      analaizedPersonalityDescription={analaizedPersonalityDescription}
      initialPotentialMatches={potentialMatches}
      initialUsers={users}
    />
  );
}
