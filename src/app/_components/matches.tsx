"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@components/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@components/card";
import { Sparkles } from "lucide-react";
import { api, type RouterOutputs } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { Skeleton } from "@components/skeleton";
interface Props {
  matches: RouterOutputs["user"]["getMatches"];
}
export default function Component({ matches }: Props) {
  const HIGH_MATCH = 60;
  const session = useSession();
  const ids = matches?.map(({ users }) =>
    users[0] === session.data?.user.id ? users[1] : users[0],
  );
  const { data: users, isLoading } = api.user.getMatchUsers.useQuery(ids, {
    enabled: ids !== undefined,
  });

  return (
    <Card className="h-full w-64 rounded-l-none rounded-r rounded-bl-none border-card">
      <CardHeader>
        <CardTitle>Matches</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
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
                <AvatarImage src={users[i]?.image ?? ""} alt="Avatar" />
                <AvatarFallback>
                  {users[i]?.name?.charAt(0) ?? ""}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {users[i]?.name}
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
      </CardContent>
    </Card>
  );
}
