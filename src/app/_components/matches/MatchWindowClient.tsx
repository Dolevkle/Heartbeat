"use client";

import MatchWindow from "~/app/_components/matches/MatchWindow";
import type { Match, User } from "@prisma/client";
import { api as clientApi } from "~/trpc/react";
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
  } = clientApi.match.getMatches.useQuery(userId, {
    enabled: !!userId,
    initialData: initialPotentialMatches,
  });

  const ids: string[] = getPotentialMatchesIds(potentialMatches, userId);

  const { data: users, isLoading: isLoadingUsers } =
    clientApi.user.findUsersByIds.useQuery(ids, {
      initialData: initialUsers,
    });

  const { mutate: createChat } = clientApi.chat.createChat.useMutation({
    onError: () => {
      toast({
        variant: "destructive",
        title: "Chat Creation Failed",
      });
    },
  });

  const statuses: ConsentStatus[] = Object.values(
    potentialMatches[0]?.userStatuses ?? [],
  );

  const participantsIds: string[] = Object.keys(
    potentialMatches[0]?.userStatuses ?? [],
  );

  const checkIfAMatch =
    statuses.length > 0 && statuses.every((status) => status === "Yes");

  const { mutate: updateUserStatus, isPending: isUpdatingUserStatus } =
    clientApi.match.updateUserStatus.useMutation({
      onSuccess: async () => {
        await refetchPotentialMatches();
        if (checkIfAMatch) {
          createChat({ users: participantsIds });
        }
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Match status was not updated!",
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

  const isAnyMatchesLeft = ids.length > 0;
  const isPageLoading =
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
