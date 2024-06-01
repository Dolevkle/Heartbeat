import Matches from "../../_components/matches";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { Suspense } from "react";
export default async function Page() {
  const session = await getServerAuthSession();
  const matches = await api.user.getMatches(session?.user.id ?? "");
  return (
    <div className="h-full w-fit">
      <Suspense fallback="Loading matches...">
        <Matches matches={matches} />
      </Suspense>
    </div>
  );
}
