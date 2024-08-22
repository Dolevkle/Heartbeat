import type { User } from "@prisma/client";
import { SexualPreference } from "~/app/consts";
import { db } from "~/server/db";
import type { ParticipantDict } from "../match/match";

export type Personality = {
  Openness: "high" | "low" | "medium";
  Neuroticism: "high" | "low" | "medium";
  Extraversion: "high" | "low" | "medium";
  Conscientiousness: "high" | "low" | "medium";
  Agreeableness: "high" | "low" | "medium";
};

const LOW_VALUE = 1;
const MEDIUM_VALUE = 5;
const HIGH_VALUE = 9;
const PERCENTAGE_MULTIPLIER = 100;

const traitMapping = {
  low: LOW_VALUE,
  medium: MEDIUM_VALUE,
  high: HIGH_VALUE,
};

/**
 * Converts a user's personality traits into a numerical vector representation.
 *
 * @param personality - The user's personality traits.
 * @returns A numerical vector representation of the user's personality traits.
 */
export const convertPersonalityToVector = (personality: Personality) => {
  return [
    traitMapping[personality.Openness],
    traitMapping[personality.Neuroticism],
    traitMapping[personality.Extraversion],
    traitMapping[personality.Conscientiousness],
    traitMapping[personality.Agreeableness],
  ];
};

/**
 * Calculates the cosine similarity between two numerical vectors.
 *
 * @param vec1 - The first numerical vector.
 * @param vec2 - The second numerical vector.
 * @returns The cosine similarity between the two vectors.
 *
 * @remarks
 * The cosine similarity is a measure of similarity between two non-zero vectors
 * of an inner product space that measures the cosine of the angle between them.
 * It is defined as the dot product of the two vectors divided by the product of their magnitudes.
 *
 * @example
 * const vec1 = [1, 2, 3];
 * const vec2 = [4, 5, 6];
 * const similarity = cosineSimilarity(vec1, vec2);
 * console.log(similarity); // Output: 0.974609375
 */
const cosineSimilarity = (vec1: number[], vec2: number[]) => {
  const [dotProduct, magnitude1, magnitude2] = vec1.reduce(
    ([accDotProduct, accMagnitude1, accMagnitude2], val, i) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const product = val * vec2[i];

      return [
        accDotProduct + product,
        accMagnitude1 + val * val,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        accMagnitude2 + vec2[i] * vec2[i],
      ];
    },
    [0, 0, 0],
  );

  return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
};

/**
 * Retrieves potential matches for a given user based on their gender and sexual preference.
 *
 * @param user - The user for whom potential matches are to be retrieved.
 * @returns {Promise<User[]>} - A promise that resolves to an array of potential matches.
 */
export const getPotentialMatches = async (user: User): Promise<User[]> => {
  if (user.sexualPreference == SexualPreference.BOTH) {
    return db.user.findMany({
      where: {
        id: { not: user.id },
        OR: [
          { gender: SexualPreference.MALE },
          { gender: SexualPreference.FEMALE },
        ],
        sexualPreference: user.gender,
      },
    });
  } else {
    return db.user.findMany({
      where: {
        id: { not: user.id },
        gender: user.sexualPreference,
        OR: [
          { sexualPreference: SexualPreference.BOTH },
          { sexualPreference: user.gender },
        ],
      },
    });
  }
};

/**
 * Calculates and saves matches for a given user based on personality traits.
 *
 * @param user - The user for whom matches are to be calculated.
 * @returns {Promise<void>} - A promise that resolves when the matches are calculated and saved.
 */
export const calculateAndSaveMatches = async (user: User): Promise<void> => {
  // TODO maybe because we do 3 queries in db we need to do this in a transaction. might be smarter
  // Convert the user's personality traits into a numerical vector representation.
  const userVector = convertPersonalityToVector(
    user.personality as Personality,
  );

  // Retrieve potential matches and existing matches concurrently.
  const [potentialMatches, allMatches] = await Promise.all([
    getPotentialMatches(user),
    db.match.findMany(),
  ]);

  const existingMatches = allMatches.filter((match) =>
    Object.prototype.hasOwnProperty.call(match.userStatuses, user.id),
  );

  // Store existing match user IDs in a Set for efficient lookup.
  const existingMatchUserIds = new Set(
    existingMatches
      .flatMap((match) => Object.keys(match.userStatuses as ParticipantDict))
      .filter((id) => id !== user.id),
  );

  // Filter out potential matches that already exist.
  const newMatches = potentialMatches.filter(
    (matchUser) => !existingMatchUserIds.has(matchUser.id),
  );

  // Prepare data for batch insertion.
  const matchesToCreate = newMatches.map((matchUser) => {
    const matchVector = convertPersonalityToVector(
      matchUser.personality as Personality,
    );
    const similarity = cosineSimilarity(userVector, matchVector);
    return {
      similarity: `${Math.round(similarity * PERCENTAGE_MULTIPLIER)}%`,
      userStatuses: {
        [user.id]: "Pending",
        [matchUser.id]: "Pending",
      },
    };
  });
  if (matchesToCreate.length !== 0) {
    await db.match.createMany({
      data: matchesToCreate,
    });
  }
};
