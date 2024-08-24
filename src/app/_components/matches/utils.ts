import type { Match } from "@prisma/client";

export const getPotentialMatchesIds = (
  potentialMatches: Match[],
  userId: string,
): string[] =>
  potentialMatches?.flatMap(({ userStatuses }) => {
    if (userStatuses) {
      const participantIds = Object.keys(userStatuses);
      return participantIds.filter((id) => id !== userId);
    }
    return [];
  });
