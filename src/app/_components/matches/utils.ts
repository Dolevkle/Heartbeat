import type { Match } from "@prisma/client";
import { traitDictionary, traitMapping } from "~/app/consts";
import type { Level, Personality } from "~/server/api/routers/user/service";

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

// Get the numeric value of a level
const getLevelValue = (level: Level): number => traitMapping[level];

// Calculate scores for each trait
const calculateTraitScores = (
  personality: Personality,
): Record<keyof Personality, number> => {
  return Object.entries(personality).reduce(
    (acc, [trait, level]) => {
      acc[trait as keyof Personality] = getLevelValue(level);
      return acc;
    },
    {} as Record<keyof Personality, number>,
  );
};

// Find the highest score among shared traits
const findHighestSharedScore = (
  traitScores1: Record<keyof Personality, number>,
  traitScores2: Record<keyof Personality, number>,
): number => {
  return Math.max(
    ...Object.keys(traitScores1)
      .filter((trait) => trait in traitScores2)
      .map((trait) =>
        Math.min(
          traitScores1[trait as keyof Personality],
          traitScores2[trait as keyof Personality],
        ),
      ),
  );
};

// Find common traits with the highest score
const findBestSharedTraits = (
  traitScores1: Record<keyof Personality, number>,
  traitScores2: Record<keyof Personality, number>,
  highestSharedScore: number,
): (keyof Personality)[] => {
  return Object.keys(traitScores1).filter(
    (trait) =>
      trait in traitScores2 &&
      Math.min(
        traitScores1[trait as keyof Personality],
        traitScores2[trait as keyof Personality],
      ) === highestSharedScore,
  ) as (keyof Personality)[];
};

// Get the description of a trait from the dictionary
const getTraitDescription = (trait: keyof Personality): string => {
  return traitDictionary[trait];
};

// Main function to analyze the best shared quality
export const analyzeBestSharedQuality = (
  personality1: Personality,
  personality2: Personality,
): string => {
  const traitScores1 = calculateTraitScores(personality1);
  const traitScores2 = calculateTraitScores(personality2);

  const highestSharedScore = findHighestSharedScore(traitScores1, traitScores2);
  const bestSharedTraits = findBestSharedTraits(
    traitScores1,
    traitScores2,
    highestSharedScore,
  );

  // Ensure bestSharedTraits is not empty and handle cases properly
  if (bestSharedTraits.length > 0 && bestSharedTraits[0]) {
    return getTraitDescription(bestSharedTraits[0]);
  }

  return "";
};
