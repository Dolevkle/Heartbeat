"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@components/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@components/card";
import { Sparkles } from "lucide-react";
import { api, type RouterOutputs } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { Skeleton } from "@components/skeleton";
import SideCard from "~/app/_components/SideCard";
interface Props {
  matches: RouterOutputs["user"]["getMatches"];
}
export default function Component({ matches }: Props) {
  const HIGH_MATCH = 75;
  const session = useSession();
  const ids = matches?.map(({ users }) =>
    users[0] === session.data?.user.id ? users[1] : users[0],
  );

  // TODO if you want you can save in match the whole users instead of just the ids and then this request is redundant.
  const { data: users, isLoading } = api.user.getMatchUsers.useQuery(ids, {
    enabled: ids !== undefined,
  });

  /**
   * This function maps the user IDs to their corresponding user objects from the fetched users data.
   * It ensures that the order of the users matches the order of the IDs.
   */
  const orderedUsers = ids?.map((id) => users?.find((user) => user.id === id));

  return (
    <SideCard title="Matches">
      {matches?.map((match, i) =>
        isLoading ? (
          <div key={match.id} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[75px]" />
            </div>
          </div>
        ) : (
          <div key={match.id} className="flex items-center gap-4">
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage src={orderedUsers[i]?.image ?? ""} alt="Avatar" />
              <AvatarFallback>
                {orderedUsers[i]?.name?.charAt(0) ?? ""}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                {orderedUsers[i]?.name}
              </p>
              <p className="text-sm text-muted-foreground">{users[i]?.age}</p>
            </div>
            <div className="ml-auto flex items-center space-x-3 font-medium">
              {parseFloat(match.similarity) >= HIGH_MATCH && (
                <Sparkles className="h-4 w-4 stroke-primary" />
              )}
              <span>{match.similarity}</span>
            </div>
          </div>
        ),
      )}
    </SideCard>
  );
}
