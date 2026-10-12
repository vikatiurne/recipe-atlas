export const NUTRITION_SOURCE = {
  USDA: 'usda',
  KAGGLE: 'kaggle',
  ESTIMATED: 'estimated',
  MANUAL: 'manual',
} as const;

export type NutritionSource =
  (typeof NUTRITION_SOURCE)[keyof typeof NUTRITION_SOURCE];
