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
import { useState } from "react";
import { ScrollArea, ScrollBar } from "./shadcn/scroll-area";

interface Props {
  matches: RouterOutputs["user"]["getMatches"];
}
export default function Component({ matches }: Props) {
  const session = useSession();
  const ids = matches?.map(({ users }) =>
    users[0] === session.data?.user.id ? users[1] : users[0],
  );

  const { data: users, isLoading } = api.user.findUsersByIds.useQuery(ids, {
    enabled: ids !== undefined,
  });

  const orderedUsers = ids?.map((id) => users?.find((user) => user.id === id));

  const [selectedId, setSelectedId] = useState<string | undefined>();

  const handleUserCardClick = (id: string | undefined) => setSelectedId(id);

  return (
    <SideCard title="Matches">
      <div className="flex flex-row">
        <ScrollArea>
          <div className="mb-4 ml-4 flex flex-row">
            {matches?.map((match, i) =>
              isLoading ? (
                <UserCardSkeleton key={match.id} />
              ) : (
                <UserCard
                  key={match.id}
                  user={orderedUsers?.[i]}
                  isSelected={
                    selectedId ===
                    (orderedUsers?.[i] ? orderedUsers[i]?.id : undefined)
                  }
                  onClick={handleUserCardClick}
                />
              ),
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <Sparkles />
      </div>
    </SideCard>
  );
}
