"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@components/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@components/card";
import { Sparkles } from "lucide-react";
import { api, type RouterOutputs } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { Skeleton } from "@components/skeleton";
import SideCard from "~/app/_components/SideCard";
import UserCard from "~/app/_components/UserCard";
import UserCardSkeleton from "~/app/_components/UserCardSkeleton";
interface Props {
  matches: RouterOutputs["user"]["getMatches"];
}
export default function Component({ matches }: Props) {
  const session = useSession();
  const ids = matches?.map(({ users }) =>
    users[0] === session.data?.user.id ? users[1] : users[0],
  );

  // TODO if you want you can save in match the whole users instead of just the ids and then this request is redundant.
  const { data: users, isLoading } = api.user.findUsersByIds.useQuery(ids, {
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
          <UserCardSkeleton key={match.id} />
        ) : (
          <UserCard key={match.id} user={orderedUsers?.[i]} />
        ),
      )}
    </SideCard>
  );
}
