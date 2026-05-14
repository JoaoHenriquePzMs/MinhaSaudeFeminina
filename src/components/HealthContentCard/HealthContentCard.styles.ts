/**
 * HealthContentCard — Styles
 * Minha Saúde Feminina
 *
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 9.2
 */

import { StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';

/** Fixed size for the 1:1 article image (Req 6.3). */
export const IMAGE_SIZE = 80;

export const styles = StyleSheet.create({
  // ── Outer card wrapper ──────────────────────────────────────────────────
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,   // 12dp (Req 1.7)
    padding: Spacing.base,             // 16dp (Req 1.6)
    // Elevation / shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },

  // ── Text area (left side) ───────────────────────────────────────────────
  textContainer: {
    flex: 1,
    marginRight: Spacing.md,           // 12dp gap between text and image
  },
  title: {
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeightBody,
    marginBottom: Spacing.xs,         // 4dp
  },
  description: {
    fontSize: Typography.fontSizeCaption,
    fontWeight: Typography.fontWeightRegular,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeightCaption,
  },

  // ── Image (right side, 1:1) ─────────────────────────────────────────────
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: BorderRadius.button, // 8dp — slight rounding on image
  },

  // ── Broken-image placeholder ────────────────────────────────────────────
  imagePlaceholder: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: BorderRadius.button,
    backgroundColor: Colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Skeleton loading state ──────────────────────────────────────────────
  skeletonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    padding: Spacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  skeletonTextBlock: {
    flex: 1,
    marginRight: Spacing.md,
  },

  // ── Error state ─────────────────────────────────────────────────────────
  errorContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
});
