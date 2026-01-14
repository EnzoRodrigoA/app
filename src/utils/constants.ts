/**
 * Animation constants used throughout the app
 * Centralized to ensure consistency and easy maintenance
 */

export const ANIMATION_DELAYS = {
  header: 100,
  streak: 200,
  weeklyProgress: 250,
  workout: 300,
  insights: 400,
  stats: 500,
  tip: 600,
} as const;

export const ANIMATION_DURATION = 600;

export const SCALE_VALUES = {
  pressed: 0.98,
  hover: 1.05,
  normal: 1,
} as const;
