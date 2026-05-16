/**
 * Design System — Typography Tokens
 * Minha Saúde Feminina
 *
 * All values are in density-independent pixels (dp/sp).
 * Requirement 1.5: font sizes for large title (24), medium title (18), body (14) and caption (12).
 */

export const Typography = {
  // Font sizes (dp)
  fontSizeLargeTitle: 24,
  fontSizeMediumTitle: 18,
  fontSizeBody: 14,
  fontSizeCaption: 12,

  // Font weights
  fontWeightRegular: '400' as const,
  fontWeightMedium: '500' as const,
  fontWeightSemiBold: '600' as const,
  fontWeightBold: '700' as const,

  // Line heights (dp)
  lineHeightLargeTitle: 32,
  lineHeightMediumTitle: 26,
  lineHeightBody: 20,
  lineHeightCaption: 16,
} as const;

export type TypographyKey = keyof typeof Typography;
