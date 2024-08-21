import Matches from "../../_components/matches";
import { api as serverApi } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import MatchWindow from "~/app/_components/matches/MatchWindow";
import type { User } from "@prisma/client";

export default async function Page() {
  const session = await getServerAuthSession();
  const potentialMatches = await serverApi.user.getMatches(
    session?.user.id ?? "",
  );

  const ids = potentialMatches?.map(({ users }) =>
    users[0] === session?.user?.id ? users[1] : users[0],
  );

  const users = ids ? await serverApi.user.findUsersByIds(ids) : [];

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
