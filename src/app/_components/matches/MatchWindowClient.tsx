"use client";

import { useQuery } from "@tanstack/react-query";
import MatchWindow from "~/app/_components/matches/MatchWindow";
import type { Match, User } from "@prisma/client";
import { api as reactApi } from "~/trpc/react";
import { toast } from "~/app/_components/shadcn/use-toast";
import type { ConsentStatus } from "~/server/api/routers/match/match";
import Matches from "../matches";

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
    data: potentialMatches = initialPotentialMatches,
    refetch: refetchPotentialMatches,
  } = useQuery({
    queryKey: ["potentialMatches", userId],
    queryFn: async () => {
      // Optionally implement refetch logic here
    },
    enabled: !!userId, // Disable automatic refetching
  });

  const ids = potentialMatches?.flatMap(({ userStatuses }) => {
    if (userStatuses) {
      const participantIds = Object.keys(userStatuses);
      return participantIds.filter((id) => id !== userId);
    }
    return [];
  });

  const { data: users = initialUsers } = useQuery({
    queryKey: ["users", ids],
    queryFn: async () => {
      // Optionally implement refetch logic here
    },
    enabled: ids.length > 0, // Disable automatic refetching
  });

  const { mutate: updateUserStatus, isPending: isUpdatingUserStatus } =
    reactApi.match.updateUserStatus.useMutation({
      onSuccess: async () => {
        await refetchPotentialMatches(); // Refetch matches after a successful status update
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

  const handleMatchStatusChange = (newStatus: ConsentStatus) => {
    updateUserStatus({
      matchId: potentialMatches[0]?.id ?? "",
      userId,
      newStatus,
    });
  };

  return (
    <div className="flex h-full w-full flex-row">
      <Matches potentialMatches={users} isLoadingUsers={false} />
      {users.length > 0 ? (
        <MatchWindow
          currentPotentialMatch={users[0]}
          handleMatchStatusChange={handleMatchStatusChange}
        />
      ) : (
        "No matches"
      )}
    </div>
  );
}
