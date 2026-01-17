/**
 * Animation constants used throughout the app
 * Centralized to ensure consistency and easy maintenance
 */

// Home screen animation delays (staggered cascade effect)
export const ANIMATION_DELAYS = {
  header: 100,
  streak: 200,
  weeklyProgress: 250,
  workout: 300,
  insights: 400,
  stats: 500,
  tip: 600,
} as const;

// Standard animation durations
export const ANIMATION_DURATION = 600;

// Scale values for press interactions
export const SCALE_VALUES = {
  pressed: 0.98,
  hover: 1.05,
  normal: 1,
} as const;

// Workout path map animation constants
export const PATH_ANIMATION = {
  // Node entry delays (staggered per node)
  nodeEntryDelay: 80,
  nodeEntryDuration: 400,

  // Active node pulse animation
  pulseDuration: 800,
  pulseScale: 1.1,

  // Path connector animation
  pathFillDuration: 600,

  // Completion celebration
  completionDelay: 200,
  completionDuration: 500,
} as const;

// Exercise node sizes
export const NODE_SIZES = {
  default: 64,
  active: 72,
  completed: 64,
} as const;

// Node state colors (use with theme.colors)
export const NODE_STATE_KEYS = {
  completed: 'success',
  active: 'primary',
  upcoming: 'gray',
  locked: 'gray',
} as const;
