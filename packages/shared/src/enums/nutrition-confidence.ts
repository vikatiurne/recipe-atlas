export const NUTRITION_CONFIDENCE = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export type NutritionConfidence =
  (typeof NUTRITION_CONFIDENCE)[keyof typeof NUTRITION_CONFIDENCE];
