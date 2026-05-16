/**
 * ContentsScreen — Styles
 * Minha Saúde Feminina
 */

import { StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../theme';

export const styles = StyleSheet.create({
  // ── Root ──────────────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scrollView: {
    flex: 1,
  },

  // ── Hero banner (gradient) ─────────────────────────────────────────────────
  heroBanner: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xl,
  },

  heroCategory: {
    fontSize: Typography.fontSizeCaption,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textOnPrimary,
    opacity: 0.85,
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },

  heroTitle: {
    fontSize: 28,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textOnPrimary,
    lineHeight: 36,
    marginBottom: Spacing.xs,
  },

  heroSubtitle: {
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightRegular,
    color: Colors.textOnPrimary,
    opacity: 0.85,
    lineHeight: Typography.lineHeightBody,
    marginBottom: Spacing.lg,
  },

  // ── Category filter chips ──────────────────────────────────────────────────
  categoriesContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingRight: Spacing.base,
  },

  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },

  categoryChipActive: {
    backgroundColor: Colors.surface,
    borderColor: Colors.surface,
  },

  categoryChipText: {
    fontSize: Typography.fontSizeCaption,
    fontWeight: Typography.fontWeightMedium,
    color: Colors.textOnPrimary,
  },

  categoryChipTextActive: {
    color: Colors.primary,
    fontWeight: Typography.fontWeightSemiBold,
  },

  // ── Content area (below banner) ────────────────────────────────────────────
  contentArea: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.base,
  },

  // ── Section header ─────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },

  sectionTitle: {
    fontSize: Typography.fontSizeMediumTitle,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeightMediumTitle,
  },

  seeAllText: {
    fontSize: Typography.fontSizeCaption,
    fontWeight: Typography.fontWeightMedium,
    color: Colors.textSecondary,
  },

  // ── Article card ───────────────────────────────────────────────────────────
  articleCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    marginBottom: Spacing.base,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  articleImagePlaceholder: {
    width: 100,
    backgroundColor: Colors.surfacePink,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 110,
  },

  articleBody: {
    flex: 1,
    padding: Spacing.base,
  },

  articleCategory: {
    fontSize: Typography.fontSizeCaption,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.primary,
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },

  articleTitle: {
    fontSize: Typography.fontSizeMediumTitle,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeightMediumTitle,
    marginBottom: Spacing.xs,
  },

  articleDescription: {
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightRegular,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeightBody,
    marginBottom: Spacing.sm,
  },

  readMoreText: {
    fontSize: Typography.fontSizeCaption,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.primary,
  },

  // ── FAQ / disclaimer banner ────────────────────────────────────────────────
  faqBanner: {
    backgroundColor: Colors.surfacePink,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    marginTop: Spacing.sm,
    marginBottom: Spacing.base,
  },

  faqTitle: {
    fontSize: Typography.fontSizeMediumTitle,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeightMediumTitle,
    marginBottom: Spacing.xs,
  },

  faqSubtitle: {
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightRegular,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeightBody,
    marginBottom: Spacing.base,
  },

  faqButton: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.button,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
  },

  faqButtonText: {
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textOnPrimary,
  },

  faqUBSRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },

  faqUBSText: {
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightMedium,
    color: Colors.primary,
  },

  // ── Article Detail Modal ───────────────────────────────────────────────────
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  modalCloseButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalHeaderCategory: {
    fontSize: Typography.fontSizeCaption,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.primary,
    letterSpacing: 0.5,
  },

  modalScroll: {
    flex: 1,
  },

  modalScrollContent: {
    paddingBottom: Spacing.xxxl,
  },

  modalTitleBlock: {
    backgroundColor: Colors.surface,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },

  modalIconCircle: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.circle,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
  },

  modalTitle: {
    fontSize: Typography.fontSizeLargeTitle,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeightLargeTitle,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },

  modalDescription: {
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightRegular,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeightBody,
    textAlign: 'center',
  },

  modalSection: {
    backgroundColor: Colors.surface,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
  },

  modalSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },

  modalSectionTitle: {
    fontSize: Typography.fontSizeMediumTitle,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeightMediumTitle,
  },

  modalBodyText: {
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightRegular,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeightBody,
  },

  modalBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },

  modalBulletDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.circle,
    marginTop: 6,
    flexShrink: 0,
  },

  modalBulletText: {
    flex: 1,
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightRegular,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeightBody,
  },

  modalWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: '#FFF8E1',
    marginTop: Spacing.sm,
    marginHorizontal: Spacing.base,
    borderRadius: BorderRadius.card,
    padding: Spacing.base,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },

  modalWarningText: {
    flex: 1,
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightMedium,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeightBody,
  },
});
