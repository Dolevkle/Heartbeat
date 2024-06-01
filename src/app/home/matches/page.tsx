import Matches from "../../_components/matches";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
export default async function Page() {
  const session = await getServerAuthSession();
  const matches = await api.user.getMatches(session?.user.id ?? "");
  return (
    <div className="h-full w-fit">
      <Matches matches={matches} />
    </div>
  );
}
