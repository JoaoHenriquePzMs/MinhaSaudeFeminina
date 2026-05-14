/**
 * CycleBanner — StyleSheet
 * Minha Saúde Feminina
 *
 * Requirements: 3.1, 3.4, 3.5, 9.2, 9.3
 */

import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';

export const styles = StyleSheet.create({
  /** Outer wrapper that receives the LinearGradient as background */
  container: {
    borderRadius: BorderRadius.card,   // 12dp — Requirement 3.5
    overflow: 'hidden',
  },

  /** LinearGradient fills the container */
  gradient: {
    padding: Spacing.lg,              // 20dp — Requirement 3.5
    borderRadius: BorderRadius.card,
  },

  // ─── Configured state ────────────────────────────────────────────────────

  /** "Você está no Xº dia do ciclo" */
  dayText: {
    color: Colors.textOnPrimary,      // white — Requirement 3.4
    fontSize: Typography.fontSizeMediumTitle,
    fontWeight: Typography.fontWeightSemiBold,
    lineHeight: Typography.lineHeightMediumTitle,
    marginBottom: Spacing.md,
  },

  /** Badge wrapper */
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },

  /** Phase name inside the badge */
  badgeText: {
    color: Colors.textOnPrimary,      // white — Requirement 3.4
    fontSize: Typography.fontSizeCaption,
    fontWeight: Typography.fontWeightBold,
    letterSpacing: 0.5,
  },

  // ─── Unconfigured state ───────────────────────────────────────────────────

  /** "Configure seu ciclo para ver informações personalizadas" */
  ctaText: {
    color: Colors.textOnPrimary,      // white — Requirement 3.4
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightRegular,
    lineHeight: Typography.lineHeightBody,
    marginBottom: Spacing.md,
  },

  /** "Configurar agora" button */
  configureButton: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.button,
    minWidth: 44,                     // Requirement 9.3
    minHeight: 44,                    // Requirement 9.3
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /** Label inside the "Configurar agora" button */
  configureButtonText: {
    color: Colors.primary,
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightSemiBold,
  },
});
