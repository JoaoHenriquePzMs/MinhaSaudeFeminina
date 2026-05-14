/**
 * QuickAccess.styles — Estilos da seção de Acesso Rápido
 * Minha Saúde Feminina
 *
 * Requisitos: 5.1, 5.2, 5.8
 */

import { StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../../theme';

export const styles = StyleSheet.create({
  /** Wrapper externo da seção */
  container: {
    width: '100%',
  },

  /** Título "Acesso Rápido" — Requisito 5.1 */
  sectionTitle: {
    fontSize: Typography.fontSizeMediumTitle,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.base, // 16dp
  },

  /**
   * Grade 2×2 — Requisitos 5.2, 5.8
   * Duas linhas de dois cards cada, com gap de 12dp entre eles.
   */
  grid: {
    width: '100%',
  },

  /** Cada linha da grade (2 cards por linha) */
  row: {
    flexDirection: 'row',
    gap: Spacing.md, // 12dp — Requisito 5.2, 5.8
  },

  /** Espaçamento entre as duas linhas */
  rowGap: {
    marginBottom: Spacing.md, // 12dp
  },
});
