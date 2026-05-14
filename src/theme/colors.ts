/**
 * Design System — Color Tokens
 * Minha Saúde Feminina
 *
 * All color values are defined as constants to ensure consistency across the app.
 * Colors are fixed and do not adapt to the OS light/dark mode (Requirement 10.5).
 */

export const Colors = {
  // Primary palette
  primary: '#7C3AED',
  primaryLight: '#A78BFA',
  primaryDark: '#5B21B6',

  // Surfaces
  background: '#F8F7FF',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

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
  gradientStart: '#7C3AED',
  gradientEnd: '#A855F7',
} as const;

export type ColorKey = keyof typeof Colors;
