/**
 * TodaySummary — StyleSheet
 * Minha Saúde Feminina
 *
 * Requirements: 4.1, 4.2, 4.7, 9.3
 */

import { StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../../theme';

export const styles = StyleSheet.create({
  /** Outer section wrapper */
  container: {
    // Horizontal padding is applied by HomeScreen (16dp)
  },

  // ─── Header row ──────────────────────────────────────────────────────────

  /** Row containing the section title and "Ver todos" link — Requirement 4.1 */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  /** "Resumo de Hoje" — Requirement 4.1 */
  sectionTitle: {
    fontSize: Typography.fontSizeMediumTitle,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeightMediumTitle,
  },

  /**
   * "Ver todos" touchable — Requirement 4.2, 9.3
   * minWidth/minHeight ensure the 44×44dp touch target.
   */
  viewAllButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  /** "Ver todos" label text */
  viewAllText: {
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightMedium,
    color: Colors.primary,
    lineHeight: Typography.lineHeightBody,
  },

  // ─── Horizontal scroll ───────────────────────────────────────────────────

  /** ScrollView content container — Requirement 4.7 */
  scrollContent: {
    paddingRight: Spacing.base,
    gap: Spacing.md,
  },
});
