import Matches from "../../_components/matches";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import MatchWindow from "~/app/_components/matches/MatchWindow";

export default async function Page() {
  const session = await getServerAuthSession();
  const matches = await api.user.getMatches(session?.user.id ?? "");
  return (
    <div className="flex h-full w-full flex-row">
      <Matches matches={matches} />
      <MatchWindow />
    </div>
  );
}
