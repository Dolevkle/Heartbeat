"use client";

import MatchWindow from "~/app/_components/matches/MatchWindow";
import { api as reactApi } from "~/trpc/react";
import type { User } from "@prisma/client";
import { toast } from "~/app/_components/shadcn/use-toast";
import type { ConsentStatus } from "~/server/api/routers/match/match";

interface MatchWindowClientProps {
  potentialMatch: User;
  matchId: string;
  sessionUserId: string;
}

export default function MatchWindowClient({
  potentialMatch,
  matchId,
  sessionUserId,
}: MatchWindowClientProps) {
  const { mutate: updateUserStatus, isPending: isUpdatingUserStatus } =
    reactApi.match.updateUserStatus.useMutation({
      onSuccess: async () => {
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
      matchId,
      userId: sessionUserId,
      newStatus,
    });
  };

  return (
    <MatchWindow
      currentPotentialMatch={potentialMatch}
      handleMatchStatusChange={handleMatchStatusChange}
    />
  );
}
