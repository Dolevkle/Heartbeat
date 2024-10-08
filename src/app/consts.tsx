export const genders = ["male", "female"];

export const sexualPreferences = ["male", "female", "both"];

export const LOW_VALUE = 1;
export const MEDIUM_VALUE = 5;
export const HIGH_VALUE = 9;
export enum SexualPreference {
  MALE = "male",
  FEMALE = "female",
  BOTH = "both",
}

export const traitMapping = {
  low: LOW_VALUE,
  medium: MEDIUM_VALUE,
  high: HIGH_VALUE,
};

export const traitDictionary = {
  Openness: "open-minded and creative",
  Neuroticism: "emotionally perceptive and responsive",
  Extraversion: "outgoing and energetic",
  Conscientiousness: "organized and dependable",
  Agreeableness: "compassionate and cooperative",
};
