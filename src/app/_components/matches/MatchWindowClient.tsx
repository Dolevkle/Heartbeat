"use client";

import MatchWindow from "~/app/_components/matches/MatchWindow";
import type { Match, User } from "@prisma/client";
import { api as clientApi } from "~/trpc/react";
import { toast } from "~/app/_components/shadcn/use-toast";
import type { ConsentStatus } from "~/server/api/routers/match/match";
import Matches from "./matches";
import { getPotentialMatchesIds } from "./utils";
import Image from "next/image";
import NoMatchesImage from "../../../../public/assets/chats.jpg";

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

  const { data: matchImages } = clientApi.image.groupImagesByIds.useQuery(ids, {
    enabled: !!ids,
    initialData: {},
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

  const {
    mutate: updateUserStatus,
    variables: userStatusVariables,
    isPending: isUpdatingUserStatus,
  } = clientApi.match.updateUserStatus.useMutation({
    onSuccess: async () => {
      if (checkIfMatch) {
        createChat({ users: participantsIds });
      }
      await refetchPotentialMatches();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Match status was not updated!",
      });
    },
  });

  const checkIfMatch =
    statuses.length > 0 &&
    userStatusVariables?.newStatus === "Yes" &&
    statuses.some(
      (status, index) => status === "Yes" && participantsIds[index] !== userId,
    );

  const handleMatchStatusChange = (newStatus: ConsentStatus): void => {
    updateUserStatus({
      matchId: potentialMatches[0]?.id ?? "",
      userId,
      newStatus,
    });
  };

  const isAnyMatchesLeft = users.length > 0;
  const isPageLoading =
    isUpdatingUserStatus || isLoadingPotentialMatches || isLoadingUsers;
  const currentPotentialMatch = users[0];

  const NoMatchesDisplay = () => (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Image src={NoMatchesImage} alt="No matches" width={512} height={512} />
      <div className="mt-4 text-center text-2xl text-white">
        no matches. come back later...
      </div>
    </div>
  );

  return (
    <div className="flex h-full w-full flex-row">
      <Matches
        potentialMatches={isAnyMatchesLeft ? users : []}
        potentialMatchesImages={matchImages}
        isLoadingUsers={isPageLoading}
      />
      {isAnyMatchesLeft ? (
        <MatchWindow
          currentPotentialMatch={currentPotentialMatch}
          currentPotentialMatchImages={matchImages[currentPotentialMatch?.id]}
          isLoading={isPageLoading}
          handleMatchStatusChange={handleMatchStatusChange}
        />
      ) : (
        <NoMatchesDisplay />
      )}
    </div>
  );
}
