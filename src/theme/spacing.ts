/**
 * Design System — Spacing Tokens
 * Minha Saúde Feminina
 *
 * All values are in density-independent pixels (dp).
 * Requirement 1.6: spacing tokens for xs (4), sm (8), md (12), base (16),
 * lg (20), xl (24), xxl (32) and xxxl (48).
 */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export type SpacingKey = keyof typeof Spacing;
