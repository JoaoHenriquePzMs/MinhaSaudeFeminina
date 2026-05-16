/**
 * AuthScreen — Shared Styles
 * Minha Saúde Feminina
 *
 * Estilos compartilhados entre LoginScreen e RegisterScreen.
 * Segue o design system do projeto (Colors, Spacing, Typography, BorderRadius).
 */

import { StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../theme';

export const styles = StyleSheet.create({
  // ── Root ──────────────────────────────────────────────────────────────────
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  flex: {
    flex: 1,
  },

  // ── Top bar (brand strip) ──────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },

  topBarBack: {
    position: 'absolute',
    left: Spacing.base,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  topBarBrand: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },

  topBarTitle: {
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textOnPrimary,
    letterSpacing: 0.3,
  },

  // ── Scroll ────────────────────────────────────────────────────────────────
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },

  // ── Card ──────────────────────────────────────────────────────────────────
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    padding: Spacing.xl,
    // Shadow iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    // Shadow Android
    elevation: 4,
  },

  cardTitle: {
    fontSize: Typography.fontSizeLargeTitle,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeightLargeTitle,
    marginBottom: Spacing.xs,
  },

  cardSubtitle: {
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightRegular,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeightBody,
    marginBottom: Spacing.lg,
  },

  // ── Field group ───────────────────────────────────────────────────────────
  fieldGroup: {
    marginBottom: Spacing.md,
  },

  fieldLabel: {
    fontSize: Typography.fontSizeCaption,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    letterSpacing: 0.2,
  },

  // ── Input ─────────────────────────────────────────────────────────────────
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.button,
    backgroundColor: Colors.surface,
    minHeight: 48,
    paddingHorizontal: Spacing.md,
  },

  inputWrapError: {
    borderColor: Colors.error,
  },

  input: {
    flex: 1,
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightRegular,
    color: Colors.textPrimary,
    paddingVertical: Spacing.sm,
    minHeight: 44,
  },

  inputFlex: {
    flex: 1,
  },

  eyeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
  },

  fieldError: {
    fontSize: Typography.fontSizeCaption,
    fontWeight: Typography.fontWeightRegular,
    color: Colors.error,
    marginTop: Spacing.xs,
    lineHeight: Typography.lineHeightCaption,
  },

  // ── Primary button ────────────────────────────────────────────────────────
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.button,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },

  btnDisabled: {
    opacity: 0.65,
  },

  btnPrimaryText: {
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textOnPrimary,
    letterSpacing: 0.3,
  },

  // ── Forgot password ───────────────────────────────────────────────────────
  forgotBtn: {
    alignSelf: 'center',
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
  },

  forgotText: {
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightMedium,
    color: Colors.primary,
  },

  // ── Divider ───────────────────────────────────────────────────────────────
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
    gap: Spacing.sm,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },

  dividerText: {
    fontSize: Typography.fontSizeCaption,
    fontWeight: Typography.fontWeightRegular,
    color: Colors.textSecondary,
  },

  // ── Outline button ────────────────────────────────────────────────────────
  btnOutline: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.button,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnOutlineText: {
    fontSize: Typography.fontSizeBody,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.primary,
    letterSpacing: 0.3,
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    marginTop: Spacing.xl,
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
  },

  footerText: {
    fontSize: Typography.fontSizeCaption,
    fontWeight: Typography.fontWeightRegular,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeightCaption + 2,
  },

  footerLink: {
    fontSize: Typography.fontSizeCaption,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
});
