"use client";

import MatchWindow from "~/app/_components/matches/MatchWindow";
import type { Match, User } from "@prisma/client";
import { api as reactApi } from "~/trpc/react";
import { toast } from "~/app/_components/shadcn/use-toast";
import type { ConsentStatus } from "~/server/api/routers/match/match";
import Matches from "../matches";
import { getPotentialMatchesIds } from "./utils";

interface MatchWindowClientProps {
  userId: string;
  initialPotentialMatches: Match[];
  initialUsers: User[];
}

export default function MatchWindowClient({
  userId,
  initialPotentialMatches,
  initialUsers,
}: MatchWindowClientProps) {
  const {
    data: potentialMatches,
    isLoading: isLoadingPotentialMatches,
    refetch: refetchPotentialMatches,
  } = reactApi.match.getMatches.useQuery(userId, {
    enabled: !!userId,
    initialData: initialPotentialMatches,
  });

  const ids: string[] = getPotentialMatchesIds(potentialMatches, userId);

  const { data: users, isLoading: isLoadingUsers } =
    reactApi.user.findUsersByIds.useQuery(ids, {
      initialData: initialUsers,
    });

  const { mutate: updateUserStatus, isPending: isUpdatingUserStatus } =
    reactApi.match.updateUserStatus.useMutation({
      onSuccess: async () => {
        await refetchPotentialMatches();
        toast({
          title: "Success",
          description: "User status successfully updated",
        });
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "User status was not updated!",
        });
      },
    });

  const handleMatchStatusChange = (newStatus: ConsentStatus): void => {
    updateUserStatus({
      matchId: potentialMatches[0]?.id ?? "",
      userId,
      newStatus,
    });
  };

  const isAnyMatchesLeft: boolean = ids.length > 0;
  const isPageLoading: boolean =
    isUpdatingUserStatus || isLoadingPotentialMatches || isLoadingUsers;

  return (
    <div className="flex h-full w-full flex-row">
      <Matches
        potentialMatches={isAnyMatchesLeft ? users : []}
        isLoadingUsers={isPageLoading}
      />
      {isAnyMatchesLeft ? (
        <MatchWindow
          currentPotentialMatch={users[0]}
          isLoading={isPageLoading}
          handleMatchStatusChange={handleMatchStatusChange}
        />
      ) : (
        "No matches"
      )}
    </div>
  );
}
