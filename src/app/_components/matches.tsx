import { Avatar, AvatarFallback, AvatarImage } from "@components/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@components/card";
import { Sparkles } from "lucide-react";
import { api, RouterOutputs } from "~/trpc/react";
import { useSession } from "next-auth/react";
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
  if (isLoading) return "kaki";
  return (
    <Card className="h-full w-fit rounded-l-none rounded-r rounded-bl-none border-card">
      <CardHeader>
        <CardTitle>Matches</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {matches?.map((match, i) => (
          <div key={match.id} className="flex items-center gap-4">
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage src={users[i]?.image ?? ""} alt="Avatar" />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                {users[i]?.name}
              </p>
              <p className="text-sm text-muted-foreground">{users[i]?.email}</p>
            </div>
            <div className="ml-auto flex items-center space-x-3 font-medium">
              {parseFloat(match.similarity) >= HIGH_MATCH && (
                <Sparkles className="h-4 w-4 stroke-primary" />
              )}
              <span>{match.similarity}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
