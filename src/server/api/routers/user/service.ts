import type { PrismaClient, User } from "@prisma/client";

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

const traitMapping = {
  low: LOW_VALUE,
  medium: MEDIUM_VALUE,
  high: HIGH_VALUE,
};

export const convertPersonalityToVector = (personality: Personality) => {
  const {
    Openness,
    Neuroticism,
    Extraversion,
    Conscientiousness,
    Agreeableness,
  } = personality;

  return [
    traitMapping[Openness],
    traitMapping[Neuroticism],
    traitMapping[Extraversion],
    traitMapping[Conscientiousness],
    traitMapping[Agreeableness],
  ];
};

export const cosineSimilarity = (vec1: number[], vec2: number[]) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const dotProduct = vec1.reduce((acc, val, i) => acc + val * vec2[i], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((acc, val) => acc + val * val, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (magnitude1 * magnitude2);
};

export const getPotentialMatches = async (user: User, db: PrismaClient) => {
  return db.user.findMany({
    where: {
      gender: user.sexualPreference,
      sexualPreference: user.gender,
    },
  });
};

export const calculateAndSaveMatches = async (user: User, db: PrismaClient) => {
  const { personality } = user;
  const userVector = convertPersonalityToVector(personality as Personality);
  const potentialMatches = await getPotentialMatches(user, db);

  const matches = potentialMatches.map(({ id, personality }) => {
    const matchVector = convertPersonalityToVector(personality as Personality);
    const cosineSim = cosineSimilarity(userVector, matchVector);
    const similarity = ((cosineSim + 1) / 2) * 100; // Map to 0-100% range
    return {
      user1_id: user.id,
      user2_id: id,
      similarity: similarity,
    };
  });

  await db.match.createMany({
    data: matches,
  });
};
