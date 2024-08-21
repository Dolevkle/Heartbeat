import Matches from "../../_components/matches";
import { api as serverApi } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import type { User, Match } from "@prisma/client";
import type { ParticipantDict } from "~/server/api/routers/match/match";
import MatchWindowClient from "~/app/_components/matches/MatchWindowClient";

export default async function Page() {
  const session = await getServerAuthSession();
  const potentialMatches: Match[] = await serverApi.match.getMatches(
    session?.user.id ?? "",
  );

  const ids = potentialMatches?.flatMap(({ userStatuses }) => {
    if (userStatuses) {
      const participantIds = Object.keys(userStatuses as ParticipantDict);
      return participantIds.filter((id) => id !== session?.user?.id);
    }

    return [];
  });

  const users = ids.length > 0 ? await serverApi.user.findUsersByIds(ids) : [];

  const orderedUsers: User[] = ids?.map(
    (id) => users.find((user) => user.id === id) as User,
  );

  return (
    <div className="flex h-full w-full flex-row">
      <Matches potentialMatches={orderedUsers} isLoadingUsers={false} />
      {orderedUsers.length > 0 ? (
        <MatchWindowClient
          potentialMatch={orderedUsers[0]}
          matchId={potentialMatches[0]?.id ?? ""}
          sessionUserId={session?.user.id ?? ""}
        />
      ) : (
        "No matches"
      )}
    </div>
  );
}
