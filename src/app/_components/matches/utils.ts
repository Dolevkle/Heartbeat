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

// Find the highest score
const findHighestScore = (
  traitScores: Record<keyof Personality, number>,
): number => {
  return Math.max(...Object.values(traitScores));
};

// Find traits with the highest score
const findBestTraits = (
  traitScores: Record<keyof Personality, number>,
  highestScore: number,
): (keyof Personality)[] => {
  return Object.entries(traitScores)
    .filter(([_, score]) => score === highestScore)
    .map(([trait]) => trait as keyof Personality);
};

// Get the description of a trait from the dictionary
const getTraitDescription = (trait: keyof Personality): string => {
  return traitDictionary[trait];
};

// Main function to analyze the best quality
export const analyzeBestQuality = (personality: Personality): string => {
  const traitScores = calculateTraitScores(personality);
  const highestScore = findHighestScore(traitScores);
  const bestTraits = findBestTraits(traitScores, highestScore);

  // Ensure bestTraits is not empty and handle cases properly
  if (bestTraits.length > 0 && bestTraits[0]) {
    return getTraitDescription(bestTraits[0]);
  }

  return "";
};
