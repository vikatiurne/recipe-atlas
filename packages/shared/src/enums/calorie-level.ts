export const CALORIE_LEVEL = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export type CalorieLevel = (typeof CALORIE_LEVEL)[keyof typeof CALORIE_LEVEL];

export const CALORIE_THRESHOLDS = {
  LOW_MAX: 300,
  MEDIUM_MAX: 600,
} as const;

export function getCalorieLevel(calories: number): CalorieLevel {
  if (calories < CALORIE_THRESHOLDS.LOW_MAX) return CALORIE_LEVEL.LOW;
  if (calories < CALORIE_THRESHOLDS.MEDIUM_MAX) return CALORIE_LEVEL.MEDIUM;
  return CALORIE_LEVEL.HIGH;
}
