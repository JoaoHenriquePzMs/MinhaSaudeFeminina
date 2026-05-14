/**
 * Header Styles
 * Minha Saúde Feminina
 *
 * Requirements: 2.1, 2.2, 2.3, 2.6, 2.7, 9.2, 9.3
 */

import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';

export const styles = StyleSheet.create({
  /**
   * Outer container — white background with elevation/shadow (Req 2.7)
   * paddingTop is applied dynamically via useSafeAreaInsets (Req 2.6)
   */
  container: {
    backgroundColor: Colors.surface,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    // Android elevation (Req 2.7)
    elevation: 3,
    // iOS shadow (Req 2.7)
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 10,
  },

  /**
   * Left section — menu button (Req 2.1)
   * Minimum touch target 44×44dp (Req 9.3)
   */
  menuButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /**
   * Center section — title (Req 2.2)
   * flex: 1 so it fills remaining space between left and right sections
   */
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },

  title: {
    fontSize: Typography.fontSizeMediumTitle,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },

  /**
   * Right section — action buttons (Req 2.3, 2.8)
   */
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /**
   * Individual action button wrapper (Req 9.3)
   * Minimum touch target 44×44dp
   */
  actionButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  /**
   * Badge overlay on action icon (Req 2.9)
   */
  badge: {
    position: 'absolute',
    top: 4,
    right: 2,
    backgroundColor: Colors.error,
    borderRadius: 999,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    // Ensure badge sits above the icon
    zIndex: 1,
  },

  badgeText: {
    color: Colors.textOnPrimary,
    fontSize: Typography.fontSizeCaption,
    fontWeight: Typography.fontWeightBold,
    lineHeight: 14,
    textAlign: 'center',
  },
});
