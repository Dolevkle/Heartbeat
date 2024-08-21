import Matches from "../../_components/matches";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import MatchWindow from "~/app/_components/matches/MatchWindow";
import type { User, Match } from "@prisma/client";

export default async function Page() {
  const session = await getServerAuthSession();
  const potentialMatches: Match = await api.match.getMatches(
    session?.user.id ?? "",
  );

  const ids = potentialMatches?.flatMap(({ userStatuses }) => {
    // Get all the participant IDs
    const participantIds = Object.keys(userStatuses);

    // Filter out the session ID
    const filteredIds = participantIds.filter((id) => id !== session?.user?.id);

    // If there's exactly one remaining ID, return it; otherwise, handle as needed
    return filteredIds.length > 0 ? filteredIds : [];
  });

  const users = ids ? await api.user.findUsersByIds(ids) : [];

  const orderedUsers: User[] = ids?.map(
    (id) => users?.find((user) => user.id === id) as User,
  );

  return (
    <div className="flex h-full w-full flex-row">
      <Matches potentialMatches={orderedUsers} isLoadingUsers={false} />
      {orderedUsers.length > 0 ? (
        <MatchWindow currentPotentialMatch={orderedUsers[0]} />
      ) : (
        "no matches"
      )}
    </div>
  );
}
