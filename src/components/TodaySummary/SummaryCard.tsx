/**
 * SummaryCard — TodaySummary Sub-component
 * Minha Saúde Feminina
 *
 * Displays a single summary card with an icon, title and value.
 * When `accentColor` is provided (e.g. Dica do Dia), a 4dp left border
 * is rendered in that color to visually distinguish the card.
 *
 * Requirements: 4.4, 4.5, 4.6, 9.2, 9.3
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';

export interface SummaryCardProps {
  /** Ionicons icon name */
  icon: string;
  title: string;
  value: string;
  /** Optional left border highlight color (used for Dica do Dia) */
  accentColor?: string;
  /** Descriptive label for screen readers — Requirement 9.2 */
  accessibilityLabel: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  icon,
  title,
  value,
  accentColor,
  accessibilityLabel,
}) => {
  return (
    <View
      style={[styles.card, accentColor ? { borderLeftColor: accentColor, borderLeftWidth: 4 } : null]}
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="text"
    >
      {/* Icon row */}
      <Ionicons
        name={icon as React.ComponentProps<typeof Ionicons>['name']}
        size={22}
        color={accentColor ?? Colors.primary}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />

      {/* Title */}
      <Text
        style={styles.title}
        numberOfLines={1}
        allowFontScaling
        maxFontSizeMultiplier={2}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {title}
      </Text>

      {/* Value */}
      <Text
        style={styles.value}
        numberOfLines={2}
        allowFontScaling
        maxFontSizeMultiplier={2}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    // Minimum touch target — Requirement 9.3
    minWidth: 44,
    minHeight: 44,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    padding: Spacing.base,
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    // Shadow (Android)
    elevation: 2,
    // Ensure left border is visible when accentColor is absent
    borderLeftWidth: 0,
  },
  title: {
    marginTop: Spacing.sm,
    fontSize: Typography.fontSizeCaption,
    fontWeight: Typography.fontWeightMedium,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeightCaption,
  },
  value: {
    marginTop: Spacing.xs,
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeightBody,
  },
});

export default SummaryCard;
