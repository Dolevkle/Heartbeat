import type { User } from "@prisma/client";
import { db } from "~/server/db";

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
export const cosineSimilarity = (vec1: number[], vec2: number[]) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const dotProduct = vec1.reduce((acc, val, i) => acc + val * vec2[i], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((acc, val) => acc + val * val, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (magnitude1 * magnitude2);
};

/**
 * Retrieves potential matches for a given user based on their gender and sexual preference.
 *
 * @param user - The user for whom potential matches are to be retrieved.
 * @returns {Promise<User[]>} - A promise that resolves to an array of potential matches.
 */
export const getPotentialMatches = async (user: User): Promise<User[]> => {
  return db.user.findMany({
    where: {
      gender: user.sexualPreference,
      sexualPreference: user.gender,
    },
  });
};

/**
 * Calculates and saves matches for a given user based on personality traits.
 *
 * @param user - The user for whom matches are to be calculated.
 * @returns {Promise<void>} - A promise that resolves when the matches are calculated and saved.
 */
export const calculateAndSaveMatches = async (user: User): Promise<void> => {
  // Convert the user's personality traits into a numerical vector representation.
  const userVector = convertPersonalityToVector(
    user.personality as Personality,
  );

  // Retrieve potential matches based on the user's gender and sexual preference.
  const potentialMatches = await getPotentialMatches(user);

  // Begin a database transaction to ensure atomicity and consistency.
  await db.$transaction(async (transaction) => {
    // Iterate through each potential match.
    for (const matchUser of potentialMatches) {
      // Convert the potential match's personality traits into a numerical vector representation.
      const matchVector = convertPersonalityToVector(
        matchUser.personality as Personality,
      );

      // Calculate the cosine similarity between the user's and potential match's personality vectors.
      const similarity = cosineSimilarity(userVector, matchVector);

      // Check if a match already exists between the user and potential match.
      const matchExist = await transaction.match.findFirst({
        where: {
          users: { has: matchUser.id },
        },
      });

      // If no match exists, create a new match record in the database.
      if (!matchExist) {
        await transaction.match.create({
          data: {
            similarity: `${Math.round(similarity * PERCENTAGE_MULTIPLIER)}%`,
            users: [user.id, matchUser.id],
          },
        });
      }
    }
  });
};
