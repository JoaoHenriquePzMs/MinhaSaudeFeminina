/**
 * Design System — Color Tokens
 * Minha Saúde Feminina
 *
 * All color values are defined as constants to ensure consistency across the app.
 * Colors are fixed and do not adapt to the OS light/dark mode (Requirement 10.5).
 */

export const Colors = {
  // Primary palette
  primary: '#C43A4A',
  primaryLight: '#C56682',
  primaryDark: '#9E2E3B',

  // Surfaces
  background: '#FBF4EB',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfacePink: '#FBD9E5',

  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textOnPrimary: '#FFFFFF',
  textDisabled: '#9CA3AF',

  // Feedback
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Neutrals
  border: '#E5E7EB',
  divider: '#F3F4F6',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Cycle Banner gradient
  gradientStart: '#C43A4A',
  gradientEnd: '#C56682',

  // Accent
  accent: '#E7A48C',
} as const;

export type ColorKey = keyof typeof Colors;
