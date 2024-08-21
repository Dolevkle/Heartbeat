import MatchWindowClient from "~/app/_components/matches/MatchWindowClient";
import { getServerAuthSession } from "~/server/auth";
import { api as serverApi } from "~/trpc/server";

export default async function Page() {
  const session = await getServerAuthSession();
  const userId = session?.user.id ?? "";

  // Fetch data server-side
  const potentialMatches = await serverApi.match.getMatches(userId);

  const ids = potentialMatches?.flatMap(({ userStatuses }) => {
    if (userStatuses) {
      const participantIds = Object.keys(userStatuses);
      return participantIds.filter((id) => id !== userId);
    }
    return [];
  });

  const users = ids.length > 0 ? await serverApi.user.findUsersByIds(ids) : [];

  return (
    <MatchWindowClient
      userId={userId}
      initialPotentialMatches={potentialMatches}
      initialUsers={users}
    />
  );
}
