/**
 * Design System — Border Radius Tokens
 * Minha Saúde Feminina
 *
 * All values are in density-independent pixels (dp).
 * Requirement 1.7: border radius tokens for button (8), card (12),
 * pill (999) and circle (9999).
 */

export const BorderRadius = {
  button: 8,
  card: 12,
  pill: 999,
  circle: 9999,
} as const;

export type BorderRadiusKey = keyof typeof BorderRadius;
